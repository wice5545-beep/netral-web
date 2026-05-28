'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Brain } from 'lucide-react'
import { Markdown } from './Markdown'

/**
 * Collapsible chain-of-thought block, ChatGPT/Claude o1-style.
 * When `isReasoning` is true (model still thinking), shows shimmer label + expanded by default.
 * When done, collapses to a single-line summary "Reflechi pendant Xs" with click-to-expand.
 *
 * The reasoning content is parsed as markdown (italic-styled).
 *
 * If `content` is empty/whitespace, renders nothing.
 */
export function ReasoningBlock({
  content,
  isReasoning = false,
  durationSec,
}: {
  content: string
  isReasoning?: boolean
  durationSec?: number
}) {
  const [open, setOpen] = useState(isReasoning)
  const trimmed = content.trim()

  if (!trimmed) return null

  const summary = isReasoning
    ? 'Raisonnement en cours...'
    : durationSec
    ? `Reflechi pendant ${durationSec}s`
    : 'Voir le raisonnement'

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="my-4 reasoning-block pl-3.5 pr-2 py-2"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 w-full text-left group/r"
        aria-expanded={open}
      >
        <span className="shrink-0 w-5 h-5 rounded-md bg-[var(--bg-soft)] border border-[var(--border)] flex items-center justify-center">
          <Brain
            size={11}
            className={
              isReasoning
                ? 'text-violet-500 animate-pulse'
                : 'text-[var(--fg-muted)] group-hover/r:text-[var(--fg)] transition-colors'
            }
          />
        </span>
        <span
          className={
            isReasoning
              ? 'text-[12.5px] streaming-shimmer font-medium'
              : 'text-[12.5px] font-medium text-[var(--fg-muted)] group-hover/r:text-[var(--fg)] transition-colors'
          }
        >
          {summary}
        </span>
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-[var(--fg-subtle)] group-hover/r:text-[var(--fg-muted)]"
        >
          <ChevronDown size={12} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="reasoning-thoughts pt-3 pb-1">
              <Markdown content={trimmed} />
              {isReasoning && (
                <span className="inline-block w-1.5 h-3 bg-[var(--fg-muted)] ml-0.5 align-middle animate-pulse" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Splits assistant content into reasoning + answer.
 * Recognizes common reasoning fences:
 *   <think>...</think>
 *   <reasoning>...</reasoning>
 *   ```reasoning ... ```
 */
export function splitReasoning(raw: string): {
  reasoning: string
  answer: string
  isReasoningOpen: boolean
} {
  if (!raw) return { reasoning: '', answer: '', isReasoningOpen: false }

  // <think> or <reasoning>
  const tagOpen = raw.match(/<(think|reasoning)>/i)
  if (tagOpen) {
    const tag = tagOpen[1]
    const closeRe = new RegExp(`<\\/${tag}>`, 'i')
    const closeMatch = raw.match(closeRe)
    if (closeMatch && closeMatch.index !== undefined) {
      const start = (tagOpen.index ?? 0) + tagOpen[0].length
      const reasoning = raw.slice(start, closeMatch.index).trim()
      const before = raw.slice(0, tagOpen.index ?? 0)
      const after = raw.slice(closeMatch.index + closeMatch[0].length)
      return {
        reasoning,
        answer: (before + after).trim(),
        isReasoningOpen: false,
      }
    }
    // Open but not closed yet → still reasoning
    const reasoning = raw.slice((tagOpen.index ?? 0) + tagOpen[0].length).trim()
    return { reasoning, answer: '', isReasoningOpen: true }
  }

  return { reasoning: '', answer: raw, isReasoningOpen: false }
}
