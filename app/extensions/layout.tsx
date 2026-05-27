import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Extensions',
  description: 'Téléchargez Netral Code, l\'extension VS Code qui intègre l\'IA directement dans votre éditeur.',
  openGraph: {
    title: 'Extensions VS Code — Netral',
    description: 'Netral Code : l\'IA dans votre éditeur. Lit, écrit et corrige votre code.',
    url: '/extensions',
  },
}

export default function ExtensionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
