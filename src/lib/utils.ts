/**
 * Utility Functions
 * 
 * Common helper functions used throughout the application.
 */

import { clsx, type ClassValue } from 'clsx'

/**
 * Combines class names using clsx for conditional classes.
 * This is a simpler alternative to tailwind-merge for our use case.
 * 
 * @example
 * cn('base-class', condition && 'conditional-class', { 'object-class': true })
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

/**
 * Formats a date relative to now (e.g., "2 days ago", "in 3 hours").
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date()
    const target = new Date(date)
    const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000)
    const absDiff = Math.abs(diffInSeconds)

    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
    ]

    for (const interval of intervals) {
        const count = Math.floor(absDiff / interval.seconds)
        if (count >= 1) {
            const label = count === 1 ? interval.label : `${interval.label}s`
            return diffInSeconds < 0
                ? `${count} ${label} ago`
                : `in ${count} ${label}`
        }
    }

    return 'just now'
}

/**
 * Formats a number with K/M suffixes for large values.
 */
export function formatCompactNumber(num: number): string {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`
    }
    return num.toString()
}

/**
 * Formats hours into a readable string (e.g., "12.5 hours" or "45 mins").
 */
export function formatHours(hours: number): string {
    if (hours < 1) {
        const mins = Math.round(hours * 60)
        return `${mins} min${mins !== 1 ? 's' : ''}`
    }
    return `${hours.toFixed(1).replace(/\.0$/, '')} hour${hours !== 1 ? 's' : ''}`
}

/**
 * Truncates text to a specified length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength - 3)}...`
}

/**
 * Generates initials from a name (e.g., "John Doe" -> "JD").
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

/**
 * Delays execution for a specified number of milliseconds.
 * Useful for testing loading states or rate limiting.
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
