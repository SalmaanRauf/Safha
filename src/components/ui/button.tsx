/**
 * Button Component
 * 
 * A polished button with multiple variants and sizes.
 * Includes subtle hover/active states and focus rings.
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    // Base styles
                    'inline-flex items-center justify-center gap-2 font-medium',
                    'rounded-[var(--radius-md)] transition-all duration-[var(--transition-fast)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    'active:scale-[0.98]',

                    // Size variants
                    {
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2 text-sm': size === 'md',
                        'px-6 py-3 text-base': size === 'lg',
                    },

                    // Color variants
                    {
                        // Primary - solid brand color
                        'bg-[hsl(var(--color-primary-600))] text-white hover:bg-[hsl(var(--color-primary-700))] focus-visible:ring-[hsl(var(--color-primary-500))]':
                            variant === 'primary',

                        // Secondary - subtle background
                        'bg-[hsl(var(--color-stone-100))] text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--color-stone-200))] focus-visible:ring-[hsl(var(--color-stone-400))]':
                            variant === 'secondary',

                        // Ghost - no background until hover
                        'text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--color-stone-100))] focus-visible:ring-[hsl(var(--color-stone-400))]':
                            variant === 'ghost',

                        // Danger - destructive actions
                        'bg-[hsl(var(--color-error))] text-white hover:bg-[hsl(0,84%,55%)] focus-visible:ring-[hsl(var(--color-error))]':
                            variant === 'danger',
                    },

                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Loading...
                    </>
                ) : (
                    children
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
