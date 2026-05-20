'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Check, Copy } from 'lucide-react'
import 'highlight.js/styles/github-dark.css'

interface MarkdownProps {
  content: string
}

function CodeBlock({ children, className, ...props }: { children?: React.ReactNode; className?: string; [k: string]: unknown }) {
  const [copied, setCopied] = useState(false)
  const code = typeof children === 'string' ? children : String(children ?? '')
  const language = className?.replace('language-', '') ?? 'text'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="relative group not-prose my-4">
      <div className="flex items-center justify-between px-4 py-2 text-xs text-[var(--foreground-muted)] border border-[var(--border)] rounded-t-xl bg-[var(--background-elevated)]">
        <span className="font-mono">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[var(--border)] transition-colors"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="!mt-0 !rounded-t-none !border-t-0">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  )
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => {
            // Get language from the code child
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
    </div>
  )
}
