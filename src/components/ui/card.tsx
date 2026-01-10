/**
 * Card Component
 * 
 * A versatile card container with optional header and footer.
 * Uses subtle shadows and borders for depth without being heavy.
 */

import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    hover?: boolean
}

function Card({ className, children, hover = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'bg-[hsl(var(--bg-elevated))] rounded-[var(--radius-lg)]',
                'border border-[hsl(var(--border-subtle))]',
                'shadow-[var(--shadow-sm)]',
                hover && 'transition-all duration-[var(--transition-base)] hover:shadow-[var(--shadow-md)] hover:border-[hsl(var(--border-default))]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'px-5 py-4 border-b border-[hsl(var(--border-subtle))]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn('text-heading text-lg', className)}
            {...props}
        >
            {children}
        </h3>
    )
}

function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn('text-sm text-[hsl(var(--text-secondary))] mt-0.5', className)}
            {...props}
        >
            {children}
        </p>
    )
}

function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('px-5 py-4', className)} {...props}>
            {children}
        </div>
    )
}

function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'px-5 py-4 border-t border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-secondary)/0.5)]',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
