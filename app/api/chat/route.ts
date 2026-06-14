import { NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/session'
import { db } from '@/lib/db'
import { getModel, getApiKey, getFallbackKeys, MODELS, type ModelId } from '@/lib/ai/models'
import { buildSystemPrompt } from '@/lib/ai/prompt'
import { webSearch, readPage, needsWebSearch, type SearchResult } from '@/lib/ai/websearch'
import { rateLimit } from '@/lib/rate-limit'
import { verifyApiToken } from '@/lib/api-token'
import { getTokenLimit } from '@/lib/plans'
import { getProviderAdapter } from '@/lib/ai/providers'
import { getActiveTools, TOOL_EXECUTORS, type ToolResult } from '@/lib/ai/tools'
import { buildGoogleContext } from '@/lib/integrations/google'

export const runtime = 'nodejs'
export const maxDuration = 90

type TokenBucket = { tokensUsed: number; resetAt: number }
const tokenBuckets = new Map<string, TokenBucket>()

function checkTokenBudget(userId: string, plan: string): { allowed: boolean; remaining: number } {
  const limit = getTokenLimit(plan)
  const now = Date.now()
  const bucket = tokenBuckets.get(userId)
  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + 30 * 24 * 60 * 60 * 1000
    tokenBuckets.set(userId, { tokensUsed: 0, resetAt })
    return { allowed: true, remaining: limit }
  }
  const remaining = limit - bucket.tokensUsed
  return { allowed: remaining > 0, remaining }
}

function recordTokenUsage(userId: string, tokens: number) {
  const bucket = tokenBuckets.get(userId)
  if (bucket) bucket.tokensUsed += tokens
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

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
    ctx += `### [${i + 1}] ${r.title}\nURL: ${r.url}\n`
    if (r.snippet) ctx += `Extrait: ${r.snippet}\n`
    const page = pagesContent.find((p) => p.url === r.url)
    if (page?.content) ctx += `Contenu: ${page.content.slice(0, 1500)}\n`
    ctx += '\n'
  })
  ctx += '---\nCite tes sources avec [1], [2], etc.\n'
  return ctx
}

type AuthResult = { userId: string; source: 'web' | 'api' }

