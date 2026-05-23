import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { getModel } from '@/lib/ai/models'
import { buildSystemPrompt } from '@/lib/ai/prompt'
import { webSearch, readPage, needsWebSearch, type SearchResult } from '@/lib/ai/websearch'
import { rateLimit } from '@/lib/rate-limit'

export const runtime = 'nodejs'
export const maxDuration = 90

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.any(),
  })).min(1).max(200),
  modelId: z.string().max(50).optional(),
  conversationId: z.string().max(200).optional().nullable(),
  webSearch: z.boolean().optional(),
})

const encoder = new TextEncoder()
function sseEvent(data: object): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
}

function buildSearchContext(results: SearchResult[], pagesContent: { url: string; content: string }[]): string {
  let ctx = '## Résultats de recherche web\n\n'
  results.forEach((r, i) => {
    ctx += `### [${i + 1}] ${r.title}\nURL : ${r.url}\n`
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
  if (!session?.userId) return new Response('Unauthorized', { status: 401 })

  const rl = rateLimit(`chat:${session.userId}`, 30, 60_000)
  if (!rl.allowed) {
    return new Response('Too many requests.', { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } })
  }

  const rawBody = await req.json().catch(() => null)
  const parsed = ChatRequestSchema.safeParse(rawBody)
  if (!parsed.success) return new Response('Invalid request body', { status: 400 })

  const { messages, modelId, conversationId: rawConvId, webSearch: useWebSearch } = parsed.data
  const model = getModel(modelId)
  const apiKey = process.env[model.envKey]
  if (!apiKey) return new Response(`Missing ${model.envKey}`, { status: 500 })

  let systemPrompt = buildSystemPrompt()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(sseEvent(data))
      const userMessage = messages[messages.length - 1]
      let convId: string | undefined = rawConvId ?? undefined
      let assistantMessageId: string | null = null
      const textContent = userMessage?.role === 'user'
        ? (typeof userMessage.content === 'string' ? userMessage.content : (userMessage.content as any[])?.find((c: any) => c.type === 'text')?.text ?? '')
        : ''

      if (userMessage?.role === 'user') {
        if (!convId) {
          const { rows } = await db.query(
            `INSERT INTO "Conversation" ("id", "userId", "title", "model", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, now(), now()) RETURNING id`,
            [session.userId, textContent.slice(0, 60), model.id]
          )
          convId = rows[0].id
        }
        await db.query(
          `INSERT INTO "Message" ("id", "conversationId", "role", "content", "model", "createdAt") VALUES (gen_random_uuid(), $1, 'user', $2, $3, now())`,
          [convId, textContent, model.id]
        )
        const { rows: assRows } = await db.query(
          `INSERT INTO "Message" ("id", "conversationId", "role", "content", "model", "createdAt") VALUES (gen_random_uuid(), $1, 'assistant', '', $2, now()) RETURNING id`,
          [convId, model.id]
        )
        assistantMessageId = assRows[0].id
        await db.query(`UPDATE "Conversation" SET "updatedAt" = now() WHERE id = $1`, [convId])
      }

      send({ type: 'meta', conversationId: convId, model: model.id })

      // Web search
      const shouldSearch = useWebSearch || (textContent ? needsWebSearch(textContent) : false)
      let searchResults: SearchResult[] = []
      if (shouldSearch && textContent) {
        try {
          send({ type: 'status', status: 'searching' })
          const searchRes = await webSearch(textContent, 4)
          searchResults = searchRes.results
          if (searchResults.length > 0) {
            send({ type: 'status', status: 'reading' })
            const pagesContent = await Promise.all(
              searchResults.slice(0, 2).map(async (r) => ({ url: r.url, content: await readPage(r.url).catch(() => '') }))
            )
            send({ type: 'status', status: 'thinking' })
            systemPrompt += '\n\n' + buildSearchContext(searchResults, pagesContent)
          }
        } catch {}
      }

      // Stream LLM
      const payload = {
        model: model.upstreamModel,
        messages: [{ role: 'system', content: systemPrompt }, ...messages.filter((m) => m.content.trim()).map((m) => ({ role: m.role, content: m.content }))],
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
          send({ type: 'error', message: `Erreur upstream: ${(await upstream.text().catch(() => '')).slice(0, 200)}` })
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
            if (data === '[DONE]') { send({ type: 'done' }); continue }
            try {
              const delta = JSON.parse(data).choices?.[0]?.delta?.content
              if (delta) { accumulated += delta; send({ type: 'chunk', text: delta }) }
            } catch {}
          }
        }

        if (searchResults.length > 0) {
          const sourcesSection = '\n\n---\n**Sources :**\n' + searchResults.map((r, i) => `${i + 1}. [${r.title}](${r.url}) — *${r.domain}*`).join('\n')
          accumulated += sourcesSection
          send({ type: 'chunk', text: sourcesSection })
        }
      } catch (err) {
        send({ type: 'error', message: String(err) })
      } finally {
        if (assistantMessageId && accumulated) {
          try {
            await db.query(`UPDATE "Message" SET content = $1 WHERE id = $2`, [accumulated, assistantMessageId])
            // Auto-generate title from AI response
            if (convId) {
              const { rows: convCheck } = await db.query(`SELECT title FROM "Conversation" WHERE id = $1`, [convId])
              const currentTitle = convCheck[0]?.title || ''
              // Only auto-title if title is still the user's first message or default
              if (currentTitle.length <= 60 && (currentTitle === textContent.slice(0, 60) || currentTitle === textContent || currentTitle === 'New chat' || currentTitle === 'Nouvelle conversation')) {
                const clean = accumulated.replace(/[#*_`\n]/g, ' ').replace(/\s+/g, ' ').trim()
                const firstSentence = clean.split(/[.!?]/)[0]?.trim()
                let title = ''
                if (firstSentence && firstSentence.length >= 5 && firstSentence.length <= 55) {
                  title = firstSentence
                } else if (clean.length > 5) {
                  title = clean.slice(0, 45).trim()
                }
                if (title) {
                  await db.query(`UPDATE "Conversation" SET title = $1 WHERE id = $2`, [title, convId])
                  send({ type: 'title', title })
                }
              }
            }
          } catch {}
        }
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' },
  })
}
