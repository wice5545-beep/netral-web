'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Maximize2, X, ImageIcon, Sparkles } from 'lucide-react'

interface GeneratedImageProps {
  imageId: string
  alt?: string
}

export function GeneratedImage({ imageId, alt = 'Image générée' }: GeneratedImageProps) {
  const [expanded, setExpanded] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const imageUrl = `/api/images/${imageId}`

  const handleDownload = async () => {
    try {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `netral-${imageId.slice(0, 8)}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {}
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-3 p-4 rounded-2xl border border-zinc-700/50 bg-zinc-800/40 flex items-center gap-2 text-zinc-400 text-sm"
      >
        <ImageIcon className="w-4 h-4" />
        Image expirée ou indisponible
      </motion.div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="my-3 group relative overflow-hidden rounded-2xl border border-zinc-700/40 bg-zinc-800/20"
      >
        {/* Shimmer loading */}
        {!loaded && (
          <div className="absolute inset-0 z-10">
            <div className="w-full h-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 animate-shimmer bg-[length:200%_100%]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              >
                <Sparkles className="w-6 h-6 text-purple-400/60" />
              </motion.div>
            </div>
          </div>
        )}

        {/* Image */}
        <img
          src={imageUrl}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className="w-full h-auto max-h-[400px] object-cover transition-opacity duration-500"
          style={{ opacity: loaded ? 1 : 0 }}
        />

        {/* Hover actions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all hover:scale-105"
            title="Télécharger"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setExpanded(true)}
            className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all hover:scale-105"
            title="Agrandir"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Sparkle badge */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-400/20 text-[11px] text-purple-300 font-medium"
        >
          <Sparkles className="w-3 h-3" />
          Netral AI
        </motion.div>
      </motion.div>

      {/* Expanded modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden border border-zinc-700/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageUrl}
                alt={alt}
                className="w-full h-full object-contain max-h-[85vh]"
              />
              <div className="absolute top-3 right-3 flex gap-1.5">
                <button
                  onClick={handleDownload}
                  className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setExpanded(false)}
                  className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}