'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Zap } from 'lucide-react'

interface UpgradePopupProps {
  open: boolean
  onClose: () => void
  message?: string
}

export function UpgradePopup({ open, onClose, message }: UpgradePopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card w-full max-w-sm p-6 pointer-events-auto shadow-colored text-center relative">
              <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] transition-colors">
                <X size={14} />
              </button>

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #7c3aed, #f97316)' }}>
                <Zap size={22} className="text-white" />
              </div>

              <h3 className="text-[18px] font-bold mb-2">Limite atteinte</h3>
              <p className="text-[14px] text-[var(--fg-muted)] mb-6 leading-relaxed">
                {message || 'Passez à un plan supérieur pour continuer à utiliser Netral.'}
              </p>

              <div className="space-y-2.5">
                <Link href="/tarifs" onClick={onClose}>
                  <button className="w-full h-11 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.97] shadow-sm">
                    Voir les plans
                  </button>
                </Link>
                <button onClick={onClose} className="w-full h-11 rounded-xl text-[14px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] transition-colors">
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
