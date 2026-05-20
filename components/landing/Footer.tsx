import Link from 'next/link'
import { X, GitBranch, Globe } from 'lucide-react'

const links = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Documentation', 'API Reference', 'Status', 'Community'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold text-[var(--foreground)] mb-3">Netral</div>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-4">
              The modern productivity platform for high-performance teams.
            </p>
            <div className="flex items-center gap-3">
              {[X, GitBranch, Globe].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-lg hover:bg-[var(--border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-sm font-semibold text-[var(--foreground)] mb-3">{category}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--foreground-muted)]">
            © {new Date().getFullYear()} Netral Inc. All rights reserved.
          </p>
          <p className="text-sm text-[var(--foreground-muted)]">
            Made with care for teams that build great products.
          </p>
        </div>
      </div>
    </footer>
  )
}
