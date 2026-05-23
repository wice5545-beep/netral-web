import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { getModel } from '@/lib/ai/models'
import { buildSystemPrompt } from '@/lib/ai/prompt'
import { webSearch, readPage, needsWebSearch, type SearchResult } from '@/lib/ai/websearch'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 90

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(8000),
  })).min(1).max(100),
  modelId: z.string().max(50).optional(),
  conversationId: z.string().min(1).max(100).optional().nullable(),
  webSearch: z.boolean().optional(),
})

const encoder = new TextEncoder()

function sseEvent(data: object): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
}

function buildSearchContext(results: SearchResult[], pagesContent: { url: string; content: string }[]): string {
  let ctx = '## Résultats de recherche web\n\n'
  results.forEach((r, i) => {
    ctx += `### [${i + 1}] ${r.title}\n`
    ctx += `URL : ${r.url}\n`
    if (r.snippet) ctx += `Extrait : ${r.snippet}\n`
    const page = pagesContent.find((p) => p.url === r.url)
    if (page?.content) ctx += `Contenu : ${page.content.slice(0, 1500)}\n`
    ctx += '\n'
  })
  ctx += '---\nCite tes sources avec [1], [2], etc. en exposant dans ta réponse.\n'
  return ctx
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Rate limit: 30 messages / minute per user
  const rl = rateLimit(`chat:${session.userId}`, 30, 60_000)
  if (!rl.allowed) {
    return new Response('Too many requests. Please wait a moment.', {
      status: 429,
      headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
    })
  }

  const rawBody = await req.json().catch(() => null)
  const parsed = ChatRequestSchema.safeParse(rawBody)
  if (!parsed.success) {
    return new Response('Invalid request body', { status: 400 })
  }

  const { messages, modelId, conversationId: rawConvId, webSearch: useWebSearch } = parsed.data
  const conversationId: string | undefined = rawConvId ?? undefined

  const model = getModel(modelId)
  const apiKey = process.env[model.envKey]
  if (!apiKey) {
    return new Response(`Missing ${model.envKey}`, { status: 500 })
  }

  const memory = await prisma.memory.findUnique({ where: { userId: session.userId } })
  let systemPrompt = buildSystemPrompt(memory)

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(sseEvent(data))

      // Persist user message & create conversation
      const userMessage = messages[messages.length - 1]
      let convId = conversationId
      let assistantMessageId: string | null = null

      if (userMessage?.role === 'user') {
        if (!convId) {
          const conv = await prisma.conversation.create({
            data: {
              userId: session.userId,
              model: model.id,
              title: userMessage.content.slice(0, 60),
            },
          })
          convId = conv.id
        }
        await prisma.message.create({
          data: { conversationId: convId, role: 'user', content: userMessage.content, model: model.id },
        })
        const ass = await prisma.message.create({
          data: { conversationId: convId, role: 'assistant', content: '', model: model.id },
        })
        assistantMessageId = ass.id
        await prisma.conversation.update({ where: { id: convId }, data: { updatedAt: new Date() } })
      }

      send({ type: 'meta', conversationId: convId, model: model.id })

      // Web search phase — manuel OU auto-détecté
      const shouldSearch = useWebSearch || (userMessage?.content ? needsWebSearch(userMessage.content) : false)
      let searchResults: SearchResult[] = []
      if (shouldSearch && userMessage?.content) {
        try {
          send({ type: 'status', status: 'searching' })
          const searchRes = await webSearch(userMessage.content, 4)
          searchResults = searchRes.results

          if (searchResults.length > 0) {
            send({ type: 'status', status: 'reading' })
            // Lire les 2 premières pages en parallèle
            const pagesContent = await Promise.all(
              searchResults.slice(0, 2).map(async (r) => ({
                url: r.url,
                content: await readPage(r.url).catch(() => ''),
              }))
            )

            send({ type: 'status', status: 'thinking' })
            const searchCtx = buildSearchContext(searchResults, pagesContent)
            systemPrompt += '\n\n' + searchCtx
          }
        } catch {
          // Silently continue without web search if it fails
        }
      }

      // Stream LLM response
      const payload = {
        model: model.upstreamModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
            .filter((m) => m.content.trim() !== '')
            .map((m) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }

      let accumulated = ''

      try {
        const upstream = await fetch(model.apiUrl, {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!upstream.ok || !upstream.body) {
          const errText = await upstream.text().catch(() => 'unknown')
          send({ type: 'error', message: `Erreur upstream: ${errText.slice(0, 200)}` })
          controller.close()
          return
        }

        const reader = upstream.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (data === '[DONE]') {
              send({ type: 'done' })
              continue
            }
            try {
              const json = JSON.parse(data)
              const delta = json.choices?.[0]?.delta?.content
              if (delta) {
                accumulated += delta
                send({ type: 'chunk', text: delta })
              }
            } catch {}
          }
        }

        // Append sources section if web search was used
        if (searchResults.length > 0) {
          const sourcesSection = '\n\n---\n**Sources :**\n' +
            searchResults.map((r, i) => `${i + 1}. [${r.title}](${r.url}) — *${r.domain}*`).join('\n')
          accumulated += sourcesSection
          send({ type: 'chunk', text: sourcesSection })
        }
      } catch (err) {
        send({ type: 'error', message: String(err) })
      } finally {
        // Persist assistant message
        if (assistantMessageId && accumulated) {
          try {
            await prisma.message.update({ where: { id: assistantMessageId }, data: { content: accumulated } })
            if (convId) {
              const conv = await prisma.conversation.findUnique({ where: { id: convId } })
              if (conv && (conv.title === 'New chat' || conv.title === '')) {
                await prisma.conversation.update({
                  where: { id: convId },
                  data: { title: (userMessage?.content ?? '').slice(0, 60).trim() || 'Nouvelle conversation' },
                })
              }
            }
          } catch {}
        }
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
