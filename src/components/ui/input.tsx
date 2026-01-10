/**
 * Input Component
 * 
 * A refined text input with label, error states, and focus animations.
 */

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, type = 'text', id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[hsl(var(--text-primary))]"
                    >
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    type={type}
                    id={inputId}
                    className={cn(
                        'w-full px-3.5 py-2.5 rounded-[var(--radius-md)]',
                        'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))]',
                        'border border-[hsl(var(--border-default))]',
                        'placeholder:text-[hsl(var(--text-muted))]',
                        'transition-all duration-[var(--transition-fast)]',
                        'focus:outline-none focus:border-[hsl(var(--color-primary-500))] focus:ring-2 focus:ring-[hsl(var(--color-primary-500)/0.15)]',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-[hsl(var(--color-error))] focus:border-[hsl(var(--color-error))] focus:ring-[hsl(var(--color-error)/0.15)]',
                        className
                    )}
                    {...props}
                />

                {hint && !error && (
                    <p className="text-sm text-[hsl(var(--text-muted))]">{hint}</p>
                )}

                {error && (
                    <p className="text-sm text-[hsl(var(--color-error))]">{error}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
