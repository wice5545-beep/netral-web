import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs',
  description: 'Découvrez les plans Netral : Free, Plus, Pro et Pro+. Choisissez le plan adapté à vos besoins.',
  openGraph: {
    title: 'Tarifs — Netral',
    description: 'Plans Free, Plus, Pro et Pro+. À partir de 0€/mois.',
    url: '/tarifs',
  },
}

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
