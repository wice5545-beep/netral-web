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
  provider: string
}

/**
 * Hiérarchie des providers (du plus généreux au plus limité) :
 * 1. Jina AI Search   — sans clé : ~20 req/min = ~864k req/mois GRATUIT
 * 2. Brave Search     — avec BRAVE_API_KEY : 2 000 req/mois gratuit
 * 3. Tavily           — avec TAVILY_API_KEY : 1 000 req/mois gratuit
 * 4. DuckDuckGo HTML  — sans clé, illimité (fallback ultime)
 */
export async function webSearch(query: string, maxResults = 5): Promise<WebSearchResponse> {
  // Tavily ou Brave en priorité si clé dispo (meilleure qualité)
  if (process.env.TAVILY_API_KEY) {
    try {
      return await tavilySearch(query, process.env.TAVILY_API_KEY, maxResults)
    } catch { /* fallback */ }
  }

  if (process.env.BRAVE_API_KEY) {
    try {
      return await braveSearch(query, process.env.BRAVE_API_KEY, maxResults)
    } catch { /* fallback */ }
  }

  // Jina AI Search — par défaut, gratuit, très généreux
  try {
    return await jinaSearch(query, maxResults)
  } catch { /* fallback */ }

  // DuckDuckGo HTML — fallback ultime, illimité
  return duckduckgoSearch(query, maxResults)
}

// ─── Providers ────────────────────────────────────────────────────────────────

async function jinaSearch(query: string, maxResults: number): Promise<WebSearchResponse> {
  const encoded = encodeURIComponent(query)
  const jinaKey = process.env.JINA_API_KEY

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Return-Format': 'json',
  }
  if (jinaKey) headers['Authorization'] = `Bearer ${jinaKey}`

  const res = await fetch(`https://s.jina.ai/${encoded}`, {
    headers,
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) throw new Error(`Jina ${res.status}`)

  const data = await res.json()

  // Jina JSON format: { data: [{ title, url, description, content }] }
  const items: { title?: string; url?: string; description?: string; content?: string }[] =
    data?.data ?? data?.results ?? []

  if (items.length === 0) throw new Error('Jina: no results')

  return {
    query,
    provider: 'jina',
    results: items.slice(0, maxResults).map((r) => ({
      title: r.title ?? '',
      url: r.url ?? '',
      snippet: (r.description ?? r.content ?? '').slice(0, 300),
      domain: extractDomain(r.url ?? ''),
    })),
  }
}

async function braveSearch(query: string, apiKey: string, maxResults: number): Promise<WebSearchResponse> {
  const params = new URLSearchParams({ q: query, count: String(maxResults), text_decorations: 'false' })
  const res = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`Brave ${res.status}`)

  const data = await res.json()
  const items: { title?: string; url?: string; description?: string }[] =
    data?.web?.results ?? []

  return {
    query,
    provider: 'brave',
    results: items.slice(0, maxResults).map((r) => ({
      title: r.title ?? '',
      url: r.url ?? '',
      snippet: (r.description ?? '').slice(0, 300),
      domain: extractDomain(r.url ?? ''),
    })),
  }
}

async function tavilySearch(query: string, apiKey: string, maxResults: number): Promise<WebSearchResponse> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, query, max_results: maxResults, include_answer: false }),
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`Tavily ${res.status}`)

  const data = await res.json()
  return {
    query,
    provider: 'tavily',
    results: (data.results ?? []).map((r: { title: string; url: string; content: string; published_date?: string }) => ({
      title: r.title,
      url: r.url,
      snippet: (r.content ?? '').slice(0, 300),
      domain: extractDomain(r.url),
      publishedDate: r.published_date,
    })),
  }
}

async function duckduckgoSearch(query: string, maxResults: number): Promise<WebSearchResponse> {
  const encoded = encodeURIComponent(query)
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encoded}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Netral/1.0)',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) return { query, provider: 'ddg', results: [] }

  const html = await res.text()
  const results: SearchResult[] = []

  // Parser HTML DDG avec regex
  const resultBlocks = html.matchAll(
    /<a[^>]+class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>(.*?)<\/a>/g
  )

  for (const block of resultBlocks) {
    if (results.length >= maxResults) break
    const rawUrl = block[1]
    const title = stripHtml(block[2])
    const snippet = stripHtml(block[3])

    // DDG utilise des redirects uddg=
    let url = rawUrl
    try {
      const u = new URL(rawUrl.startsWith('http') ? rawUrl : `https://duckduckgo.com${rawUrl}`)
      url = u.searchParams.get('uddg') ?? rawUrl
      url = decodeURIComponent(url)
    } catch { /* keep raw */ }

    if (!url.startsWith('http')) continue
    results.push({ title, url, snippet, domain: extractDomain(url) })
  }

  // Fallback si regex ne match rien — extraire les liens basiques
  if (results.length === 0) {
    const links = html.matchAll(/uddg=([^&"]+)/g)
    let count = 0
    for (const link of links) {
      if (count >= maxResults) break
      try {
        const url = decodeURIComponent(link[1])
        if (!url.startsWith('http')) continue
        results.push({ title: extractDomain(url), url, snippet: '', domain: extractDomain(url) })
        count++
      } catch { /* skip */ }
    }
  }

  return { query, provider: 'ddg', results }
}

// ─── Page reader ──────────────────────────────────────────────────────────────

export async function readPage(url: string): Promise<string> {
  const jinaKey = process.env.JINA_API_KEY
  const headers: Record<string, string> = {
    Accept: 'text/plain',
    'X-Return-Format': 'text',
    'X-Timeout': '15',
    'X-Remove-Selector': 'header, footer, nav, .ads, .cookie-banner',
  }
  if (jinaKey) headers['Authorization'] = `Bearer ${jinaKey}`

  try {
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers,
      signal: AbortSignal.timeout(18000),
    })
    if (!res.ok) return ''
    return (await res.text()).slice(0, 3500).trim()
  } catch {
    return ''
  }
}

// ─── Auto-détection : l'IA doit-elle chercher sur le web ? ───────────────────

export function needsWebSearch(query: string): boolean {
  const q = query.toLowerCase()

  // Signaux temporels
  const temporal = [
    "aujourd'hui", "maintenant", "en ce moment", "actuellement", "récent",
    "dernière", "dernier", "cette semaine", "ce mois", "cette année",
    "tout à l'heure", "vient de", "nouveau", "nouvelle",
    'today', 'now', 'current', 'latest', 'recent', 'this week', 'right now',
    '2024', '2025', '2026',
  ]

  // Signaux de connaissance externe
  const external = [
    'prix', 'coût', 'tarif', 'combien', 'météo', 'température', 'résultat',
    'score', 'classement', 'actualité', 'news', 'article', 'sortie',
    'disponible', 'site', 'www', 'http', 'url',
    'qui est', 'c\'est qui', 'c\'est quoi', 'où se trouve', 'quand est',
    'price', 'cost', 'how much', 'weather', 'result', 'score', 'ranking',
    'release', 'available', 'who is', 'what is the', 'when is',
  ]

  // Questions de fait qui changent
  const factual = [
    'président', 'premier ministre', 'ceo', 'pdg', 'directeur',
    'population', 'capitale', 'monnaie', 'hymne', 'superficie',
  ]

  return (
    temporal.some((t) => q.includes(t)) ||
    external.some((t) => q.includes(t)) ||
    factual.some((t) => q.includes(t))
  )
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function extractDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
}
