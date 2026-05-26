import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--fg)] px-6">
      <div className="text-center max-w-md">
        {/* Animated gradient number */}
        <h1 className="text-[120px] md:text-[160px] font-black tracking-[-0.05em] leading-none gradient-text opacity-80 select-none">
          404
        </h1>
        <h2 className="text-[22px] font-bold tracking-[-0.02em] mt-2 mb-3">
          Page introuvable
        </h2>
        <p className="text-[15px] text-[var(--fg-muted)] mb-8 leading-relaxed">
          Cette page n'existe pas ou a été déplacée. Vérifiez l'URL ou retournez à l'accueil.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="h-10 px-5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-[14px] font-medium text-[var(--fg)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] transition-all duration-200 inline-flex items-center gap-2"
          >
            Accueil
          </Link>
          <Link
            href="/chat"
            className="h-10 px-5 rounded-xl bg-[var(--accent)] text-[var(--bg)] text-[14px] font-medium hover:bg-[var(--accent-hover)] transition-all duration-200 inline-flex items-center gap-2 shadow-sm"
          >
            Aller au chat
          </Link>
        </div>
      </div>
    </div>
  )
}
