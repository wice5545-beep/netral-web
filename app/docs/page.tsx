'use client'

import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { useState } from 'react'
import { Copy, Terminal, Code2, Brain, Zap, Search, BookOpen, Key, Layers } from 'lucide-react'

const CONTENT = {
  fr: {
    title: 'Documentation',
    back: '← Retour',
    intro: "Tout ce que vous devez savoir pour utiliser Netral efficacement. Cette documentation couvre l'API, l'extension VS Code, la recherche web, la mémoire contextuelle et les intégrations.",
    sections: [
      {
        id: 'getting-started',
        icon: 'BookOpen',
        title: 'Démarrage rapide',
        content: [
          { type: 'text' as const, value: "Netral est un assistant IA multimodal accessible via <strong>netral.app</strong> ou l'extension VS Code. Créez un compte (email ou Google OAuth) pour commencer." },
          { type: 'subsection' as const, value: 'Premiers pas' },
          { type: 'list' as const, value: [
            'Créez un compte sur <a href="/register" class="text-[var(--accent)]">netral.app/register</a>',
            'Choisissez votre plan (Free, Pro, ou Enterprise)',
            'Accédez au chat sur <a href="/chat" class="text-[var(--accent)]">netral.app/chat</a>',
            "Posez votre première question — l'IA répond avec recherche web, citations et contexte mémorisé",
          ] as string[] },
          { type: 'subsection' as const, value: 'Installation VS Code' },
          { type: 'text' as const, value: 'Téléchargez l\'extension depuis le <a href="https://marketplace.visualstudio.com" class="text-[var(--accent)]">VS Code Marketplace</a> ou cherchez "Netral" dans l\'onglet Extensions (Ctrl+Shift+X).' },
          { type: 'code' as const, value: '# Dans VS Code, générez un token API :\n# Paramètres → API → Générer un token\n# Collez-le dans l\'extension VS Code', lang: 'bash' },
        ],
      },
      {
        id: 'api',
        icon: 'Terminal',
        title: 'API REST',
        content: [
          { type: 'text' as const, value: "L'API Netral permet d'intégrer les capacités de l'assistant dans vos applications. Base URL : <code>https://netral.app/api</code>" },
          { type: 'subsection' as const, value: 'Authentification' },
          { type: 'text' as const, value: 'Toutes les requêtes nécessitent un token Bearer dans le header <code>Authorization</code>. Générez votre token dans Paramètres → API.' },
          { type: 'code' as const, value: 'curl -X POST https://netral.app/api/chat \\\n  -H "Authorization: Bearer ntrl_xxxxxxxxxxxx" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"message": "Explique-moi la récursion en Python", "model": "ntrl-2.0"}\'', lang: 'bash' },
          { type: 'subsection' as const, value: 'Endpoints' },
          { type: 'list' as const, value: [
            "<code>POST /api/chat</code> — Envoyer un message à l'IA",
            '<code>GET /api/conversations</code> — Lister vos conversations',
            '<code>GET /api/conversations/:id</code> — Récupérer une conversation',
            '<code>DELETE /api/conversations/:id</code> — Supprimer une conversation',
            '<code>GET /api/user</code> — Infos du compte',
            '<code>PATCH /api/user/settings</code> — Modifier les paramètres',
          ] as string[] },
          { type: 'subsection' as const, value: 'Réponse type' },
          { type: 'code' as const, value: '{\n  "id": "msg_abc123",\n  "content": "La récursion est une technique...",\n  "sources": [\n    { "url": "https://docs.python.org/...", "title": "Python Docs" }\n  ],\n  "reasoningTime": 1.8,\n  "model": "ntrl-2.0",\n  "createdAt": "2026-06-06T00:00:00Z"\n}', lang: 'json' },
        ],
      },
      {
        id: 'vscode',
        icon: 'Code2',
        title: 'Extension VS Code',
        content: [
          { type: 'text' as const, value: "L'extension Netral pour VS Code est un agent IA natif qui lit, écrit et corrige votre code directement dans l'éditeur." },
          { type: 'subsection' as const, value: 'Fonctionnalités' },
          { type: 'list' as const, value: [
            '<strong>Chat intégré</strong> : posez des questions sans quitter VS Code (Ctrl+Shift+N)',
            '<strong>Inline edit</strong> : sélectionnez du code, demandez une modification, acceptez ou refusez le diff',
            "<strong>Multi-fichiers</strong> : l'agent peut lire et modifier plusieurs fichiers simultanément",
            "<strong>Terminal</strong> : l'IA peut exécuter des commandes shell (avec votre confirmation)",
            '<strong>Contexte automatique</strong> : le fichier ouvert et la sélection sont envoyés comme contexte',
          ] as string[] },
          { type: 'subsection' as const, value: 'Raccourcis' },
          { type: 'list' as const, value: [
            '<kbd>Ctrl+Shift+N</kbd> — Ouvrir le chat Netral',
            '<kbd>Ctrl+Shift+I</kbd> — Inline edit sur la sélection',
            '<kbd>Ctrl+Shift+A</kbd> — Ajouter le fichier courant au contexte',
          ] as string[] },
          { type: 'note' as const, value: "Le token API est stocké localement dans le Secret Storage de VS Code. Il n'est jamais envoyé à d'autres serveurs que netral.app." },
        ],
      },
      {
        id: 'web-search',
        icon: 'Search',
        title: 'Recherche web temps réel',
        content: [
          { type: 'text' as const, value: 'Netral intègre une recherche web en direct. L\'IA décide automatiquement quand chercher, ou vous pouvez forcer la recherche avec le préfixe <code>@web</code>.' },
          { type: 'subsection' as const, value: 'Activation' },
          { type: 'list' as const, value: [
            '<strong>Automatique</strong> : l\'IA détecte les questions nécessitant des infos récentes (actualités, docs techniques, prix)',
            '<strong>Manuelle</strong> : préfixez votre message par <code>@web</code> (<em>ex: @web dernières news React 19</em>)',
            '<strong>Jamais</strong> : utilisez <code>@offline</code> pour désactiver la recherche',
          ] as string[] },
          { type: 'subsection' as const, value: 'Citations' },
          { type: 'text' as const, value: 'Chaque information sourcée affiche une citation cliquable <code>[1]</code>, <code>[2]</code>, etc. Les sources sont listées en bas de la réponse avec le titre et le domaine.' },
        ],
      },
      {
        id: 'memory',
        icon: 'Brain',
        title: 'Mémoire contextuelle',
        content: [
          { type: 'text' as const, value: 'Netral retient vos préférences, votre métier, vos projets et vos technologies favorites pour des réponses de plus en plus pertinentes.' },
          { type: 'subsection' as const, value: 'Ce que Netral mémorise' },
          { type: 'list' as const, value: [
            'Votre métier / rôle (ex: développeur React senior)',
            'Langages et frameworks utilisés',
            'Projets en cours avec leur contexte',
            'Préférences de style (code comments, langues, format)',
            'Informations fournies explicitement',
          ] as string[] },
          { type: 'subsection' as const, value: 'Gestion' },
          { type: 'text' as const, value: 'Gérez la mémoire dans <strong>Paramètres → Mémoire</strong>. Vous pouvez voir tout ce que Netral sait sur vous, modifier ou supprimer des entrées, ou désactiver complètement la mémoire.' },
          { type: 'warning' as const, value: "La mémoire contextuelle est stockée de manière chiffrée. Netral n'utilise jamais ces données pour entraîner des modèles tiers. Vous pouvez tout supprimer à tout moment." },
        ],
      },
      {
        id: 'integrations',
        icon: 'Layers',
        title: 'Intégrations Google',
        content: [
          { type: 'text' as const, value: "Connectez vos services Google (Gmail, Calendar, Drive) pour permettre à Netral d'interagir avec vos emails, événements et documents." },
          { type: 'subsection' as const, value: 'Connexion' },
          { type: 'list' as const, value: [
            'Allez dans <strong>Paramètres → Intégrations</strong>',
            'Cliquez "Connecter Google"',
            'Autorisez les permissions via OAuth 2.0',
            'Netral peut maintenant lire vos emails, gérer votre calendrier et accéder à vos Drive',
          ] as string[] },
          { type: 'subsection' as const, value: "Cas d'usage" },
          { type: 'list' as const, value: [
            '"Résume mes emails non lus depuis ce matin"',
            '"Crée un événement demain 14h pour la réunion design"',
            '"Trouve le document avec les specs API dans mon Drive"',
          ] as string[] },
          { type: 'note' as const, value: 'L\'accès aux services Google peut être révoqué à tout moment depuis les Paramètres ou depuis <a href="https://myaccount.google.com/permissions" class="text-[var(--accent)]">Google Account Permissions</a>.' },
        ],
      },
      {
        id: 'models',
        icon: 'Layers',
        title: 'Modèles disponibles',
        content: [
          { type: 'text' as const, value: "Netral utilise plusieurs modèles d'IA. Le modèle utilisé dépend de votre plan et du type de requête." },
          { type: 'subsection' as const, value: 'NTRL 1.3 (Free)' },
          { type: 'list' as const, value: ['Basé sur Mistral Medium', 'Excellent rapport qualité/vitesse', 'Recherche web incluse', 'Limité à 1 message/jour'] as string[] },
          { type: 'subsection' as const, value: 'NTRL 1.2 (Pro)' },
          { type: 'list' as const, value: ['Basé sur Gemini 2.5 Flash', 'Contexte 1M tokens', 'Multimodal natif (images, audio)', 'Messages illimités'] as string[] },
          { type: 'subsection' as const, value: 'NTRL 2.0 (Pro/Enterprise)' },
          { type: 'list' as const, value: ['Basé sur Kimi K2', 'Raisonnement avancé', 'Tool-calling natif', 'Idéal pour le code complexe'] as string[] },
        ],
      },
      {
        id: 'token',
        icon: 'Key',
        title: 'Token API & Sécurité',
        content: [
          { type: 'text' as const, value: "Le token API est votre clé d'accès personnelle. Il permet d'utiliser Netral depuis l'extension VS Code ou votre propre code." },
          { type: 'subsection' as const, value: 'Génération' },
          { type: 'code' as const, value: "# 1. Allez dans Paramètres → API\n# 2. Cliquez \"Générer un token\"\n# 3. Copiez le token (il ne s'affiche qu'une fois)\n# Format: ntrl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", lang: 'bash' },
          { type: 'warning' as const, value: "Ne partagez jamais votre token. Ne le commitez pas dans un dépôt git. Utilisez des variables d'environnement. Vous pouvez révoquer un token à tout moment." },
          { type: 'subsection' as const, value: 'Bonnes pratiques' },
          { type: 'list' as const, value: [
            'Stockez le token dans <code>.env.local</code> (exclu de git)',
            'Utilisez <code>process.env.NETRAL_API_TOKEN</code> dans votre code',
            'Régénérez votre token tous les 90 jours',
            'Utilisez des tokens différents par environnement (dev/prod)',
          ] as string[] },
        ],
      },
      {
        id: 'faq',
        icon: 'Zap',
        title: 'FAQ technique',
        content: [
          { type: 'subsection' as const, value: 'Quelle est la limite de contexte ?' },
          { type: 'text' as const, value: "Le contexte varie selon le modèle : jusqu'à 32K tokens pour NTRL 1.3, 1M tokens pour NTRL 1.2 (Gemini), et 128K tokens pour NTRL 2.0." },
          { type: 'subsection' as const, value: 'Puis-je uploader des fichiers ?' },
          { type: 'text' as const, value: 'Oui. Formats supportés : PDF, TXT, CSV, JSON, images (PNG, JPG, WebP), code source (.ts, .js, .py, .rs, .go, etc.). Glissez-déposez dans le chat.' },
          { type: 'subsection' as const, value: 'Les réponses sont-elles déterministes ?' },
          { type: 'text' as const, value: "L'IA générative produit des réponses différentes à chaque requête. Utilisez le paramètre <code>temperature</code> (0 à 1) dans l'API pour contrôler la créativité." },
          { type: 'subsection' as const, value: 'Y a-t-il une limite de rate ?' },
          { type: 'text' as const, value: "Plan Free : 1 message/jour. Pro : 500 messages/heure. Enterprise : illimité. L'API a un rate limit de 60 req/min (Pro) et 300 req/min (Enterprise)." },
          { type: 'subsection' as const, value: 'Comment signaler un bug ?' },
          { type: 'text' as const, value: 'Ouvrez une issue sur <a href="https://github.com/wice5545-beep/netral-web" class="text-[var(--accent)]">GitHub</a> ou contactez <a href="mailto:netral.ai.team@gmail.com" class="text-[var(--accent)]">netral.ai.team@gmail.com</a>.' },
        ],
      },
    ],
  },
  en: {
    title: 'Documentation',
    back: '← Back',
    intro: 'Everything you need to know to use Netral effectively. This documentation covers the API, VS Code extension, web search, contextual memory and integrations.',
    sections: [
      {
        id: 'getting-started',
        icon: 'BookOpen',
        title: 'Getting Started',
        content: [
          { type: 'text' as const, value: 'Netral is a multimodal AI assistant accessible via <strong>netral.app</strong> or the VS Code extension. Create an account (email or Google OAuth) to get started.' },
          { type: 'subsection' as const, value: 'Quick Start' },
          { type: 'list' as const, value: [
            'Create an account at <a href="/register" class="text-[var(--accent)]">netral.app/register</a>',
            'Choose your plan (Free, Pro, or Enterprise)',
            'Go to <a href="/chat" class="text-[var(--accent)]">netral.app/chat</a>',
            'Ask your first question — the AI responds with web search, citations and memory context',
          ] as string[] },
          { type: 'subsection' as const, value: 'VS Code Setup' },
          { type: 'text' as const, value: 'Download the extension from the <a href="https://marketplace.visualstudio.com" class="text-[var(--accent)]">VS Code Marketplace</a> or search "Netral" in the Extensions tab (Ctrl+Shift+X).' },
          { type: 'code' as const, value: '# In VS Code, generate an API token:\n# Settings → API → Generate Token\n# Paste it into the VS Code extension', lang: 'bash' },
        ],
      },
      {
        id: 'api',
        icon: 'Terminal',
        title: 'REST API',
        content: [
          { type: 'text' as const, value: 'The Netral API lets you integrate the assistant\'s capabilities into your applications. Base URL: <code>https://netral.app/api</code>' },
          { type: 'subsection' as const, value: 'Authentication' },
          { type: 'text' as const, value: 'All requests require a Bearer token in the <code>Authorization</code> header. Generate your token in Settings → API.' },
          { type: 'code' as const, value: 'curl -X POST https://netral.app/api/chat \\\n  -H "Authorization: Bearer ntrl_xxxxxxxxxxxx" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"message": "Explain recursion in Python", "model": "ntrl-2.0"}\'', lang: 'bash' },
          { type: 'subsection' as const, value: 'Endpoints' },
          { type: 'list' as const, value: [
            '<code>POST /api/chat</code> — Send a message to the AI',
            '<code>GET /api/conversations</code> — List your conversations',
            '<code>GET /api/conversations/:id</code> — Get a conversation',
            '<code>DELETE /api/conversations/:id</code> — Delete a conversation',
            '<code>GET /api/user</code> — Account info',
            '<code>PATCH /api/user/settings</code> — Update settings',
          ] as string[] },
          { type: 'subsection' as const, value: 'Response format' },
          { type: 'code' as const, value: '{\n  "id": "msg_abc123",\n  "content": "Recursion is a technique...",\n  "sources": [\n    { "url": "https://docs.python.org/...", "title": "Python Docs" }\n  ],\n  "reasoningTime": 1.8,\n  "model": "ntrl-2.0",\n  "createdAt": "2026-06-06T00:00:00Z"\n}', lang: 'json' },
        ],
      },
      {
        id: 'vscode',
        icon: 'Code2',
        title: 'VS Code Extension',
        content: [
          { type: 'text' as const, value: 'The Netral VS Code extension is a native AI agent that reads, writes and fixes your code directly in the editor.' },
          { type: 'subsection' as const, value: 'Features' },
          { type: 'list' as const, value: [
            '<strong>Integrated Chat</strong>: ask questions without leaving VS Code (Ctrl+Shift+N)',
            '<strong>Inline Edit</strong>: select code, request a change, accept or reject the diff',
            '<strong>Multi-file</strong>: the agent can read and modify multiple files simultaneously',
            '<strong>Terminal</strong>: the AI can execute shell commands (with your confirmation)',
            '<strong>Auto Context</strong>: the open file and selection are sent as context',
          ] as string[] },
          { type: 'subsection' as const, value: 'Shortcuts' },
          { type: 'list' as const, value: [
            '<kbd>Ctrl+Shift+N</kbd> — Open Netral Chat',
            '<kbd>Ctrl+Shift+I</kbd> — Inline edit on selection',
            '<kbd>Ctrl+Shift+A</kbd> — Add current file to context',
          ] as string[] },
          { type: 'note' as const, value: "The API token is stored locally in VS Code's Secret Storage. It is never sent to any server other than netral.app." },
        ],
      },
      {
        id: 'web-search',
        icon: 'Search',
        title: 'Real-time Web Search',
        content: [
          { type: 'text' as const, value: 'Netral includes live web search. The AI automatically decides when to search, or you can force it with the <code>@web</code> prefix.' },
          { type: 'subsection' as const, value: 'Activation' },
          { type: 'list' as const, value: [
            '<strong>Auto</strong>: the AI detects questions needing recent info (news, tech docs, prices)',
            '<strong>Manual</strong>: prefix your message with <code>@web</code> (<em>ex: @web latest React 19 news</em>)',
            '<strong>Never</strong>: use <code>@offline</code> to disable search',
          ] as string[] },
          { type: 'subsection' as const, value: 'Citations' },
          { type: 'text' as const, value: 'Each sourced piece of information shows a clickable citation <code>[1]</code>, <code>[2]</code>, etc. Sources are listed at the bottom of the response.' },
        ],
      },
      {
        id: 'memory',
        icon: 'Brain',
        title: 'Contextual Memory',
        content: [
          { type: 'text' as const, value: 'Netral remembers your preferences, profession, projects and favorite technologies for increasingly relevant responses.' },
          { type: 'subsection' as const, value: 'What Netral remembers' },
          { type: 'list' as const, value: [
            'Your profession / role (e.g., senior React developer)',
            'Languages and frameworks used',
            'Ongoing projects with their context',
            'Style preferences (code comments, languages, format)',
            'Information explicitly provided',
          ] as string[] },
          { type: 'subsection' as const, value: 'Management' },
          { type: 'text' as const, value: 'Manage memory in <strong>Settings → Memory</strong>. You can see everything Netral knows about you, edit or delete entries, or disable memory entirely.' },
          { type: 'warning' as const, value: 'Memory is stored encrypted. Netral never uses this data to train third-party models. You can delete everything at any time.' },
        ],
      },
      {
        id: 'integrations',
        icon: 'Layers',
        title: 'Google Integrations',
        content: [
          { type: 'text' as const, value: 'Connect your Google services (Gmail, Calendar, Drive) to let Netral interact with your emails, events and documents.' },
          { type: 'subsection' as const, value: 'Connection' },
          { type: 'list' as const, value: [
            'Go to <strong>Settings → Integrations</strong>',
            'Click "Connect Google"',
            'Authorize permissions via OAuth 2.0',
            'Netral can now read your emails, manage your calendar and access Drive',
          ] as string[] },
          { type: 'subsection' as const, value: 'Use Cases' },
          { type: 'list' as const, value: [
            '"Summarize my unread emails from this morning"',
            '"Create an event tomorrow at 2pm for the design meeting"',
            '"Find the document with API specs in my Drive"',
          ] as string[] },
          { type: 'note' as const, value: 'Google access can be revoked at any time from Settings or <a href="https://myaccount.google.com/permissions" class="text-[var(--accent)]">Google Account Permissions</a>.' },
        ],
      },
      {
        id: 'models',
        icon: 'Layers',
        title: 'Available Models',
        content: [
          { type: 'text' as const, value: 'Netral uses multiple AI models. The model used depends on your plan and query type.' },
          { type: 'subsection' as const, value: 'NTRL 1.3 (Free)' },
          { type: 'list' as const, value: ['Based on Mistral Medium', 'Great quality/speed ratio', 'Web search included', 'Limited to 1 message/day'] as string[] },
          { type: 'subsection' as const, value: 'NTRL 1.2 (Pro)' },
          { type: 'list' as const, value: ['Based on Gemini 2.5 Flash', '1M token context', 'Native multimodal (images, audio)', 'Unlimited messages'] as string[] },
          { type: 'subsection' as const, value: 'NTRL 2.0 (Pro/Enterprise)' },
          { type: 'list' as const, value: ['Based on Kimi K2', 'Advanced reasoning', 'Native tool-calling', 'Ideal for complex code'] as string[] },
        ],
      },
      {
        id: 'token',
        icon: 'Key',
        title: 'API Token & Security',
        content: [
          { type: 'text' as const, value: 'The API token is your personal access key. It allows using Netral from the VS Code extension or your own code.' },
          { type: 'subsection' as const, value: 'Generation' },
          { type: 'code' as const, value: '# 1. Go to Settings → API\n# 2. Click "Generate Token"\n# 3. Copy the token (shown only once)\n# Format: ntrl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', lang: 'bash' },
          { type: 'warning' as const, value: "Never share your token. Don't commit it in git. Use environment variables. You can revoke a token at any time." },
          { type: 'subsection' as const, value: 'Best Practices' },
          { type: 'list' as const, value: [
            'Store token in <code>.env.local</code> (git-ignored)',
            'Use <code>process.env.NETRAL_API_TOKEN</code> in your code',
            'Rotate your token every 90 days',
            'Use different tokens per environment (dev/prod)',
          ] as string[] },
        ],
      },
      {
        id: 'faq',
        icon: 'Zap',
        title: 'Technical FAQ',
        content: [
          { type: 'subsection' as const, value: 'What is the context limit?' },
          { type: 'text' as const, value: 'Context varies by model: up to 32K tokens for NTRL 1.3, 1M tokens for NTRL 1.2 (Gemini), and 128K tokens for NTRL 2.0.' },
          { type: 'subsection' as const, value: 'Can I upload files?' },
          { type: 'text' as const, value: 'Yes. Supported formats: PDF, TXT, CSV, JSON, images (PNG, JPG, WebP), source code (.ts, .js, .py, .rs, .go, etc.). Drag and drop into chat.' },
          { type: 'subsection' as const, value: 'Are responses deterministic?' },
          { type: 'text' as const, value: 'No. Generative AI produces different responses each query. Use the <code>temperature</code> parameter (0 to 1) in the API to control creativity.' },
          { type: 'subsection' as const, value: 'Is there a rate limit?' },
          { type: 'text' as const, value: 'Free plan: 1 message/day. Pro: 500 messages/hour. Enterprise: unlimited. API rate limit is 60 req/min (Pro) and 300 req/min (Enterprise).' },
          { type: 'subsection' as const, value: 'How to report a bug?' },
          { type: 'text' as const, value: 'Open an issue on <a href="https://github.com/wice5545-beep/netral-web" class="text-[var(--accent)]">GitHub</a> or contact <a href="mailto:netral.ai.team@gmail.com" class="text-[var(--accent)]">netral.ai.team@gmail.com</a>.' },
        ],
      },
    ],
  },
} as const

