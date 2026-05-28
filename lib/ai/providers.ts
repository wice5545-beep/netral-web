/**
 * Provider adapter system for AI model providers.
 * Makes it trivial to add new providers (groq, openrouter, etc.) in the future.
 */

export interface ProviderAdapter {
  /** Build HTTP headers for the upstream API request */
  buildHeaders(apiKey: string): Record<string, string>
  /** Build the request payload from model/messages/params */
  buildPayload(options: PayloadOptions): Record<string, unknown>
  /** Parse an SSE chunk line and return the text delta, or null if not a content chunk */
  parseChunk(data: string): string | null
}

export interface PayloadOptions {
  model: string
  messages: Array<{ role: string; content: unknown }>
  stream: boolean
  temperature: number
  max_tokens: number
  top_p?: number
}

/**
 * OpenAI-compatible adapter used by most providers (Mistral, Google, Cerebras, Groq, etc.)
 */
const openaiCompatibleAdapter: ProviderAdapter = {
  buildHeaders(apiKey: string) {
    return {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }
  },
  buildPayload(options: PayloadOptions) {
    const payload: Record<string, unknown> = {
      model: options.model,
      messages: options.messages,
      stream: options.stream,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
    }
    if (options.top_p !== undefined) {
      payload.top_p = options.top_p
    }
    return payload
  },
  parseChunk(data: string): string | null {
    if (data === '[DONE]') return null
    try {
      const parsed = JSON.parse(data)
      return parsed.choices?.[0]?.delta?.content ?? null
    } catch {
      return null
    }
  },
}

/**
 * Cerebras adapter - OpenAI-compatible format
 */
const cerebrasAdapter: ProviderAdapter = {
  buildHeaders(apiKey: string) {
    return {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }
  },
  buildPayload(options: PayloadOptions) {
    const payload: Record<string, unknown> = {
      model: options.model,
      messages: options.messages,
      stream: options.stream,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
    }
    if (options.top_p !== undefined) {
      payload.top_p = options.top_p
    }
    return payload
  },
  parseChunk(data: string): string | null {
    if (data === '[DONE]') return null
    try {
      const parsed = JSON.parse(data)
      return parsed.choices?.[0]?.delta?.content ?? null
    } catch {
      return null
    }
  },
}

const adapterMap: Record<string, ProviderAdapter> = {
  cerebras: cerebrasAdapter,
  mistral: openaiCompatibleAdapter,
  google: openaiCompatibleAdapter,
  groq: openaiCompatibleAdapter,
  nvidia: openaiCompatibleAdapter,
  'openai-compatible': openaiCompatibleAdapter,
}

/**
 * Get the provider adapter for a given provider name.
 * Falls back to the generic OpenAI-compatible adapter.
 */
export function getProviderAdapter(provider: string): ProviderAdapter {
  return adapterMap[provider] ?? openaiCompatibleAdapter
}
