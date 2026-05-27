'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff } from 'lucide-react'

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const goOffline = () => setIsOffline(true)
    const goOnline = () => setIsOffline(false)

    // Check initial state
    if (!navigator.onLine) setIsOffline(true)

    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          role="alert"
          aria-live="assertive"
          className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--error)] text-white text-[13px] font-medium shadow-lg"
        >
          <WifiOff size={14} />
          <span>Vous êtes hors ligne. Vérifiez votre connexion.</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
