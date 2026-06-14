import 'server-only'
import { db } from '@/lib/db'

// ═══════════════════════════════════════════════════════════════
// TOOL DEFINITIONS — Mistral/OpenAI function calling format
// ═══════════════════════════════════════════════════════════════

export interface ToolDefinition {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, unknown>
      required?: string[]
    }
  }
}

export interface ToolCall {
  id: string
  function: {
    name: string
    arguments: string
  }
}

// ─── Available Tools ──────────────────────────────────────────────────────────

const TOOL_GMAIL_READ_INBOX: ToolDefinition = {
  type: 'function',
  function: {
    name: 'gmail_read_inbox',
    description: "Lis les emails récents de la boîte de réception Gmail de l'utilisateur. Retourne le sujet, l'expéditeur, la date et un extrait de chaque email.",
    parameters: {
      type: 'object',
      properties: {
        maxResults: { type: 'number', description: 'Nombre maximum d\'emails à retourner (défaut: 10, max: 20)' },
        unreadOnly: { type: 'boolean', description: 'Ne retourner que les emails non lus (défaut: false)' },
      },
      required: [],
    },
  },
}

const TOOL_GMAIL_SEND_EMAIL: ToolDefinition = {
  type: 'function',
  function: {
    name: 'gmail_send_email',
    description: "Envoie un email via le compte Gmail de l'utilisateur. IMPORTANT: confirme toujours le contenu avec l'utilisateur avant d'envoyer, sauf s'il te l'a explicitement demandé.",
    parameters: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Adresse email du destinataire' },
        subject: { type: 'string', description: 'Sujet de l\'email' },
        body: { type: 'string', description: 'Corps de l\'email en texte brut' },
      },
      required: ['to', 'subject', 'body'],
    },
  },
}

const TOOL_GMAIL_SEARCH_EMAILS: ToolDefinition = {
  type: 'function',
  function: {
    name: 'gmail_search_emails',
    description: "Recherche des emails dans la boîte Gmail de l'utilisateur avec une requête (expéditeur, sujet, mots-clés, etc.). Utilise la syntaxe de recherche Gmail.",
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Requête de recherche Gmail (ex: "from:jean subject:facture", "has:attachment", "newer_than:7d")' },
        maxResults: { type: 'number', description: 'Nombre maximum de résultats (défaut: 5, max: 10)' },
      },
      required: ['query'],
    },
  },
}

const TOOL_GMAIL_READ_EMAIL_BODY: ToolDefinition = {
  type: 'function',
  function: {
    name: 'gmail_read_email_body',
    description: "Lit le contenu complet d'un email spécifique identifié par son ID (obtenu via gmail_read_inbox ou gmail_search_emails).",
    parameters: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'ID du message Gmail à lire' },
      },
      required: ['messageId'],
    },
  },
}

const TOOL_CALENDAR_GET_EVENTS: ToolDefinition = {
  type: 'function',
  function: {
    name: 'calendar_get_events',
    description: "Récupère les événements à venir du calendrier Google de l'utilisateur.",
    parameters: {
      type: 'object',
      properties: {
        maxResults: { type: 'number', description: 'Nombre maximum d\'événements (défaut: 10, max: 20)' },
      },
      required: [],
    },
  },
}

const TOOL_CALENDAR_CREATE_EVENT: ToolDefinition = {
  type: 'function',
  function: {
    name: 'calendar_create_event',
    description: "Crée un événement dans le calendrier Google de l'utilisateur. IMPORTANT: confirme toujours les détails avec l'utilisateur avant de créer, sauf s'il te l'a explicitement demandé.",
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Titre de l\'événement' },
        start: { type: 'string', description: 'Date/heure de début au format ISO 8601 (ex: "2026-06-10T14:00:00+02:00")' },
        end: { type: 'string', description: 'Date/heure de fin au format ISO 8601' },
        description: { type: 'string', description: 'Description optionnelle' },
        location: { type: 'string', description: 'Lieu optionnel' },
        attendees: { type: 'array', items: { type: 'string' }, description: 'Emails des participants (optionnel)' },
      },
      required: ['title', 'start', 'end'],
    },
  },
}