async function authenticateRequest(req: NextRequest): Promise<AuthResult | null> {
  const session = await getSession()
  if (session?.userId) return { userId: session.userId, source: 'web' }
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

  if (isVSCode) {
    const { rows: planCheck } = await db.query(
      `SELECT plan, "planExpiresAt" FROM "User" WHERE id = $1`, [userId]
    )
    const vsCodePlan = planCheck[0]?.plan || 'free'
    const expired = planCheck[0]?.planExpiresAt && new Date(planCheck[0].planExpiresAt) < new Date()
    if (vsCodePlan === 'free' || expired) {
      return new Response('Netral Code nécessite un abonnement payant.', { status: 403 })
    }
  }

  const { rows: userRows } = await db.query(
    `SELECT plan, role, "messagesUsed", "messagesResetAt", "planExpiresAt" FROM "User" WHERE id = $1`, [userId]
  )
  const userData = userRows[0]
  let userPlan = userData?.plan || 'free'
  const userRole = userData?.role || 'user'

  if (userRole === 'banned') return new Response('Compte suspendu.', { status: 403 })

  const now = new Date()
  if (userData && userData.planExpiresAt && new Date(userData.planExpiresAt) < now && userPlan !== 'free') {
    userPlan = 'free'
    await db.query(`UPDATE "User" SET plan = 'free', "planExpiresAt" = NULL WHERE id = $1`, [userId])
  }

  const isPaid = userPlan === 'plus' || userPlan === 'pro' || userPlan === 'pro_plus'

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!isPaid) {
    const ipRl = rateLimit(`ip:${ip}`, 3, 30_000)
    if (!ipRl.allowed) return new Response('Trop de requêtes.', { status: 429 })
  }

  const userRlLimit = isPaid ? 60 : 10
  const userRl = rateLimit(`user:${userId}`, userRlLimit, 60_000)
  if (!userRl.allowed) return new Response('Trop de requêtes.', { status: 429 })

  try {
    if (userData) {
      const resetAt = new Date(userData.messagesResetAt)
      if (now > resetAt) {
        const nextReset = new Date(now.getTime() + (userPlan === 'free' ? 7 : 2) * 24 * 60 * 60 * 1000)
        await db.query(`UPDATE "User" SET "messagesUsed" = 0, "messagesResetAt" = $1 WHERE id = $2`, [nextReset, userId])
        userData.messagesUsed = 0
      }
      const { getPlanLimit, getDailyLimit } = await import('@/lib/plans')
      const limit = getPlanLimit(userPlan)
      if (userData.messagesUsed >= limit) {
        return new Response('Limite de messages atteinte.', { status: 429 })
      }
      const dailyLimit = getDailyLimit(userPlan)
      const dailyRl = rateLimit(`daily:${userId}`, dailyLimit, 24 * 60 * 60 * 1000)
      if (!dailyRl.allowed) {
        return new Response('Limite journalière atteinte.', { status: 429 })
      }
      await db.query(`UPDATE "User" SET "messagesUsed" = "messagesUsed" + 1 WHERE id = $1`, [userId])
    }
  } catch {}

  const rl = rateLimit(`chat:${userId}`, 30, 60_000)
  if (!rl.allowed) {
    return new Response('Too many requests.', { status: 429 })
  }

  const rawBody = await req.json().catch(() => null)
  const parsed = ChatRequestSchema.safeParse(rawBody)
  if (!parsed.success) return new Response('Invalid request', { status: 400 })

  const { messages, modelId, conversationId: rawConvId, webSearch: useWebSearch } = parsed.data
  let model = getModel(modelId)

  if (model.id === 'ntrl-1.2' && !isPaid) {
    return new Response(`NTRL 1.2 (Gemini) nécessite un abonnement payant.`, { status: 403 })
  }
  // NTRL 2.0 is free (BluesMinds / GPT-5 Nano)

  const tokenCheck = checkTokenBudget(userId, userPlan)
  if (!tokenCheck.allowed) {
    return new Response('Limite de tokens atteinte.', { status: 429 })
  }

  let primaryKey = getApiKey(model.envKey)
  const fallbackKeys = getFallbackKeys(model.envKey)
  const allKeys = [primaryKey, ...fallbackKeys].filter(Boolean)

  // Auto-fallback : si la clé API du modèle sélectionné est absente, basculer sur un modèle dispo
  let modelFallback = false
  let fallbackNote: string | undefined
  if (!allKeys.length) {
    // Sauvegarder le modèle original avant fallback
    const originalDisplayName = model.displayName
    const fallbackOrder: ModelId[] = ['ntrl-1.3', 'ntrl-1.2', 'ntrl-2.0']
    let found = false
    for (const fbId of fallbackOrder) {
      if (fbId === model.id) continue
      const fbModel = MODELS[fbId]
      const fbKey = getApiKey(fbModel.envKey)
      if (fbKey) {
        // Vérifier le paywall pour les modèles payants (NTRL 1.2 uniquement)
        if (fbModel.id === 'ntrl-1.2' && !isPaid) continue
        model = fbModel
        primaryKey = fbKey
        fallbackKeys.length = 0
        allKeys.length = 0
        allKeys.push(fbKey)
        const extra = getFallbackKeys(fbModel.envKey)
        if (extra.length) allKeys.push(...extra)
        modelFallback = true
        fallbackNote = `⚠️ ${originalDisplayName} non disponible (clé API manquante) → redirigé vers ${fbModel.displayName}`
        found = true
        break
      }
    }
    if (!found) {
      console.error(`[CHAT] Aucune clé API disponible pour le modèle ${model.id}`)
      return new Response("Aucune clé API configurée. Vérifiez les variables d'environnement (NTRL_2_API_KEY, MISTRAL_API_KEY, GEMINI_API_KEY).", { status: 500 })
    }
  }

  const userMessage = messages[messages.length - 1]
  const textContent = userMessage?.role === 'user'
    ? (typeof userMessage.content === 'string' ? userMessage.content : (userMessage.content as any[])?.find((c: any) => c.type === 'text')?.text ?? '')
    : ''

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(sseEvent(data))
      let convId: string | undefined = rawConvId ?? undefined
      let assistantMessageId: string | null = null

      // Save conversation
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

      // Notifier le fallback si le modèle a été changé automatiquement
      if (modelFallback && fallbackNote) {
        send({ type: 'fallback', message: fallbackNote, to: model.id })
      }

      // Google context
      let integrationActivity: { services: string[]; summary: string } | undefined
      if (!isVSCode) {
        try {
          const { context: googleCtx, activity } = await buildGoogleContext(userId)
          if (googleCtx && activity?.services?.length) {
            integrationActivity = activity
            send({ type: 'integrations', services: activity.services, summary: activity.summary })
          }
        } catch {}
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
            send({ type: 'status', status: 'thinking' })
          }
        } catch {}
      }

      // Build prompt
      let systemPrompt = buildSystemPrompt(parsed.data.messages as any)
      if (searchResults.length > 0) {
        const pagesContent = await Promise.all(
          searchResults.slice(0, 2).map(async (r) => ({ url: r.url, content: await readPage(r.url).catch(() => '') }))
        )
        systemPrompt += '\n\n' + buildSearchContext(searchResults, pagesContent)
      }

      const clientSystemMsgs = messages.filter((m: any) => m.role === 'system').map((m: any) => m.content).join('\n')
      const finalSystemPrompt = clientSystemMsgs ? systemPrompt + '\n\n' + clientSystemMsgs : systemPrompt
      const userAndAssistantMsgs = messages.filter((m: any) => m.role !== 'system')

      const adapter = getProviderAdapter(model.provider)
      const temperature = model.defaultParams?.temperature ?? 0.7
      const max_tokens = model.defaultParams?.max_tokens ?? 2048

      // Get active tools — available to ALL users (integrations ≠ AI model)
      let tools: Record<string, unknown>[] | undefined
      let toolModel = model // model for tool execution (may differ from display model)
      let toolAdapter = adapter // adapter for tool calls (may differ from display adapter)
      let toolKeys: string[] = [] // separate keys for tool API calls
      if (!isVSCode) {
        const active = await getActiveTools(userId)
        if (active.length > 0) {
          // If current model doesn't support function calling, skip tools entirely
          // (BluesMinds/gpt-5-nano crashes when receiving tools)
          if (model.supportsTools) {
            tools = active as unknown as Record<string, unknown>[]
          } else {
            // Auto-switch to a tool-compatible model
            const toolFallbackOrder: ModelId[] = ['ntrl-1.3', 'ntrl-1.2']
            for (const fbId of toolFallbackOrder) {
              const fbModel = MODELS[fbId]
              if (!fbModel.supportsTools) continue
              const fbKey = getApiKey(fbModel.envKey)
              if (fbKey) {
                toolModel = fbModel
                toolAdapter = getProviderAdapter(fbModel.provider)
                toolKeys = [fbKey, ...getFallbackKeys(fbModel.envKey)].filter(Boolean)
                tools = active as unknown as Record<string, unknown>[]
                send({ type: 'fallback', message: `🔧 ${model.displayName} ne supporte pas les intégrations → outils exécutés via ${fbModel.displayName}`, to: fbModel.id })
                break
              }
            }
            if (!toolKeys.length) {
              // No tool-capable model available, skip tools
              tools = undefined
            }
          }
        }
      }

      // Tool execution loop
      const MAX_TOOL_ITERATIONS = 4
      const conversationMessages: Array<{
        role: string; content: unknown; tool_calls?: unknown[];
        tool_call_id?: string; name?: string
      }> = [
        { role: 'system', content: finalSystemPrompt },
        ...userAndAssistantMsgs
          .filter((m: any) => typeof m.content === 'string' ? (m.content as string).trim() : true)
          .map((m: any) => ({ role: m.role, content: m.content })),
      ]

      let fullAccumulated = ''

      // Tool detection phase
      if (tools && tools.length > 0) {
        for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS - 1; iteration++) {
          send({ type: 'status', status: 'thinking' })

          const nonStreamPayload = toolAdapter.buildPayload({
            model: toolModel.upstreamModel,
            messages: conversationMessages as any,
            stream: false,
            temperature: 0.3,
            max_tokens: 1024,
            tools,
          })

          const keys = toolKeys.length > 0 ? toolKeys : allKeys
          let toolResponse: Response | null = null
          for (const key of keys) {
            toolResponse = await fetch(toolModel.apiUrl, {
              method: 'POST',
              headers: toolAdapter.buildHeaders(key),
              body: JSON.stringify(nonStreamPayload),
              signal: AbortSignal.timeout(15000),
            })
            if (toolResponse.ok) break
          }

          if (!toolResponse || !toolResponse.ok) break

          const responseText = await toolResponse.text()
          const { content: nonStreamContent, toolCalls } = toolAdapter.parseResponse(responseText)

          if (!toolCalls || toolCalls.length === 0) {
            break
          }

          send({ type: 'status', status: 'executing' })

          conversationMessages.push({
            role: 'assistant',
            content: nonStreamContent ?? null,
            tool_calls: toolCalls,
          })

          for (const toolCall of toolCalls) {
            const toolName = toolCall.function.name
            let args: Record<string, unknown> = {}
            try { args = JSON.parse(toolCall.function.arguments) } catch {}

            send({ type: 'tool_use', toolCallId: toolCall.id, tool: toolName, args })
            send({ type: 'status', status: 'executing', tool: toolName })

            const executor = TOOL_EXECUTORS[toolName]
            const result: ToolResult = executor
              ? await executor(userId, args)
              : { success: false, error: 'Outil inconnu' }

            send({ type: 'tool_result', toolCallId: toolCall.id, tool: toolName, result })

            conversationMessages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              name: toolName,
              content: JSON.stringify(result),
            })

            if (result.success) {
              if (toolName === 'generate_image') {
                const imageId = (result.data as any)?.imageId
                if (imageId) {
                  fullAccumulated += `\n🔧 **${toolName}** ✓ [IMAGE:${imageId}]\n`
                } else {
                  fullAccumulated += `\n🔧 **${toolName}** ✓\n`
                }
              } else {
                fullAccumulated += `\n🔧 **${toolName}** ✓\n`
              }
            } else {
              fullAccumulated += `\n⚠️ **${toolName}**: ${result.error}\n`
            }
          }
        }
      }

      // Final streaming call
      send({ type: 'status', status: 'thinking' })

      // If the final streaming model doesn't support tools, strip tool-related fields
      // to avoid confusing APIs like BluesMinds (gpt-5-nano) that crash on unknown fields
      const shouldStripTools = !model.supportsTools && conversationMessages.some(m => m.tool_calls || m.tool_call_id)
      const streamingMessages = conversationMessages.map(m => {
        const msg: Record<string, unknown> = { role: m.role, content: m.content }
        if (!shouldStripTools) {
          if (m.tool_calls) msg.tool_calls = m.tool_calls
          if (m.tool_call_id) msg.tool_call_id = m.tool_call_id
          if (m.name) msg.name = m.name
        }
        return msg
      })
      // If tools were stripped, inject a summary of what happened instead
      if (shouldStripTools && fullAccumulated) {
        const systemIdx = streamingMessages.findIndex((m: any) => m.role === 'system')
        const toolSummary = { role: 'user' as const, content: `[Intégrations exécutées en arrière-plan]\n${fullAccumulated.trim()}\n\nRéponds à la question initiale en tenant compte de ces résultats.` }
        if (systemIdx >= 0) {
          streamingMessages.splice(systemIdx + 1, 0, toolSummary)
        }
      }
      const payload = adapter.buildPayload({
        model: model.upstreamModel,
        messages: streamingMessages as any,
        stream: true,
        temperature,
        max_tokens,
      })

      let accumulated = fullAccumulated
      try {
        let upstream: Response | null = null
        for (const key of allKeys) {
          upstream = await fetch(model.apiUrl, {
            method: 'POST',
            headers: adapter.buildHeaders(key),
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(120000),
          })
          if (upstream.ok) break
        }

        if (!upstream || !upstream.ok || !upstream.body) {
          const errBody = await upstream?.text().catch(() => '') ?? ''
          if (upstream?.status === 429 || errBody.includes('capacity') || errBody.includes('quota')) {
            send({ type: 'error', message: `model_unavailable:${model.id}` })
          } else {
            send({ type: 'error', message: `Erreur: ${errBody.slice(0, 200)}` })
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
            if (data === '[DONE]') continue
            try {
              const delta = adapter.parseChunk(data)
              if (delta) { accumulated += delta; send({ type: 'chunk', text: delta }) }
            } catch {}
          }
        }

        if (searchResults.length > 0) {
          const sources = '\n\n---\n**Sources:**\n' + searchResults.map((r, i) => `${i + 1}. [${r.title}](${r.url}) — *${r.domain}*`).join('\n')
          accumulated += sources
          send({ type: 'chunk', text: sources })
        }
      } catch (err: any) {
        send({ type: 'error', message: String(err.message || err) })
      }

      // Finalize
      send({ type: 'done' })

      if (accumulated) {
        const inputText = userAndAssistantMsgs.map((m: any) => typeof m.content === 'string' ? m.content : '').join('')
        const est = estimateTokens(inputText) + estimateTokens(accumulated)
        recordTokenUsage(userId, est)
      }

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
                  headers: adapter.buildHeaders(allKeys[0]),
                  body: JSON.stringify({
                    model: model.upstreamModel,
                    messages: [
                      { role: 'system', content: 'Titre court (max 40 chars) pour cette conversation. Réponds UNIQUEMENT le titre.' },
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
  } catch (e: any) {
    console.error('[CHAT]', e.message)
    return new Response(e.message || 'Internal error', { status: 500 })
  }
}