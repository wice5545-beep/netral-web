export type ModelId = 'ntrl-1.0' | 'ntrl-1.2' | 'ntrl-1.3' | 'ntrl-2.0'

export type ModelConfig = {
  id: ModelId
  displayName: string
  description: string
  provider: 'mistral' | 'groq' | 'google' | 'nvidia'
  upstreamModel: string
  apiUrl: string
  envKey: string
  contextLength: number
  multimodal?: boolean
  thinking?: boolean
}

export const MODELS: Record<ModelId, ModelConfig> = {
  'ntrl-2.0': {
    id: 'ntrl-2.0',
    displayName: 'NTRL 2.0',
    description: 'Raisonnement profond avec pensée. Le plus puissant.',
    provider: 'nvidia',
    upstreamModel: 'qwen/qwen3.5-122b-a10b',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    envKey: 'NVIDIA_API_KEY',
    contextLength: 131072,
    thinking: true,
  },
  'ntrl-1.3': {
    id: 'ntrl-1.3',
    displayName: 'NTRL 1.3',
    description: 'Raisonnement approfondi, réponses nuancées.',
    provider: 'mistral',
    upstreamModel: 'mistral-medium-latest',
    apiUrl: 'https://api.mistral.ai/v1/chat/completions',
    envKey: 'MISTRAL_API_KEY',
    contextLength: 32000,
  },
  'ntrl-1.2': {
    id: 'ntrl-1.2',
    displayName: 'NTRL 1.2',
    description: 'Multimodal — images & texte. Rapide et précis.',
    provider: 'google',
    upstreamModel: 'gemini-2.5-flash',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    envKey: 'GEMINI_API_KEY',
    contextLength: 1000000,
    multimodal: true,
  },
  'ntrl-1.0': {
    id: 'ntrl-1.0',
    displayName: 'NTRL 1.0',
    description: 'Ultra-rapide. Réponses instantanées.',
    provider: 'groq',
    upstreamModel: 'llama-3.3-70b-versatile',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    envKey: 'GROQ_API_KEY',
    contextLength: 128000,
  },
}

export const DEFAULT_MODEL: ModelId = 'ntrl-2.0'

export function getModel(id?: string | null): ModelConfig {
  if (id && id in MODELS) return MODELS[id as ModelId]
  return MODELS[DEFAULT_MODEL]
}

export function getApiKey(envKey: string): string {
  return process.env[envKey] ?? ''
}

export function getFallbackKeys(envKey: string): string[] {
  const fallbackEnv = process.env[`${envKey}_FALLBACK`]
  if (!fallbackEnv) return []
  return fallbackEnv.split(',').map(k => k.trim()).filter(Boolean)
}
