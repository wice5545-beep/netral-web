'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Check, Copy, Terminal } from 'lucide-react'
import 'highlight.js/styles/github-dark.css'

interface MarkdownProps {
  content: string
}

function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)
  const code = typeof children === 'string' ? children : String(children ?? '').replace(/\n$/, '')
  const language = className?.replace('language-', '').replace('hljs', '').trim() || ''
  const lineCount = code.split('\n').length

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="relative group not-prose my-5 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-elevated)] border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)] opacity-60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)] opacity-40" />
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)] opacity-20" />
          </div>
          <span className="text-[10.5px] font-mono text-[var(--fg-muted)] uppercase tracking-wider font-medium">{language || 'code'}</span>
          {lineCount > 1 && <span className="text-[9.5px] text-[var(--fg-subtle)] tabular-nums">{lineCount} lignes</span>}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-soft)] transition-all active:scale-95 opacity-0 group-hover:opacity-100"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="ok" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-emerald-500">
                <Check size={11} />Copié
              </motion.span>
            ) : (
              <motion.span key="cp" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                <Copy size={11} />Copier
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
      {/* Code */}
      <pre className="!m-0 !rounded-none !border-0 !bg-transparent px-4 py-3.5 overflow-x-auto text-[13px] leading-[1.7]">
        <code className={className}>{children}</code>
      </pre>
    </div>
  )
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        pre: ({ children }) => {
          const codeChild = Array.isArray(children) ? children[0] : children
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const child = codeChild as any
          if (child?.props) {
            return <CodeBlock className={child.props.className}>{child.props.children}</CodeBlock>
          }
          return <pre>{children}</pre>
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
