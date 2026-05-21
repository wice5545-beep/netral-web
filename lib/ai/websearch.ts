import 'server-only'

export interface SearchResult {
  title: string
  url: string
  snippet: string
  domain: string
  publishedDate?: string
}

export interface WebSearchResponse {
  results: SearchResult[]
  query: string
}

export async function webSearch(query: string, maxResults = 5): Promise<WebSearchResponse> {
  const tavilyKey = process.env.TAVILY_API_KEY

  if (tavilyKey) {
    return tavilySearch(query, tavilyKey, maxResults)
  }

  // Fallback: DuckDuckGo via Jina (pas de clé requise)
  return duckduckgoSearch(query, maxResults)
}

async function tavilySearch(query: string, apiKey: string, maxResults: number): Promise<WebSearchResponse> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      include_answer: false,
      include_raw_content: false,
    }),
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`Tavily error: ${res.status}`)

  const data = await res.json()
  return {
    query,
    results: (data.results ?? []).map((r: { title: string; url: string; content: string; published_date?: string }) => ({
      title: r.title,
      url: r.url,
      snippet: r.content?.slice(0, 300) ?? '',
      domain: extractDomain(r.url),
      publishedDate: r.published_date,
    })),
  }
}

async function duckduckgoSearch(query: string, maxResults: number): Promise<WebSearchResponse> {
  // Utilise l'API Jina.ai s/search qui ne requiert pas de clé
  const encoded = encodeURIComponent(query)
  const res = await fetch(`https://s.jina.ai/${encoded}`, {
    headers: {
      Accept: 'application/json',
      'X-Return-Format': 'json',
    },
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) return { query, results: [] }

  const text = await res.text()
  const results: SearchResult[] = []

  // Jina retourne du markdown, on extrait les liens
  const matches = text.matchAll(/\[([^\]]+)\]\((https?[^\)]+)\)/g)
  let count = 0
  for (const match of matches) {
    if (count >= maxResults) break
    const title = match[1]
    const url = match[2]
    if (!url.startsWith('http')) continue
    results.push({
      title,
      url,
      snippet: '',
      domain: extractDomain(url),
    })
    count++
  }

  return { query, results }
}

export async function readPage(url: string): Promise<string> {
  // Jina Reader API — 100% gratuit, lit et nettoie n'importe quelle page
  const jinaKey = process.env.JINA_API_KEY
  const headers: Record<string, string> = {
    Accept: 'text/plain',
    'X-Return-Format': 'text',
    'X-Timeout': '15',
  }
  if (jinaKey) headers['Authorization'] = `Bearer ${jinaKey}`

  const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
    headers,
    signal: AbortSignal.timeout(20000),
  })

  if (!res.ok) return ''

  const text = await res.text()
  // Garder les 3000 premiers caractères utiles
  return text.slice(0, 3000).trim()
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
