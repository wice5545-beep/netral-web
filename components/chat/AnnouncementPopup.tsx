'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const STORAGE_KEY = 'netral-ntrl2-announced'

export function AnnouncementPopup() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem(STORAGE_KEY, 'true')
  }

  const announcement = t.announcement

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-card w-full max-w-sm p-6 pointer-events-auto shadow-colored text-center relative">
              <button onClick={handleClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] transition-colors">
                <X size={14} />
              </button>

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
                <Sparkles size={22} className="text-white" />
              </div>

              <h3 className="text-[18px] font-bold mb-2">{announcement?.title || 'NTRL 2.0 est arrive !'}</h3>
              <p className="text-[14px] text-[var(--fg-muted)] mb-6 leading-relaxed">
                {announcement?.description || 'NTRL 2.0 remplace NTRL 1.0 avec des capacites de raisonnement avancees et une pensee profonde. Reserve aux abonnes Pro et Pro+.'}
              </p>

              <div className="space-y-2.5">
                <Link href="/tarifs" onClick={handleClose}>
                  <button className="w-full h-11 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-all active:scale-[0.97] shadow-sm">
                    {announcement?.cta || 'Voir les plans'}
                  </button>
                </Link>
                <button onClick={handleClose} className="w-full h-11 rounded-xl text-[14px] text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] transition-colors">
                  {announcement?.dismiss || 'Compris'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
