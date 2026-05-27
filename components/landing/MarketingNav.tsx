'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { NetralLogo } from '@/components/ui/NetralLogo'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Floating glass nav-pill, shared across landing/tarifs/fonctionnalites.
 * Becomes more compact on scroll.
 */
export function MarketingNav() {
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed left-1/2 -translate-x-1/2 z-50 nav-pill px-2 py-1.5 transition-all duration-500',
        scrolled ? 'top-3 scale-[0.97]' : 'top-5 scale-100'
      )}
      style={{
        boxShadow: scrolled
          ? '0 8px 32px -4px rgba(0,0,0,0.18), 0 4px 12px -2px rgba(124,58,237,0.08)'
          : undefined,
      }}
    >
      <div className="flex items-center gap-1">
        <Link href="/" className="flex items-center gap-2 px-3 py-1.5 group">
          <NetralLogo size={20} />
          <span className="font-semibold text-[14px] tracking-[-0.3px] group-hover:text-[var(--fg)] transition-colors">
            Netral
          </span>
        </Link>
        <div className="hidden md:flex items-center">
          <NavLink href="/fonctionnalites">{t.nav.features}</NavLink>
          <NavLink href="/tarifs">{t.nav.pricing}</NavLink>
          <NavLink href="/extensions">VS Code</NavLink>
          <NavLink href="/changelog">Changelog</NavLink>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="hidden sm:inline-flex px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            {t.nav.login}
          </Link>
          <Link href="/register">
            <button
              className="h-8 px-4 text-[13px] font-medium rounded-full bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] transition-all shadow-sm hover:shadow-md hover:scale-[1.03] active:scale-95"
            >
              {t.nav.start}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] rounded-full hover:bg-[var(--accent-soft)] transition-all"
    >
      {children}
    </Link>
  )
}
