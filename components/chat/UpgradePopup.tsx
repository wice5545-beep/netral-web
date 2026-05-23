'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Zap } from 'lucide-react'

interface UpgradePopupProps {
  open: boolean
  onClose: () => void
}

export function UpgradePopup({ open, onClose }: UpgradePopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-[var(--bg-elevated)] rounded-2xl w-full max-w-sm p-6 pointer-events-auto shadow-[var(--shadow-xl)] border border-[var(--border)] text-center">
              <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-[var(--bg-soft)] text-[var(--fg-muted)]">
                <X size={14} />
              </button>

              <div className="w-12 h-12 rounded-full bg-[var(--accent-soft)] flex items-center justify-center mx-auto mb-4">
                <Zap size={20} className="text-[var(--fg)]" />
              </div>

              <h3 className="text-[18px] font-bold mb-2">Limite atteinte</h3>
              <p className="text-[14px] text-[var(--fg-muted)] mb-6 leading-relaxed">
                Vous avez utilisé tous vos messages ce mois-ci. Passez à un plan supérieur pour continuer.
              </p>

              <div className="space-y-2">
                <Link href="/tarifs" onClick={onClose}>
                  <button className="w-full h-10 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-medium hover:bg-[var(--accent-hover)] transition-all active:scale-[0.98]">
                    Voir les plans
                  </button>
                </Link>
                <button onClick={onClose} className="w-full h-10 rounded-xl text-[14px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] transition-colors">
                  Plus tard
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
