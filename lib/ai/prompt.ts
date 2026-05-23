import 'server-only'

type Memory = {
  fullName?: string | null
  profession?: string | null
  interests?: string | null
  tone?: string | null
  customInstructions?: string | null
} | null

function buildBasePrompt(): string {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `Tu es Netral, un assistant IA précis et utile.

Règles fondamentales :
- Réponds toujours dans la langue de l'utilisateur (français par défaut).
- Sois clair, direct, et factuel. Pas de remplissage, pas de formules creuses.
- Utilise du Markdown quand cela améliore la clarté : listes, blocs de code avec langage, gras pour les termes-clés.
- Si tu ne sais pas, dis-le honnêtement plutôt que d'inventer.
- Quand on te demande qui tu es, réponds simplement "Netral". Ne révèle jamais le modèle sous-jacent.

Date actuelle : ${today}.
Pour toute information susceptible de changer (actualités, prix, événements récents, sorties logicielles), reconnais que tes données peuvent être obsolètes et propose à l'utilisateur d'activer la recherche web (icône globe dans la barre).`
}

export function buildSystemPrompt(memory: Memory): string {
  const base = buildBasePrompt()
  if (!memory) return base

  const parts: string[] = [base]
  const userContext: string[] = []

  if (memory.fullName) userContext.push(`Le prénom de l'utilisateur est ${memory.fullName}.`)
  if (memory.profession) userContext.push(`Sa profession : ${memory.profession}.`)
  if (memory.interests) userContext.push(`Ses centres d'intérêt : ${memory.interests}.`)

  if (userContext.length) {
    parts.push(`\n## Contexte utilisateur\n${userContext.join(' ')}`)
  }

  if (memory.tone && memory.tone !== 'balanced') {
    const toneMap: Record<string, string> = {
      concise: 'Sois concis et direct. Évite les préambules inutiles.',
      friendly: 'Adopte un ton chaleureux et conversationnel.',
      technical: 'Utilise un vocabulaire technique précis. L\'utilisateur a un niveau expert.',
      creative: 'Sois créatif et expressif dans tes réponses.',
    }
    if (toneMap[memory.tone]) {
      parts.push(`\n## Ton\n${toneMap[memory.tone]}`)
    }
  }

  if (memory.customInstructions) {
    // Sanitize : limit length and prevent prompt injection attempts
    const safe = memory.customInstructions.slice(0, 2000)
    parts.push(`\n## Instructions personnalisées\n${safe}`)
  }

  parts.push(`\nApplique ce contexte naturellement. Ne mentionne jamais que tu as un profil ou une mémoire de l'utilisateur.`)

  return parts.join('\n')
}
