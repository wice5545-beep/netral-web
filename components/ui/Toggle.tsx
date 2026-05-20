'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export function Toggle({ checked = false, onChange, label, description, disabled }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleClick = () => {
    if (disabled) return
    const next = !isChecked
    setIsChecked(next)
    onChange?.(next)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>}
          {description && <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
          isChecked ? 'bg-[var(--accent)]' : 'bg-[var(--border)]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            isChecked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}
