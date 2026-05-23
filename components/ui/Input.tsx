import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, icon, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-[var(--fg-soft)] flex items-center gap-2">
            {label}
            {hint && <span className="text-[11px] text-[var(--fg-subtle)] font-normal">— {hint}</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full h-11 px-4 rounded-[10px] bg-[var(--bg-elevated)] border border-[var(--rule)] text-[var(--fg)] text-sm',
              'placeholder:text-[var(--fg-subtle)]',
              'focus:outline-none focus:border-[var(--jewel)] focus:ring-2 focus:ring-[var(--jewel-soft)]',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-red-500/60 focus:ring-red-500/20 focus:border-red-500',
              icon && 'pl-11',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
