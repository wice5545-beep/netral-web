import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fonctionnalités',
  description: 'Découvrez les fonctionnalités de Netral : mémoire contextuelle, recherche web temps réel, multi-modèles IA, intégrations, extension VS Code.',
  openGraph: {
    title: 'Fonctionnalités — Netral',
    description: 'Mémoire contextuelle, recherche web, multi-modèles IA et plus.',
    url: '/fonctionnalites',
  },
}

export default function FonctionnalitesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
