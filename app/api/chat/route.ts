import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { getModel, getApiKey, getFallbackKeys } from '@/lib/ai/models'
import { buildSystemPrompt } from '@/lib/ai/prompt'
import { webSearch, readPage, needsWebSearch, type SearchResult } from '@/lib/ai/websearch'
import { rateLimit } from '@/lib/rate-limit'
import { verifyApiToken } from '@/lib/api-token'

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

type AuthResult = { userId: string; source: 'web' | 'api' }

async function authenticateRequest(req: NextRequest): Promise<AuthResult | null> {
  // Try session auth first (web app)
  const session = await getSession()
  if (session?.userId) return { userId: session.userId, source: 'web' }

  // Try Bearer token (VS Code extension)
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  if (token) {
    const payload = await verifyApiToken(token)
    if (payload) return { userId: payload.userId, source: 'api' }
  }

  return null
}

export async function POST(req: NextRequest) {
  try {
  const auth = await authenticateRequest(req)
  if (!auth) return new Response('Unauthorized', { status: 401 })

  const { userId, source } = auth
  const isVSCode = source === 'api'

  // Netral Code is paid-only
  if (isVSCode) {
    const { rows: planCheck } = await db.query(`SELECT plan, "planExpiresAt" FROM "User" WHERE id = $1`, [userId])
    const userPlan = planCheck[0]?.plan || 'free'
    const expired = planCheck[0]?.planExpiresAt && new Date(planCheck[0].planExpiresAt) < new Date()
    if (userPlan === 'free' || expired) {
      return new Response('Netral Code nécessite un abonnement payant (Plus, Pro ou Pro+). Rendez-vous sur netral.app/tarifs', { status: 403 })
    }
  }

  // Rate limit per IP — skip for Plus/Pro/Pro+ plans
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { rows: planRows } = await db.query(`SELECT plan, role FROM "User" WHERE id = $1`, [userId])
  const userPlan = planRows[0]?.plan || 'free'
  const userRole = planRows[0]?.role || 'user'

  // Block banned users
  if (userRole === 'banned') return new Response('Votre compte a été suspendu.', { status: 403 })

  // Input size limit (prevent abuse)
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > 500_000) {
    return new Response('Message trop long.', { status: 413 })
  }

  const isPaid = userPlan === 'plus' || userPlan === 'pro' || userPlan === 'pro_plus'

  if (!isPaid) {
    const ipRl = rateLimit(`ip:${ip}`, 3, 30_000)
    if (!ipRl.allowed) return new Response('Trop de requêtes depuis cette adresse. Réessayez dans 30 secondes.', { status: 429 })
  }

  // Per-user rate limit (even for paid users)
  const userRlLimit = isPaid ? 60 : 10
  const userRl = rateLimit(`user:${userId}`, userRlLimit, 60_000)
  if (!userRl.allowed) return new Response('Trop de requêtes. Attendez un moment.', { status: 429 })

  // Plan-based message limit
  try {
    const { rows: userRows } = await db.query(
      `SELECT plan, "messagesUsed", "messagesResetAt", "planExpiresAt" FROM "User" WHERE id = $1`, [userId]
    )
    const userData = userRows[0]
    if (userData) {
      const now = new Date()
      const resetAt = new Date(userData.messagesResetAt)
      if (now > resetAt) {
        // Free: reset weekly, Paid: reset every 2 days
        const isFree = (userData.plan || 'free') === 'free'
        const nextReset = isFree
          ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
          : new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
        await db.query(`UPDATE "User" SET "messagesUsed" = 0, "messagesResetAt" = $1 WHERE id = $2`, [nextReset, userId])
        userData.messagesUsed = 0
      }

      // Check plan expiration
      let currentPlan = userData.plan || 'free'
      if (userData.planExpiresAt && new Date(userData.planExpiresAt) < now && currentPlan !== 'free') {
        currentPlan = 'free'
        await db.query(`UPDATE "User" SET plan = 'free', "planExpiresAt" = NULL WHERE id = $1`, [userId])
      }

      const { getPlanLimit, getDailyLimit } = await import('@/lib/plans')
      const limit = getPlanLimit(currentPlan)
      if (userData.messagesUsed >= limit) {
        const resetDate = new Date(userData.messagesResetAt)
        const hours = Math.ceil((resetDate.getTime() - Date.now()) / (1000 * 60 * 60))
        return new Response(`Limite de messages atteinte. Reset dans ${hours}h. Passez à un plan supérieur.`, { status: 429 })
      }

      // Daily limit (anti-abuse for free users)
      const dailyLimit = getDailyLimit(currentPlan)
      const dailyRl = rateLimit(`daily:${userId}`, dailyLimit, 24 * 60 * 60 * 1000)
      if (!dailyRl.allowed) {
        return new Response('Limite journalière atteinte. Revenez demain ou passez à un plan supérieur.', { status: 429 })
      }

      await db.query(`UPDATE "User" SET "messagesUsed" = "messagesUsed" + 1 WHERE id = $1`, [userId])
    }
  } catch {}

  // Per-user rate limit
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
    if (model.id === 'ntrl-2.0' && userPlan !== 'pro' && userPlan !== 'pro_plus') {
      return new Response('NTRL 2.0 nécessite un abonnement Pro ou Pro+.', { status: 403 })
    }
    if (model.id === 'ntrl-1.2' && userPlan !== 'pro' && userPlan !== 'pro_plus') {
      return new Response('NTRL 1.2 nécessite un abonnement Pro ou Pro+.', { status: 403 })
    }
  } catch {}

  const primaryKey = getApiKey(model.envKey)
  const fallbackKeys = getFallbackKeys(model.envKey)
  const allKeys = [primaryKey, ...fallbackKeys].filter(Boolean)
  if (!allKeys.length) return new Response(`Missing API key configuration`, { status: 500 })

  let systemPrompt = buildSystemPrompt(parsed.data.messages as any)

  // Inject Google integrations context if user has active integrations
  if (!isVSCode) {
    try {
      const { rows: integRows } = await db.query(
        `SELECT service FROM "Integration" WHERE "userId" = $1`,
        [userId]
      )
      if (integRows.length > 0) {
        const { buildGoogleContext } = await import('@/lib/integrations/google')
        const { context: googleCtx, activity } = await buildGoogleContext(userId)
        if (googleCtx) {
          // Store activity for SSE — will be sent inside the stream
          ;(parsed.data as Record<string, unknown>).__integrationActivity = activity
          systemPrompt += `\n\n## Données personnelles de l'utilisateur (temps réel)\n${googleCtx}\n\nTu peux utiliser ces données pour répondre aux questions sur les emails et le calendrier. Pour envoyer un email ou créer un événement, demande confirmation à l'utilisateur.`
        }
      }
    } catch {}
  }

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(sseEvent(data))
      const userMessage = messages[messages.length - 1]
      let convId: string | undefined = rawConvId ?? undefined
      let assistantMessageId: string | null = null
      const textContent = userMessage?.role === 'user'
        ? (typeof userMessage.content === 'string' ? userMessage.content : (userMessage.content as any[])?.find((c: any) => c.type === 'text')?.text ?? '')
        : ''

      // Only save conversations for web users, NOT VS Code
      if (!isVSCode && userMessage?.role === 'user') {
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

      send({ type: 'meta', conversationId: isVSCode ? undefined : convId, model: model.id })

      // Notify client about active integrations being read
      const integActivity = (parsed.data as Record<string, unknown>).__integrationActivity as { services: string[]; summary: string } | undefined
      if (integActivity?.services?.length) {
        send({ type: 'integrations', services: integActivity.services, summary: integActivity.summary })
      }

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

      // Build final messages
      const clientSystemMsgs = messages.filter((m: any) => m.role === 'system').map((m: any) => m.content).join('\n')
      const finalSystemPrompt = clientSystemMsgs ? systemPrompt + '\n\n' + clientSystemMsgs : systemPrompt
      const userAndAssistantMsgs = messages.filter((m: any) => m.role !== 'system')

      const payload: Record<string, any> = {
        model: model.upstreamModel,
        messages: [{ role: 'system', content: finalSystemPrompt }, ...userAndAssistantMsgs.filter((m: any) => typeof m.content === 'string' ? m.content.trim() : true).map((m: any) => ({ role: m.role, content: m.content }))],
        stream: true,
        temperature: 0.6,
        top_p: 0.95,
        max_tokens: model.thinking ? 16384 : 4096,
      }

      // NVIDIA NIM / Qwen thinking mode
      if (model.thinking) {
        payload.chat_template_kwargs = { enable_thinking: true }
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
        // Only save to DB for web users
        if (!isVSCode && assistantMessageId && accumulated) {
          try {
            await db.query(`UPDATE "Message" SET content = $1 WHERE id = $2`, [accumulated, assistantMessageId])
            if (convId) {
              const { rows: convCheck } = await db.query(`SELECT title FROM "Conversation" WHERE id = $1`, [convId])
              const currentTitle = convCheck[0]?.title || ''
              if (currentTitle === textContent.slice(0, 60) || currentTitle === 'New chat' || currentTitle === 'Nouvelle conversation') {
                try {
                  const titleRes = await fetch(model.apiUrl, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${allKeys[0]}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      model: model.upstreamModel,
                      messages: [
                        { role: 'system', content: 'Génère un titre court (max 40 caractères) pour cette conversation. Réponds UNIQUEMENT avec le titre, rien d\'autre.' },
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
  } catch (e: any) {
    console.error('[CHAT ERROR]', e.message)
    return new Response(e.message || 'Internal server error', { status: 500 })
  }
}
