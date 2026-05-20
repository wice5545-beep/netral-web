export type ModelId = 'ntrl-1.0' | 'ntrl-1.3'

export type ModelConfig = {
  id: ModelId
  displayName: string
  description: string
  provider: 'mistral' | 'groq'
  upstreamModel: string
  apiUrl: string
  envKey: string
  contextLength: number
}

export const MODELS: Record<ModelId, ModelConfig> = {
  'ntrl-1.3': {
    id: 'ntrl-1.3',
    displayName: 'NTRL 1.3',
    description: 'Balanced. Deep reasoning, nuanced answers.',
    provider: 'mistral',
    upstreamModel: 'mistral-small-latest',
    apiUrl: 'https://api.mistral.ai/v1/chat/completions',
    envKey: 'MISTRAL_API_KEY',
    contextLength: 32000,
  },
  'ntrl-1.0': {
    id: 'ntrl-1.0',
    displayName: 'NTRL 1.0',
    description: 'Fast. Lightning quick responses.',
    provider: 'groq',
    upstreamModel: 'llama-3.3-70b-versatile',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    envKey: 'GROQ_API_KEY',
    contextLength: 128000,
  },
}

export const DEFAULT_MODEL: ModelId = 'ntrl-1.3'

export function getModel(id?: string | null): ModelConfig {
  if (id && id in MODELS) return MODELS[id as ModelId]
  return MODELS[DEFAULT_MODEL]
}
