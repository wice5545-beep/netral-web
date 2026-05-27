'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Auth Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 mx-auto">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h2 className="text-[18px] font-semibold mb-2">Erreur d'authentification</h2>
        <p className="text-[14px] text-[var(--fg-muted)] mb-6">
          Impossible de charger la page. Veuillez réessayer.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/login">
            <Button variant="secondary">Retour au login</Button>
          </Link>
          <Button variant="primary" onClick={reset}>
            Réessayer
          </Button>
        </div>
      </div>
    </div>
  )
}
