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
 * Provider hierarchy:
 * 1. Tavily (TAVILY_API_KEY) — 1 000 req/month
 * 2. Brave  (BRAVE_API_KEY)  — 2 000 req/month
 * 3. Jina AI Search          — ~864k req/month gratuit
 * 4. SearXNG public          — illimité (méta-moteur)
 * 5. DuckDuckGo HTML         — fallback ultime
 */
export async function webSearch(query: string, maxResults = 5): Promise<WebSearchResponse> {
  if (process.env.TAVILY_API_KEY) {
    try { return await tavilySearch(query, process.env.TAVILY_API_KEY, maxResults) }
    catch (e) { console.error('[search] Tavily failed:', e) }
  }

  if (process.env.BRAVE_API_KEY) {
    try { return await braveSearch(query, process.env.BRAVE_API_KEY, maxResults) }
    catch (e) { console.error('[search] Brave failed:', e) }
  }

  try { return await jinaSearch(query, maxResults) }
  catch (e) { console.error('[search] Jina failed:', e) }

  try { return await searxngSearch(query, maxResults) }
  catch (e) { console.error('[search] SearXNG failed:', e) }

  return duckduckgoSearch(query, maxResults)
}

// ─── Providers ────────────────────────────────────────────────────────────────

async function tavilySearch(query: string, apiKey: string, maxResults: number): Promise<WebSearchResponse> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, max_results: maxResults, include_answer: false }),
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`Tavily ${res.status}: ${await res.text().catch(() => '')}`)

  const data = await res.json()
  const results = data.results ?? []
  if (results.length === 0) throw new Error('Tavily: no results')

  return {
    query,
    provider: 'tavily',
    results: results.map((r: { title: string; url: string; content: string; published_date?: string }) => ({
      title: r.title,
      url: r.url,
      snippet: (r.content ?? '').slice(0, 300),
      domain: extractDomain(r.url),
      publishedDate: r.published_date,
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
  const items: { title?: string; url?: string; description?: string }[] = data?.web?.results ?? []
  if (items.length === 0) throw new Error('Brave: no results')

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
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) throw new Error(`Jina ${res.status}`)

  const data = await res.json()
  const items: { title?: string; url?: string; description?: string; content?: string }[] =
    Array.isArray(data?.data) ? data.data :
    Array.isArray(data?.results) ? data.results :
    Array.isArray(data) ? data : []

  if (items.length === 0) throw new Error('Jina: no results')

  return {
    query,
    provider: 'jina',
    results: items.slice(0, maxResults).map((r) => ({
      title: r.title ?? '',
      url: r.url ?? '',
      snippet: (r.description ?? r.content ?? '').slice(0, 300),
      domain: extractDomain(r.url ?? ''),
    })).filter(r => r.url.startsWith('http')),
  }
}

async function searxngSearch(query: string, maxResults: number): Promise<WebSearchResponse> {
  const instances = [
    'https://searx.be/search',
    'https://search.inetol.net/search',
    'https://searxng.site/search',
    'https://paulgo.io/search',
  ]
  const params = new URLSearchParams({ q: query, format: 'json', categories: 'general' })

  for (const instance of instances) {
    try {
      const res = await fetch(`${instance}?${params}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Netral/1.0; +https://netral-web.vercel.app)' },
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) continue
      const data = await res.json()
      const items: { title?: string; url?: string; content?: string }[] = data?.results ?? []
      const results = items
        .slice(0, maxResults)
        .map((r) => ({
          title: r.title ?? '',
          url: r.url ?? '',
          snippet: (r.content ?? '').slice(0, 300),
          domain: extractDomain(r.url ?? ''),
        }))
        .filter((r) => r.url.startsWith('http'))

      if (results.length > 0) return { query, provider: 'searxng', results }
    } catch { /* try next instance */ }
  }
  throw new Error('SearXNG: all instances failed')
}

async function duckduckgoSearch(query: string, maxResults: number): Promise<WebSearchResponse> {
  const encoded = encodeURIComponent(query)
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encoded}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
    },
    signal: AbortSignal.timeout(12000),
  })

  if (!res.ok) return { query, provider: 'ddg', results: [] }

  const html = await res.text()
  const results: SearchResult[] = []

  const resultBlocks = html.matchAll(
    /<a[^>]+class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>(.*?)<\/a>/g
  )

  for (const block of resultBlocks) {
    if (results.length >= maxResults) break
    const rawUrl = block[1]
    const title = stripHtml(block[2])
    const snippet = stripHtml(block[3])

    let url = rawUrl
    try {
      const u = new URL(rawUrl.startsWith('http') ? rawUrl : `https://duckduckgo.com${rawUrl}`)
      url = u.searchParams.get('uddg') ?? rawUrl
      url = decodeURIComponent(url)
    } catch { /* keep raw */ }

    if (!url.startsWith('http')) continue
    results.push({ title, url, snippet, domain: extractDomain(url) })
  }

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
    // Jina Reader requires the raw URL appended (NOT encoded)
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers,
      signal: AbortSignal.timeout(18000),
    })
    if (!res.ok) return ''
    return (await res.text()).slice(0, 3500).trim()
  } catch {
    return ''
  }
}

// ─── Auto-detection ───────────────────────────────────────────────────────────

export function needsWebSearch(query: string): boolean {
  const q = query.toLowerCase().trim()

  // Short queries (< 4 words) likely need context
  const wordCount = q.split(/\s+/).length
  if (wordCount <= 3 && q.endsWith('?')) return true

  // Explicit search/find signals
  const searchIntents = [
    'cherche', 'recherche', 'trouve', 'montre', 'donne moi',
    'search', 'find', 'look up', 'lookup',
    'c\'est quoi', "qu'est-ce que", "qu'est-ce qu'",
    "c'est qui", 'qui est', 'what is', 'who is', 'what are',
  ]

  // Temporal signals
  const temporal = [
    "aujourd'hui", "maintenant", "en ce moment", "actuellement", "récemment",
    "dernière", "dernier", "cette semaine", "ce mois", "cette année",
    "tout à l'heure", "vient de", "nouveau", "nouvelle", "récent",
    'today', 'now', 'current', 'latest', 'recent', 'this week', 'right now',
    '2023', '2024', '2025', '2026',
  ]

  // External knowledge signals
  const external = [
    'prix', 'coût', 'tarif', 'combien', 'météo', 'température', 'résultat',
    'score', 'classement', 'actualité', 'news', 'article', 'sortie',
    'disponible', 'site', 'www', 'http', 'url', 'acheter', 'commander',
    'horaire', 'ouvert', 'fermé', 'adresse', 'téléphone',
    'price', 'cost', 'how much', 'weather', 'result', 'score', 'ranking',
    'release', 'available', 'buy', 'order', 'hours', 'address', 'phone',
  ]

  // Factual signals that change
  const factual = [
    'président', 'premier ministre', 'ceo', 'pdg', 'directeur général',
    'population', 'capitale', 'monnaie', 'hymne', 'superficie',
    'record', 'champion', 'vainqueur', 'gagnant',
  ]

  return (
    searchIntents.some((t) => q.includes(t)) ||
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
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .trim()
}
