'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RotateCw } from 'lucide-react'

export default function ChatError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Chat Error]', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <h2 className="text-[18px] font-semibold mb-2">Une erreur est survenue</h2>
      <p className="text-[14px] text-[var(--fg-muted)] max-w-sm mb-6">
        Le chat a rencontré un problème inattendu. Réessayez ou rechargez la page.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Recharger
        </Button>
        <Button variant="primary" onClick={reset}>
          <RotateCw size={14} />
          Réessayer
        </Button>
      </div>
      {error.digest && (
        <p className="mt-4 text-[11px] text-[var(--fg-subtle)] font-mono">ID: {error.digest}</p>
      )}
    </div>
  )
}
