// In-memory cache for generated images
// Images are stored as base64 data URIs keyed by random ID

const imageCache = new Map<string, { data: string; prompt: string; size: string; createdAt: number }>()

// Auto-cleanup: remove images older than 30 minutes
const MAX_AGE = 30 * 60 * 1000
setInterval(() => {
  const now = Date.now()
  for (const [id, entry] of imageCache) {
    if (now - entry.createdAt > MAX_AGE) {
      imageCache.delete(id)
    }
  }
}, 60_000)

export function storeGeneratedImage(base64: string, prompt: string, size: string): string {
  const id = crypto.randomUUID()
  imageCache.set(id, {
    data: base64,
    prompt,
    size,
    createdAt: Date.now(),
  })
  return id
}

export function getGeneratedImage(id: string): { data: string; prompt: string; size: string } | null {
  const entry = imageCache.get(id)
  if (!entry) return null
  return { data: entry.data, prompt: entry.prompt, size: entry.size }
}