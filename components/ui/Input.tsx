import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-[var(--fg-soft)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full h-10 px-3.5 rounded-[8px] bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg)] text-[14px]',
              'placeholder:text-[var(--fg-subtle)]',
              'focus:outline-none focus:border-[var(--border-strong)]',
              'transition-all duration-150',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--bg-soft)]',
              error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[12px] text-red-500 mt-0.5">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
