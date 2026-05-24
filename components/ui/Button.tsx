import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'relative inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:scale-[0.97] select-none whitespace-nowrap'

    const variants: Record<string, string> = {
      primary:
        'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md',
      secondary:
        'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-strong)] hover:shadow-sm',
      ghost:
        'text-[var(--fg-muted)] hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]',
      danger:
        'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    }

    const sizes = {
      sm: 'h-8 px-3 text-[13px]',
      md: 'h-9 px-4 text-[14px]',
      lg: 'h-11 px-5 text-[15px]',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        <span className={loading ? 'opacity-70' : ''}>{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
