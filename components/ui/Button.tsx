import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ink' | 'jewel' | 'ghost' | 'danger' | 'glow'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'ink', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'relative inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--jewel)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:scale-[0.98] select-none'

    const variants: Record<string, string> = {
      ink: 'bg-[var(--fg)] text-[var(--bg)] hover:-translate-y-px shadow-[var(--shadow-page)] hover:shadow-[var(--shadow-card)]',
      jewel: 'bg-[var(--jewel)] text-white hover:bg-[var(--jewel-hover)] hover:-translate-y-px shadow-[var(--shadow-page)] hover:shadow-[var(--shadow-card)]',
      glow: 'bg-[var(--jewel)] text-white shadow-[0_0_24px_var(--jewel-glow)] hover:shadow-[0_0_40px_var(--jewel-glow)] hover:bg-[var(--jewel-hover)]',
      ghost: 'bg-transparent border border-[var(--rule)] text-[var(--fg-soft)] hover:bg-[var(--bg-soft)] hover:border-[var(--rule-strong)] hover:text-[var(--fg)]',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    }

    const sizes = {
      sm: 'h-8 px-3 text-[13px]',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-6 text-[15px]',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