const TOOL_DRIVE_LIST_FILES: ToolDefinition = {
  type: 'function',
  function: {
    name: 'drive_list_files',
    description: "Liste les fichiers récents du Google Drive de l'utilisateur.",
    parameters: {
      type: 'object',
      properties: {
        maxResults: { type: 'number', description: 'Nombre maximum de fichiers (défaut: 10, max: 25)' },
      },
      required: [],
    },
  },
}

const TOOL_DRIVE_READ_FILE: ToolDefinition = {
  type: 'function',
  function: {
    name: 'drive_read_file',
    description: "Lit le contenu d'un fichier Google Drive (Docs, Sheets, texte, etc.). L'ID du fichier peut être obtenu via drive_list_files.",
    parameters: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID du fichier Google Drive' },
      },
      required: ['fileId'],
    },
  },
}

const TOOL_DOCS_READ: ToolDefinition = {
  type: 'function',
  function: {
    name: 'docs_read',
    description: "Lit le contenu d'un Google Docs.",
    parameters: {
      type: 'object',
      properties: {
        documentId: { type: 'string', description: 'ID du document Google Docs' },
      },
      required: ['documentId'],
    },
  },
}

const TOOL_SHEETS_READ: ToolDefinition = {
  type: 'function',
  function: {
    name: 'sheets_read',
    description: "Lit les données d'une feuille Google Sheets.",
    parameters: {
      type: 'object',
      properties: {
        spreadsheetId: { type: 'string', description: 'ID du spreadsheet Google Sheets' },
        range: { type: 'string', description: 'Plage de cellules (ex: "Sheet1!A1:Z100"). Défaut: "Sheet1!A1:Z100"' },
      },
      required: ['spreadsheetId'],
    },
  },
}

const TOOL_GENERATE_IMAGE: ToolDefinition = {
  type: 'function',
  function: {
    name: 'generate_image',
    description: "Génère une image à partir d'une description textuelle détaillée (prompt). Utilise ce tool quand l'utilisateur demande de créer, générer, dessiner ou illustrer une image. Le prompt doit être en anglais pour de meilleurs résultats, détaillé (style, couleurs, ambiance, composition).",
    parameters: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Description détaillée de l\'image à générer (en anglais de préférence, max 1500 caractères). Inclus le style, les couleurs, l\'ambiance, la composition, le format.' },
        size: { type: 'string', description: 'Taille de l\'image. Options: "square" (1024x1024), "landscape" (1792x1024), "portrait" (1024x1792). Défaut: "square"' },
      },
      required: ['prompt'],
    },
  },
}

// ─── Tool Registry ────────────────────────────────────────────────────────────
// Maps service name to its tool definitions

export const TOOLS_BY_SERVICE: Record<string, ToolDefinition[]> = {
  gmail: [
    TOOL_GMAIL_READ_INBOX,
    TOOL_GMAIL_SEND_EMAIL,
    TOOL_GMAIL_SEARCH_EMAILS,
    TOOL_GMAIL_READ_EMAIL_BODY,
  ],
  calendar: [
    TOOL_CALENDAR_GET_EVENTS,
    TOOL_CALENDAR_CREATE_EVENT,
  ],
  drive: [
    TOOL_DRIVE_LIST_FILES,
    TOOL_DRIVE_READ_FILE,
  ],
  docs: [
    TOOL_DOCS_READ,
  ],
  sheets: [
    TOOL_SHEETS_READ,
  ],
}

// Always-available tools (no integration needed)
export const BASE_TOOLS: ToolDefinition[] = [
  TOOL_GENERATE_IMAGE,
]

// ═══════════════════════════════════════════════════════════════
// TOOL EXECUTION
// ═══════════════════════════════════════════════════════════════