type ContentBlock = {
  type: 'text' | 'code' | 'list' | 'note' | 'warning' | 'subsection'
  value: string | readonly string[]
  lang?: string
}

type Section = {
  id: string
  icon: string
  title: string
  content: readonly ContentBlock[]
}

type LangContent = {
  title: string
  back: string
  intro: string
  sections: readonly Section[]
}

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  BookOpen, Terminal, Code2, Search, Brain, Layers, Zap, Key,
}

export default function DocsPage() {
  const { locale } = useI18n()
  const c = (CONTENT[locale as keyof typeof CONTENT] ?? CONTENT.en) as unknown as LangContent
  const [activeSection, setActiveSection] = useState(c.sections[0].id)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const renderBlock = (block: ContentBlock, i: number) => {
    switch (block.type) {
      case 'text':
        return <p key={i} className="text-[14px] leading-[1.8] text-[var(--fg-soft)]" dangerouslySetInnerHTML={{ __html: block.value as string }} />
      case 'subsection':
        return <h3 key={i} className="text-[16px] font-semibold text-[var(--fg)] mt-6 mb-2">{block.value}</h3>
      case 'list':
        return (
          <ul key={i} className="space-y-1.5 my-2">
            {(block.value as readonly string[]).map((item: string) => (
              <li key={item} className="flex gap-2 text-[14px] text-[var(--fg-soft)]">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" />
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </li>
            ))}
          </ul>
        )
      case 'code':
        return (
          <div key={i} className="relative my-3 rounded-xl overflow-hidden border border-[var(--border)] bg-[#0d1117]">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-soft)]/50 border-b border-[var(--border)]">
              <span className="text-[11px] font-mono text-[var(--fg-muted)]">{block.lang || 'bash'}</span>
              <button
                onClick={() => copyToClipboard(block.value as string, `code-${i}`)}
                className="flex items-center gap-1.5 text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                {copied === `code-${i}` ? '✓ Copié' : <><Copy size={12} /> Copier</>}
              </button>
            </div>
            <pre className="px-4 py-3 text-[13px] font-mono text-[#c9d1d9] leading-[1.7] overflow-x-auto">
              <code>{block.value}</code>
            </pre>
          </div>
        )
      case 'note':
        return (
          <div key={i} className="my-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[11px] text-blue-400">i</span>
            </div>
            <p className="text-[13px] text-blue-300/90 leading-[1.6]" dangerouslySetInnerHTML={{ __html: block.value as string }} />
          </div>
        )
      case 'warning':
        return (
          <div key={i} className="my-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[11px] text-amber-400">!</span>
            </div>
            <p className="text-[13px] text-amber-300/90 leading-[1.6]" dangerouslySetInnerHTML={{ __html: block.value as string }} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="border-b border-[var(--border)] bg-[var(--bg-soft)]/30">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <Link href="/" className="text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] mb-4 inline-block transition-colors">
            {c.back}
          </Link>
          <h1 className="text-[32px] font-bold tracking-[-0.03em] mb-2">{c.title}</h1>
          <p className="text-[14px] text-[var(--fg-muted)] max-w-2xl">{c.intro}</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 flex gap-8 py-10">
        <nav className="w-[240px] shrink-0 hidden lg:block">
          <div className="sticky top-10 space-y-0.5">
            {c.sections.map((s: Section) => {
              const Icon = iconMap[s.icon]
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id)
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-left transition-all ${
                    activeSection === s.id
                      ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-soft)]'
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  <span className="truncate">{s.title}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <div className="flex-1 min-w-0 max-w-[800px]">
          {c.sections.map((s: Section) => (
            <section key={s.id} id={s.id} className="pb-12 mb-12 border-b border-[var(--border)] last:border-0">
              <div className="flex items-center gap-3 mb-6">
                {(() => { const Icon = iconMap[s.icon]; return Icon ? <Icon size={22} className="text-[var(--accent)]" /> : null })()}
                <h2 className="text-[24px] font-semibold">{s.title}</h2>
              </div>
              {s.content.map((block: ContentBlock, i: number) => renderBlock(block, i))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}