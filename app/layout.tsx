import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { I18nProvider } from '@/lib/i18n'
import { SkipToContent } from '@/components/ui/SkipToContent'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Netral — Assistant IA intelligent',
    template: '%s | Netral',
  },
  description: 'Un assistant IA précis qui consulte le web en temps réel. Mémoire contextuelle, recherche web, multi-modèles.',
  icons: { icon: '/logo.png', apple: '/logo.png' },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://netral.app'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Netral',
    title: 'Netral — Assistant IA intelligent',
    description: 'Un assistant IA précis qui consulte le web en temps réel. Mémoire contextuelle, recherche web, multi-modèles.',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Netral — Assistant IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Netral — Assistant IA intelligent',
    description: 'Un assistant IA précis qui consulte le web en temps réel.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0d0e' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="h-full bg-[var(--bg)] text-[var(--fg)] antialiased">
        <ThemeProvider>
          <I18nProvider>
            <SkipToContent />
            <OfflineIndicator />
            <div id="main-content">{children}</div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
