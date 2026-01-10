/**
 * Badge Component
 * 
 * Small labels for status indicators, tags, and categories.
 */

import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
    size?: 'sm' | 'md'
}

function Badge({
    className,
    variant = 'default',
    size = 'sm',
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                {
                    'px-2 py-0.5 text-xs': size === 'sm',
                    'px-2.5 py-1 text-sm': size === 'md',
                },
                {
                    'bg-[hsl(var(--color-stone-100))] text-[hsl(var(--color-stone-700))]':
                        variant === 'default',
                    'bg-[hsl(var(--color-success)/0.15)] text-[hsl(var(--color-success))]':
                        variant === 'success',
                    'bg-[hsl(var(--color-warning)/0.15)] text-[hsl(32,95%,40%)]':
                        variant === 'warning',
                    'bg-[hsl(var(--color-error)/0.15)] text-[hsl(var(--color-error))]':
                        variant === 'error',
                    'bg-[hsl(var(--color-primary-100))] text-[hsl(var(--color-primary-700))]':
                        variant === 'info',
                },
                className
            )}
            {...props}
        />
    )
}

export { Badge }
