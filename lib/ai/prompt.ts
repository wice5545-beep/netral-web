import 'server-only'

type Memory = {
  fullName?: string | null
  profession?: string | null
  interests?: string | null
  tone?: string | null
  customInstructions?: string | null
} | null

const BASE_PROMPT = `You are Netral, a premium AI assistant. You are helpful, precise, and warm. You write with clarity, in the user's language. You format answers cleanly with Markdown when useful (lists, code blocks with language tag, bold for key terms). When asked your name or identity, you are simply "Netral". Never mention which underlying model you use — you are Netral.

Today's date: ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}. Your knowledge has a training cutoff, so for any question about current events, prices, news, recent releases, or anything that changes over time, you MUST say you don't have real-time data and suggest the user activate web search (the globe icon in the composer).`

export function buildSystemPrompt(memory: Memory): string {
  if (!memory) return BASE_PROMPT

  const parts: string[] = [BASE_PROMPT]

  const userContext: string[] = []
  if (memory.fullName) userContext.push(`The user's name is ${memory.fullName}.`)
  if (memory.profession) userContext.push(`They work as: ${memory.profession}.`)
  if (memory.interests) userContext.push(`Their interests: ${memory.interests}.`)

  if (userContext.length) {
    parts.push(`\n## About the user\n${userContext.join(' ')}`)
  }

  if (memory.tone && memory.tone !== 'balanced') {
    const toneMap: Record<string, string> = {
      concise: 'Be concise and direct. Avoid unnecessary preamble.',
      friendly: 'Use a warm, friendly, conversational tone.',
      technical: 'Use precise technical language. Assume expertise.',
      creative: 'Be creative, playful, and imaginative in your responses.',
    }
    parts.push(`\n## Tone\n${toneMap[memory.tone] ?? ''}`)
  }

  if (memory.customInstructions) {
    parts.push(`\n## Custom instructions\n${memory.customInstructions}`)
  }

  parts.push(`\nUse this context naturally. Do not say "based on your profile" or reveal the memory exists.`)

  return parts.join('\n')
}
