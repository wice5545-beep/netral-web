'use client'

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed top-0 left-0 z-[9999] px-4 py-2 bg-[var(--accent)] text-[var(--bg)] text-[14px] font-medium rounded-br-lg transform -translate-y-full focus:translate-y-0 transition-transform duration-200"
    >
      Aller au contenu principal
    </a>
  )
}
