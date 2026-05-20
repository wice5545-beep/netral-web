'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bell, Palette, Database, HardDrive, Shield, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GeneralTab } from './tabs/General'
import { NotificationsTab } from './tabs/Notifications'
import { PersonalizationTab } from './tabs/Personalization'
import { DataTab } from './tabs/DataManagement'
import { StorageTab } from './tabs/Storage'
import { SecurityTab } from './tabs/Security'
import { ParentalTab } from './tabs/ParentalControl'

const tabs = [
  { id: 'general', label: 'General', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'personalization', label: 'Personalization', icon: Palette },
  { id: 'data', label: 'Data management', icon: Database },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'parental', label: 'Parental control', icon: Users },
]

interface SettingsTabsProps {
  user: {
    name?: string | null
    email: string
  }
  settings: {
    theme: string
    language: string
    notifications: boolean
    emailDigest: boolean
    twoFactor: boolean
    parentalEnabled: boolean
    storageLimit: number
  } | null
}

export function SettingsTabs({ user, settings }: SettingsTabsProps) {
  const [active, setActive] = useState('general')

  const renderTab = () => {
    switch (active) {
      case 'general': return <GeneralTab user={user} />
      case 'notifications': return <NotificationsTab settings={settings} />
      case 'personalization': return <PersonalizationTab settings={settings} />
      case 'data': return <DataTab />
      case 'storage': return <StorageTab settings={settings} />
      case 'security': return <SecurityTab settings={settings} />
      case 'parental': return <ParentalTab settings={settings} />
      default: return null
    }
  }

  return (
    <div className="flex gap-8">
      {/* Tab nav */}
      <nav className="w-52 shrink-0">
        <ul className="space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => setActive(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 text-left',
                  active === id
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]'
                )}
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tab content */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
