'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Settings, ChevronLeft, ChevronRight,
  Zap, FolderOpen, BarChart3, Bell, HelpCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/actions/auth'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '#', label: 'Projects', icon: FolderOpen },
  { href: '#', label: 'Analytics', icon: BarChart3 },
  { href: '#', label: 'Notifications', icon: Bell },
]

const bottomItems = [
  { href: '#', label: 'Help', icon: HelpCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  userName?: string
  userEmail?: string
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative flex flex-col h-full bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-[var(--sidebar-border)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={false}
              animate={{ opacity: collapsed ? 0 : 1 }}
              className="font-bold text-[var(--foreground)] text-lg whitespace-nowrap"
            >
              Netral
            </motion.span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]',
                collapsed && 'justify-center'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-1 border-t border-[var(--sidebar-border)]">
        {bottomItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]',
                collapsed && 'justify-center'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          )
        })}

        {/* User */}
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mt-2">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userName?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">{userName ?? 'User'}</p>
              <p className="text-xs text-[var(--foreground-muted)] truncate">{userEmail ?? ''}</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors shadow-sm z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  )
}
