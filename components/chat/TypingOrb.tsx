'use client'

export function TypingOrb() {
  return (
    <div className="flex items-center gap-1 py-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg-muted)] typing-dot" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg-muted)] typing-dot" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--fg-muted)] typing-dot" style={{ animationDelay: '300ms' }} />
    </div>
  )
}
