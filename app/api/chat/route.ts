import { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { getModel } from '@/lib/ai/models'
import { buildSystemPrompt } from '@/lib/ai/prompt'

export const runtime = 'nodejs'
export const maxDuration = 60

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || !Array.isArray(body.messages)) {
    return new Response('Invalid body', { status: 400 })
  }

  const { messages, modelId, conversationId } = body as {
    messages: ChatMessage[]
    modelId?: string
    conversationId?: string
  }

  const model = getModel(modelId)
  const apiKey = process.env[model.envKey]
  if (!apiKey) {
    return new Response(`Missing ${model.envKey}`, { status: 500 })
  }

  // Load memory for system prompt
  const memory = await prisma.memory.findUnique({
    where: { userId: session.userId },
  })

  const systemPrompt = buildSystemPrompt(memory)

  const payload = {
    model: model.upstreamModel,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    stream: true,
    temperature: 0.7,
    max_tokens: 4096,
  }

  const upstream = await fetch(model.apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => 'unknown error')
    return new Response(`Upstream error: ${errText}`, { status: 502 })
  }

  // Persist user message + create assistant message holder
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
    await prisma.conversation.update({
      where: { id: convId },
      data: { updatedAt: new Date() },
    })
  }

  // Stream the upstream SSE → our SSE
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  let accumulated = ''

  const stream = new ReadableStream({
    async start(controller) {
      // First, send meta info (conversationId + model)
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'meta', conversationId: convId, model: model.id })}\n\n`)
      )

      const reader = upstream.body!.getReader()
      let buffer = ''

      try {
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
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`))
              continue
            }
            try {
              const json = JSON.parse(data)
              const delta = json.choices?.[0]?.delta?.content
              if (delta) {
                accumulated += delta
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'chunk', text: delta })}\n\n`)
                )
              }
            } catch {}
          }
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: String(err) })}\n\n`)
        )
      } finally {
        // Persist final assistant message
        if (assistantMessageId && accumulated) {
          try {
            await prisma.message.update({
              where: { id: assistantMessageId },
              data: { content: accumulated },
            })
            // Auto-title from first user message if still default
            if (convId) {
              const conv = await prisma.conversation.findUnique({ where: { id: convId } })
              if (conv && (conv.title === 'New chat' || conv.title === '')) {
                const title = (userMessage?.content ?? '').slice(0, 60).trim() || 'New chat'
                await prisma.conversation.update({ where: { id: convId }, data: { title } })
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
