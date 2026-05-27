'use client'

import { useRef, useEffect, KeyboardEvent, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, Plus, X, Image as ImageIcon, File } from 'lucide-react'
import { EarthIcon } from '@/components/ui/earth'
import { AutoAnimate } from '@/components/ui/AutoAnimate'
import { ModelSelector } from './ModelSelector'
import { cn } from '@/lib/utils'

interface ChatComposerProps {
  value: string
  onChange: (v: string) => void
  onSubmit: (attachments?: { type: 'image' | 'file'; data: string; name: string }[]) => void
  onStop?: () => void
  isStreaming: boolean
  placeholder?: string
  autoFocus?: boolean
  webSearchEnabled?: boolean
  onToggleWebSearch?: () => void
  modelId?: string
  replyContext?: string | null
  onClearReply?: () => void
}

export function ChatComposer({
  value, onChange, onSubmit, onStop, isStreaming, placeholder = 'Posez une question…',
  autoFocus, webSearchEnabled = false, onToggleWebSearch, modelId, replyContext, onClearReply,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [attachments, setAttachments] = useState<{ type: 'image' | 'file'; data: string; name: string }[]>([])
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => { if (autoFocus) textareaRef.current?.focus() }, [autoFocus])

  useEffect(() => {
    const t = textareaRef.current
    if (!t) return
    t.style.height = 'auto'
    t.style.height = Math.min(t.scrollHeight, 200) + 'px'
  }, [value])

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if ((value.trim() || attachments.length) && !isStreaming) handleSend()
    }
    // ⌘Enter also sends
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      if ((value.trim() || attachments.length) && !isStreaming) handleSend()
    }
    // Escape clears input
    if (e.key === 'Escape') {
      if (value.trim()) {
        e.preventDefault()
        onChange('')
      } else {
        textareaRef.current?.blur()
      }
    }
  }

  const handleSend = () => {
    onSubmit(attachments.length > 0 ? attachments : undefined)
    setAttachments([])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAttachments(prev => [...prev, { type, data: reader.result as string, name: file.name }])
    }
    reader.readAsDataURL(file)
    e.target.value = ''
    setDrawerOpen(false)
  }

  const removeAttachment = (idx: number) => setAttachments(prev => prev.filter((_, i) => i !== idx))

  const canSend = (value.trim().length > 0 || attachments.length > 0) && !isStreaming

  return (
    <div className="relative w-full">
      {/* Attachments preview */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex gap-2 mb-2.5 px-1">
            {attachments.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                {a.type === 'image' ? (
                  <img src={a.data} alt={a.name} className="w-16 h-16 rounded-xl object-cover border border-[var(--border)] shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] flex items-center justify-center shadow-sm">
                    <File size={16} className="text-[var(--fg-muted)]" />
                  </div>
                )}
                <button onClick={() => removeAttachment(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--fg)] text-[var(--bg)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <X size={10} />
                </button>
                <p className="text-[9px] text-[var(--fg-muted)] truncate w-16 mt-1">{a.name}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "relative rounded-2xl glass-card mega-input transition-all duration-300",
        isFocused ? "border-[var(--border-strong)] shadow-colored" : "hover:border-[var(--border-strong)]"
      )}>
        {replyContext && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 px-4 pt-3 pb-0">
            <div className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--bg-soft)] border-l-2 border-[var(--accent)] text-[12px] text-[var(--fg-muted)] line-clamp-2">
              {replyContext}
            </div>
            <button onClick={onClearReply} className="p-1.5 rounded-lg hover:bg-[var(--bg-soft)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              <X size={12} />
            </button>
          </motion.div>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={1}
          maxLength={32000}
          className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-[15px] leading-[1.5] text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none max-h-[200px]"
        />

        <div className="flex items-center justify-between px-2.5 pb-2.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDrawerOpen(!drawerOpen)}
              className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200',
                drawerOpen ? 'bg-[var(--accent)] text-[var(--bg)] rotate-45 scale-90' : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]'
              )}
            >
              <Plus size={16} strokeWidth={2} />
            </button>

            <AnimatePresence>
              {webSearchEnabled && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="h-6 px-2.5 rounded-md bg-[var(--accent-soft)] text-[var(--fg)] text-[11px] font-medium flex items-center gap-1.5">
                  <EarthIcon size={10} /> Web
                </motion.span>
              )}
              {attachments.length > 0 && (
                <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="h-6 px-2.5 rounded-md bg-[var(--accent-soft)] text-[var(--fg)] text-[11px] font-medium">
                  {attachments.length} fichier{attachments.length > 1 ? 's' : ''}
                </motion.span>
              )}
            </AnimatePresence>

            <ModelSelector />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {isStreaming ? (
              <motion.button key="stop" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} whileTap={{ scale: 0.9 }} onClick={onStop} aria-label="Arrêter" className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent)] text-[var(--bg)] shadow-sm">
                <Square size={11} fill="currentColor" />
              </motion.button>
            ) : (
              <motion.button key="send" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} whileTap={canSend ? { scale: 0.9 } : {}} onClick={handleSend} disabled={!canSend} aria-label="Envoyer" className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200', canSend ? 'bg-[var(--accent)] text-[var(--bg)] shadow-sm hover:shadow-colored hover:scale-105' : 'bg-[var(--bg-soft)] text-[var(--fg-subtle)] cursor-not-allowed')}>
                <ArrowUp size={14} strokeWidth={2.2} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.92 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }} className="absolute bottom-full left-0 mb-2 glass-card shadow-colored p-1.5 flex gap-1">
            <button onClick={() => { onToggleWebSearch?.(); setDrawerOpen(false) }} className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all', webSearchEnabled ? 'bg-[var(--accent-soft)] text-[var(--fg)] font-medium' : 'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]')}>
              <AutoAnimate icon={EarthIcon} size={14} interval={0} /> Web
            </button>
            <button disabled className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[var(--fg-subtle)] opacity-40 cursor-not-allowed">
              <ImageIcon size={14} /> Image <span className="text-[9px] ml-1 opacity-70">soon</span>
            </button>
            <button disabled className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-[var(--fg-subtle)] opacity-40 cursor-not-allowed">
              <File size={14} /> Fichier <span className="text-[9px] ml-1 opacity-70">soon</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'image')} />
      <input ref={fileInputRef} type="file" accept=".pdf,.txt,.md,.csv,.json,.xml,.html" className="hidden" onChange={(e) => handleFileSelect(e, 'file')} />

      <p className="text-[11px] text-center text-[var(--fg-subtle)] mt-2.5 opacity-50 flex items-center justify-center gap-3">
        <span>Netral peut faire des erreurs.</span>
        {value.length > 100 && (
          <span className={cn('tabular-nums', value.length > 30000 ? 'text-red-400' : '')}>{value.length.toLocaleString()}/32 000</span>
        )}
      </p>
    </div>
  )
}
