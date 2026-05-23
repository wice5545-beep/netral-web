import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { getModel, getApiKey, getFallbackKeys } from '@/lib/ai/models'
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
  let userId: string | undefined

  // Try session auth first, then Bearer token (for VS Code extension)
  const session = await getSession()
  if (session?.userId) {
    userId = session.userId
  } else {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (token?.startsWith('ntrl_')) {
      try { userId = Buffer.from(token.replace('ntrl_', ''), 'base64url').toString() } catch {}
    }
  }
  if (!userId) return new Response('Unauthorized', { status: 401 })

  // IP-based anti-abuse for free users (even with VPN, limits per IP)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  const ipRl = rateLimit(`ip:${ip}`, 5, 60_000) // max 5 msgs/min per IP
  if (!ipRl.allowed) {
    return new Response('Trop de requêtes depuis cette adresse.', { status: 429 })
  }

  // Plan-based message limit
  try {
    const { rows: userRows } = await db.query(
      `SELECT plan, "messagesUsed", "messagesResetAt" FROM "User" WHERE id = $1`, [userId]
    )
    const userData = userRows[0]
    if (userData) {
      const now = new Date()
      const resetAt = new Date(userData.messagesResetAt)
      if (now > resetAt) {
        const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        await db.query(`UPDATE "User" SET "messagesUsed" = 0, "messagesResetAt" = $1 WHERE id = $2`, [nextReset, userId])
        userData.messagesUsed = 0
      }
      const { getPlanLimit } = await import('@/lib/plans')
      const limit = getPlanLimit(userData.plan || 'free')
      if (userData.messagesUsed >= limit) {
        return new Response('Limite de messages atteinte. Passez à un plan supérieur.', { status: 429 })
      }
      await db.query(`UPDATE "User" SET "messagesUsed" = "messagesUsed" + 1 WHERE id = $1`, [userId])
    }
  } catch {}

  const rl = rateLimit(`chat:${userId}`, 30, 60_000)
  if (!rl.allowed) {
    return new Response('Too many requests.', { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } })
  }

  const rawBody = await req.json().catch(() => null)
  const parsed = ChatRequestSchema.safeParse(rawBody)
  if (!parsed.success) return new Response('Invalid request body', { status: 400 })

  const { messages, modelId, conversationId: rawConvId, webSearch: useWebSearch } = parsed.data
  const model = getModel(modelId)

  // Restrict model access by plan
  try {
    const { rows: planRows } = await db.query(`SELECT plan FROM "User" WHERE id = $1`, [userId])
    const userPlan = planRows[0]?.plan || 'free'
    if (model.id === 'ntrl-1.2' && userPlan !== 'pro' && userPlan !== 'pro_plus') {
      return new Response('NTRL 1.2 nécessite un abonnement Pro ou Pro+.', { status: 403 })
    }
  } catch {}

  const primaryKey = getApiKey(model.envKey)
  const fallbackKeys = getFallbackKeys(model.envKey)
  const allKeys = [primaryKey, ...fallbackKeys].filter(Boolean)
  if (!allKeys.length) return new Response(`Missing ${model.envKey}`, { status: 500 })

  let systemPrompt = buildSystemPrompt(parsed.data.messages as any)

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
            [userId, textContent.slice(0, 60), model.id]
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
      // Merge any client system messages into the server system prompt
      const clientSystemMsgs = messages.filter((m: any) => m.role === 'system').map((m: any) => m.content).join('\n')
      const finalSystemPrompt = clientSystemMsgs ? systemPrompt + '\n\n' + clientSystemMsgs : systemPrompt
      const userAndAssistantMsgs = messages.filter((m: any) => m.role !== 'system')

      const payload = {
        model: model.upstreamModel,
        messages: [{ role: 'system', content: finalSystemPrompt }, ...userAndAssistantMsgs.filter((m: any) => typeof m.content === 'string' ? m.content.trim() : true).map((m: any) => ({ role: m.role, content: m.content }))],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }

      let accumulated = ''
      try {
        let upstream: Response | null = null
        for (const key of allKeys) {
          upstream = await fetch(model.apiUrl, {
            method: 'POST',
            headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          if (upstream.ok) break
          // If 429 (rate limit) or 401, try next key
          if (upstream.status === 429 || upstream.status === 401) continue
          break
        }

        if (!upstream || !upstream.ok || !upstream.body) {
          const errBody = await upstream?.text().catch(() => '') ?? ''
          if (upstream?.status === 429 || errBody.includes('capacity') || errBody.includes('quota')) {
            send({ type: 'error', message: `model_unavailable:${model.id}` })
          } else {
            send({ type: 'error', message: `Erreur upstream: ${errBody.slice(0, 200)}` })
          }
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
            // AI-generated title
            if (convId) {
              const { rows: convCheck } = await db.query(`SELECT title FROM "Conversation" WHERE id = $1`, [convId])
              const currentTitle = convCheck[0]?.title || ''
              if (currentTitle === textContent.slice(0, 60) || currentTitle === textContent || currentTitle === 'New chat' || currentTitle === 'Nouvelle conversation') {
                try {
                  const titleRes = await fetch(model.apiUrl, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${allKeys[0]}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      model: model.upstreamModel,
                      messages: [
                        { role: 'system', content: 'Génère un titre court (max 40 caractères) pour cette conversation. Réponds UNIQUEMENT avec le titre, rien d\'autre. Pas de guillemets.' },
                        { role: 'user', content: textContent.slice(0, 200) },
                        { role: 'assistant', content: accumulated.slice(0, 300) },
                      ],
                      max_tokens: 30,
                      temperature: 0.5,
                    }),
                  })
                  if (titleRes.ok) {
                    const titleData = await titleRes.json()
                    const aiTitle = titleData.choices?.[0]?.message?.content?.trim().slice(0, 50)
                    if (aiTitle && aiTitle.length > 2) {
                      await db.query(`UPDATE "Conversation" SET title = $1 WHERE id = $2`, [aiTitle, convId])
                      send({ type: 'title', title: aiTitle })
                    }
                  }
                } catch {}
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