export interface ToolResult {
  success: boolean
  data?: unknown
  error?: string
}

type ToolExecutor = (userId: string, args: Record<string, unknown>) => Promise<ToolResult>

export const TOOL_EXECUTORS: Record<string, ToolExecutor> = {
  // ─── Gmail ──────────────────────────────────────────────────────────────
  gmail_read_inbox: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const maxResults = Math.min((args.maxResults as number) || 10, 20)
      const unreadOnly = args.unreadOnly as boolean | undefined
      let emails = await mod.getRecentEmails(userId, maxResults)
      if (!emails) return { success: false, error: 'Gmail non connecté. L\'utilisateur doit connecter Gmail dans Paramètres > Intégrations.' }
      if (unreadOnly && Array.isArray(emails)) {
        emails = emails.filter((e: { unread: boolean }) => e.unread)
      }
      return { success: true, data: emails }
    } catch (e: any) {
      return { success: false, error: `Erreur Gmail: ${e.message}` }
    }
  },

  gmail_send_email: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      await mod.sendEmail(userId, args.to as string, args.subject as string, args.body as string)
      return { success: true, data: { sent: true, to: args.to, subject: args.subject } }
    } catch (e: any) {
      return { success: false, error: `Erreur d'envoi: ${e.message}` }
    }
  },

  gmail_search_emails: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const maxResults = Math.min((args.maxResults as number) || 5, 10)
      const results = await mod.searchEmails(userId, args.query as string, maxResults)
      if (!results) return { success: false, error: 'Gmail non connecté.' }
      return { success: true, data: results }
    } catch (e: any) {
      return { success: false, error: `Erreur de recherche: ${e.message}` }
    }
  },

  gmail_read_email_body: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const body = await mod.getEmailBody(userId, args.messageId as string)
      if (!body) return { success: false, error: 'Email introuvable.' }
      return { success: true, data: { body } }
    } catch (e: any) {
      return { success: false, error: `Erreur de lecture: ${e.message}` }
    }
  },

  // ─── Calendar ───────────────────────────────────────────────────────────
  calendar_get_events: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const maxResults = Math.min((args.maxResults as number) || 10, 20)
      const events = await mod.getUpcomingEvents(userId, maxResults)
      if (!events) return { success: false, error: 'Calendar non connecté.' }
      return { success: true, data: events }
    } catch (e: any) {
      return { success: false, error: `Erreur Calendar: ${e.message}` }
    }
  },

  calendar_create_event: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const result = await mod.createEvent(userId, {
        title: args.title as string,
        start: args.start as string,
        end: args.end as string,
        description: args.description as string | undefined,
        location: args.location as string | undefined,
        attendees: args.attendees as string[] | undefined,
      })
      return { success: true, data: { created: true, event: result } }
    } catch (e: any) {
      return { success: false, error: `Erreur de création: ${e.message}` }
    }
  },

  // ─── Drive ──────────────────────────────────────────────────────────────
  drive_list_files: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const maxResults = Math.min((args.maxResults as number) || 10, 25)
      const files = await mod.listDriveFiles(userId, maxResults)
      if (!files) return { success: false, error: 'Drive non connecté.' }
      return { success: true, data: files }
    } catch (e: any) {
      return { success: false, error: `Erreur Drive: ${e.message}` }
    }
  },

  drive_read_file: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const content = await mod.getDriveFileContent(userId, args.fileId as string)
      if (!content) return { success: false, error: 'Fichier introuvable ou inaccessible.' }
      return { success: true, data: { content: content.slice(0, 20000) } }
    } catch (e: any) {
      return { success: false, error: `Erreur de lecture: ${e.message}` }
    }
  },

  // ─── Docs ───────────────────────────────────────────────────────────────
  docs_read: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const content = await mod.getDocContent(userId, args.documentId as string)
      if (!content) return { success: false, error: 'Document introuvable ou inaccessible.' }
      return { success: true, data: { content: content.slice(0, 20000) } }
    } catch (e: any) {
      return { success: false, error: `Erreur de lecture Docs: ${e.message}` }
    }
  },

  // ─── Sheets ─────────────────────────────────────────────────────────────
  sheets_read: async (userId, args) => {
    try {
      const mod = await import('@/lib/integrations/google')
      const range = (args.range as string) || 'Sheet1!A1:Z100'
      const data = await mod.getSheetData(userId, args.spreadsheetId as string, range)
      if (!data) return { success: false, error: 'Feuille de calcul introuvable ou inaccessible.' }
      return { success: true, data: { values: data, range } }
    } catch (e: any) {
      return { success: false, error: `Erreur de lecture Sheets: ${e.message}` }
    }
  },

  // ─── Image Generation ───────────────────────────────────────────────────
  generate_image: async (_userId, args) => {
    try {
      const apiKey = process.env.BLUESMINDS_API_KEY || process.env.BLUEMINDS_API_KEY || process.env.GROK_API_KEY || ''
      if (!apiKey) return { success: false, error: 'Clé API image non configurée (BLUESMINDS_API_KEY).' }

      const prompt = (args.prompt as string || '').trim()
      if (!prompt || prompt.length < 3) return { success: false, error: 'Prompt trop court (min 3 caractères).' }

      const size = args.size as string || 'square'
      const sizeMap: Record<string, string> = {
        square: '1024x1024',
        landscape: '1792x1024',
        portrait: '1024x1792',
      }
      const resolvedSize = sizeMap[size] || '1024x1024'

      const body = JSON.stringify({
        model: 'grok-image',
        prompt: prompt.slice(0, 1500),
        n: 1,
        size: resolvedSize,
        response_format: 'b64_json',
      })

      // Try .ai domain first, fallback to .cloud
      let response = await fetch('https://api.bluesminds.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body,
        signal: AbortSignal.timeout(60000),
      })

      if (!response.ok && response.status >= 500) {
        response = await fetch('https://api.blueminds.cloud/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body,
          signal: AbortSignal.timeout(60000),
        })
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => null)
        const errMsg = errData?.error?.message || errData?.message || `HTTP ${response.status}`
        return { success: false, error: `Génération échouée: ${errMsg}` }
      }

      const data = await response.json()
      const base64 = data.data?.[0]?.b64_json
      if (!base64) return { success: false, error: 'Aucune image retournée.' }

      const { storeGeneratedImage } = await import('@/lib/image-cache')
      const imageId = storeGeneratedImage(base64, prompt, resolvedSize)

      return {
        success: true,
        data: {
          imageId,
          prompt,
          size: resolvedSize,
        },
      }
    } catch (e: any) {
      return { success: false, error: `Erreur génération image: ${e.message}` }
    }
  },
}

// ═══════════════════════════════════════════════════════════════
// ACTIVE TOOLS — checks which integrations are connected
// ═══════════════════════════════════════════════════════════════

export async function getActiveTools(userId: string): Promise<ToolDefinition[]> {
  const tools: ToolDefinition[] = [...BASE_TOOLS]

  try {
    const { rows } = await db.query(
      `SELECT service FROM "Integration" WHERE "userId" = $1`,
      [userId]
    )
    const connectedServices = new Set(rows.map((r: { service: string }) => r.service.toLowerCase()))

    for (const [service, serviceTools] of Object.entries(TOOLS_BY_SERVICE)) {
      if (connectedServices.has(service)) {
        tools.push(...serviceTools)
      }
    }
  } catch {}

  return tools
}

export async function hasIntegrations(userId: string): Promise<boolean> {
  try {
    const { rows } = await db.query(
      `SELECT 1 FROM "Integration" WHERE "userId" = $1 LIMIT 1`,
      [userId]
    )
    return rows.length > 0
  } catch {
    return false
  }
}