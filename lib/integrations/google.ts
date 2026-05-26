import 'server-only'
import { db } from '@/lib/db'

// ─── Token management ────────────────────────────────────────────────────────

async function getValidToken(userId: string, service: string): Promise<string | null> {
  const { rows } = await db.query(
    `SELECT "accessToken", "refreshToken", "expiresAt" FROM "Integration"
     WHERE "userId" = $1 AND service = $2`,
    [userId, service]
  )
  if (!rows[0]) return null
  const { accessToken, refreshToken, expiresAt } = rows[0]
  if (expiresAt && new Date(expiresAt).getTime() > Date.now() + 60_000) return accessToken
  if (!refreshToken) return null

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) return null
  const data = await res.json() as { access_token: string; expires_in: number }
  await db.query(
    `UPDATE "Integration" SET "accessToken" = $1, "expiresAt" = $2, "updatedAt" = now() WHERE "userId" = $3 AND service = $4`,
    [data.access_token, new Date(Date.now() + data.expires_in * 1000), userId, service]
  )
  return data.access_token
}

async function gapi(token: string, path: string, options?: RequestInit) {
  const res = await fetch(`https://www.googleapis.com${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) throw new Error(`Google API ${res.status}`)
  return res.json()
}

// ─── Gmail ───────────────────────────────────────────────────────────────────

export async function getRecentEmails(userId: string, maxResults = 10) {
  const token = await getValidToken(userId, 'gmail')
  if (!token) return null
  const list = await gapi(token, `/gmail/v1/users/me/messages?maxResults=${maxResults}&q=in:inbox`)
  if (!list.messages?.length) return []
  return Promise.all(list.messages.slice(0, maxResults).map(async (m: { id: string }) => {
    const msg = await gapi(token, `/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`)
    const headers = msg.payload?.headers ?? []
    const get = (name: string) => headers.find((h: { name: string; value: string }) => h.name === name)?.value ?? ''
    return { id: m.id, from: get('From'), subject: get('Subject'), date: get('Date'), snippet: msg.snippet ?? '', unread: msg.labelIds?.includes('UNREAD') ?? false }
  }))
}

export async function getEmailBody(userId: string, messageId: string): Promise<string | null> {
  const token = await getValidToken(userId, 'gmail')
  if (!token) return null
  const msg = await gapi(token, `/gmail/v1/users/me/messages/${messageId}?format=full`)
  function extractBody(payload: { mimeType: string; body?: { data?: string }; parts?: unknown[] }): string {
    if (payload.body?.data) return Buffer.from(payload.body.data, 'base64url').toString('utf-8')
    if (payload.parts) for (const part of payload.parts as typeof payload[]) { const t = extractBody(part); if (t) return t }
    return ''
  }
  return extractBody(msg.payload)
}

export async function sendEmail(userId: string, to: string, subject: string, body: string) {
  const token = await getValidToken(userId, 'gmail')
  if (!token) throw new Error('Gmail non connecté')
  const profile = await gapi(token, '/gmail/v1/users/me/profile')
  const raw = Buffer.from([`From: ${profile.emailAddress}`, `To: ${to}`, `Subject: ${subject}`, 'Content-Type: text/plain; charset=utf-8', 'MIME-Version: 1.0', '', body].join('\r\n')).toString('base64url')
  return gapi(token, '/gmail/v1/users/me/messages/send', { method: 'POST', body: JSON.stringify({ raw }) })
}

export async function searchEmails(userId: string, query: string, maxResults = 5) {
  const token = await getValidToken(userId, 'gmail')
  if (!token) return null
  const list = await gapi(token, `/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`)
  if (!list.messages?.length) return []
  return Promise.all(list.messages.map(async (m: { id: string }) => {
    const msg = await gapi(token, `/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`)
    const headers = msg.payload?.headers ?? []
    const get = (name: string) => headers.find((h: { name: string; value: string }) => h.name === name)?.value ?? ''
    return { id: m.id, from: get('From'), subject: get('Subject'), date: get('Date'), snippet: msg.snippet ?? '' }
  }))
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export async function getUpcomingEvents(userId: string, maxResults = 10) {
  const token = await getValidToken(userId, 'calendar')
  if (!token) return null
  const data = await gapi(token, `/calendar/v3/calendars/primary/events?maxResults=${maxResults}&orderBy=startTime&singleEvents=true&timeMin=${encodeURIComponent(new Date().toISOString())}`)
  return (data.items ?? []).map((e: { id: string; summary?: string; description?: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string }; location?: string; attendees?: { email: string }[] }) => ({
    id: e.id, title: e.summary ?? '(Sans titre)', description: e.description ?? '',
    start: e.start?.dateTime ?? e.start?.date ?? '', end: e.end?.dateTime ?? e.end?.date ?? '',
    location: e.location ?? '', attendees: (e.attendees ?? []).map(a => a.email),
  }))
}

export async function createEvent(userId: string, event: { title: string; start: string; end: string; description?: string; location?: string; attendees?: string[] }) {
  const token = await getValidToken(userId, 'calendar')
  if (!token) throw new Error('Calendar non connecté')
  return gapi(token, '/calendar/v3/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify({ summary: event.title, description: event.description, location: event.location, start: { dateTime: event.start, timeZone: 'Europe/Paris' }, end: { dateTime: event.end, timeZone: 'Europe/Paris' }, attendees: event.attendees?.map(email => ({ email })) }),
  })
}

// ─── Drive ───────────────────────────────────────────────────────────────────

export async function listDriveFiles(userId: string, maxResults = 10) {
  const token = await getValidToken(userId, 'drive')
  if (!token) return null
  const data = await gapi(token, `/drive/v3/files?pageSize=${maxResults}&orderBy=modifiedTime desc&fields=files(id,name,mimeType,modifiedTime,size)`)
  return (data.files ?? []).map((f: { id: string; name: string; mimeType: string; modifiedTime: string; size?: string }) => ({
    id: f.id, name: f.name, type: f.mimeType.split('.').pop() ?? f.mimeType, modified: f.modifiedTime, size: f.size,
  }))
}

export async function getDriveFileContent(userId: string, fileId: string): Promise<string | null> {
  const token = await getValidToken(userId, 'drive')
  if (!token) return null
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) return null
  return res.text()
}

// ─── Docs ────────────────────────────────────────────────────────────────────

export async function getDocContent(userId: string, documentId: string): Promise<string | null> {
  const token = await getValidToken(userId, 'docs')
  if (!token) return null
  const doc = await gapi(token, `/docs/v1/documents/${documentId}`)
  // Extract plain text from document body
  const text = (doc.body?.content ?? []).flatMap((el: { paragraph?: { elements?: { textRun?: { content?: string } }[] } }) =>
    (el.paragraph?.elements ?? []).map((e) => e.textRun?.content ?? '')
  ).join('')
  return text || null
}

// ─── Sheets ──────────────────────────────────────────────────────────────────

export async function getSheetData(userId: string, spreadsheetId: string, range = 'Sheet1!A1:Z100') {
  const token = await getValidToken(userId, 'sheets')
  if (!token) return null
  const data = await gapi(token, `/sheets/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`)
  return data.values ?? []
}

// ─── Context builder for AI ──────────────────────────────────────────────────

export type IntegrationActivity = {
  services: string[]
  summary: string
}

export async function buildGoogleContext(userId: string): Promise<{ context: string; activity: IntegrationActivity }> {
  const parts: string[] = []
  const services: string[] = []

  try {
    const emails = await getRecentEmails(userId, 5)
    if (emails?.length) {
      services.push('Gmail')
      parts.push('[GMAIL_INBOX]\n' + emails.map(e =>
        `- [${e.unread ? 'UNREAD' : 'READ'}] De: ${e.from} | Sujet: ${e.subject} | ${e.date}\n  ${e.snippet}`
      ).join('\n') + '\n[/GMAIL_INBOX]')
    }
  } catch {}

  try {
    const events = await getUpcomingEvents(userId, 5)
    if (events?.length) {
      services.push('Calendar')
      parts.push('[CALENDAR_EVENTS]\n' + events.map((e: { title: string; start: string; end: string; location: string }) =>
        `- ${e.title} | ${e.start} → ${e.end}${e.location ? ` | 📍 ${e.location}` : ''}`
      ).join('\n') + '\n[/CALENDAR_EVENTS]')
    }
  } catch {}

  try {
    const files = await listDriveFiles(userId, 5)
    if (files?.length) {
      services.push('Drive')
      parts.push('[DRIVE_RECENT]\n' + files.map((f: { name: string; type: string; modified: string }) =>
        `- ${f.name} (${f.type}) — modifié ${f.modified}`
      ).join('\n') + '\n[/DRIVE_RECENT]')
    }
  } catch {}

  const summary = services.length > 0
    ? `Lecture de ${services.join(', ')}...`
    : ''

  return { context: parts.join('\n\n'), activity: { services, summary } }
}
