/**
 * Opportunity Filters Component
 * 
 * Client-side filter controls for the opportunity browser.
 * Uses URL search params for state (SEO-friendly, shareable).
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { Search, MapPin, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface OpportunityFiltersProps {
    categories: string[]
    currentCategory?: string
    currentLocation?: string
    currentSearch?: string
}

export function OpportunityFilters({
    categories,
    currentCategory,
    currentLocation,
    currentSearch,
}: OpportunityFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [searchValue, setSearchValue] = useState(currentSearch || '')

    // Helper to update URL params
    const updateParams = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        startTransition(() => {
            router.push(`/opportunities?${params.toString()}`)
        })
    }, [router, searchParams])

    // Handle search submit
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        updateParams('search', searchValue || null)
    }

    // Clear all filters
    const clearFilters = () => {
        setSearchValue('')
        startTransition(() => {
            router.push('/opportunities')
        })
    }

    const hasActiveFilters = currentCategory || currentLocation || currentSearch

    return (
        <div className="space-y-4">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--text-muted))]" />
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search opportunities..."
                    className={cn(
                        'w-full pl-11 pr-4 py-3 rounded-[var(--radius-lg)]',
                        'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))]',
                        'border border-[hsl(var(--border-default))]',
                        'placeholder:text-[hsl(var(--text-muted))]',
                        'focus:outline-none focus:border-[hsl(var(--color-primary-500))] focus:ring-2 focus:ring-[hsl(var(--color-primary-500)/0.15)]',
                        'transition-all'
                    )}
                />
                {searchValue && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchValue('')
                            updateParams('search', null)
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[hsl(var(--bg-secondary))]"
                    >
                        <X className="w-4 h-4 text-[hsl(var(--text-muted))]" />
                    </button>
                )}
            </form>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                    const isActive = category === (currentCategory || 'All')
                    return (
                        <button
                            key={category}
                            onClick={() => updateParams('category', category === 'All' ? null : category)}
                            disabled={isPending}
                            className={cn(
                                'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-[hsl(var(--color-primary-600))] text-white'
                                    : 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] border border-[hsl(var(--border-default))] hover:border-[hsl(var(--color-primary-300))] hover:text-[hsl(var(--text-primary))]'
                            )}
                        >
                            {category}
                        </button>
                    )
                })}
            </div>

            {/* Location filter */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-[hsl(var(--text-secondary))]">
                    <MapPin className="w-4 h-4" />
                    Type:
                </div>
                <div className="flex gap-2">
                    {['in-person', 'remote', 'hybrid'].map((type) => {
                        const isActive = currentLocation === type
                        return (
                            <button
                                key={type}
                                onClick={() => updateParams('location', isActive ? null : type)}
                                disabled={isPending}
                                className={cn(
                                    'px-3 py-1 rounded-[var(--radius-md)] text-sm capitalize transition-all',
                                    isActive
                                        ? 'bg-[hsl(var(--color-primary-100))] text-[hsl(var(--color-primary-700))] font-medium'
                                        : 'text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-secondary))]'
                                )}
                            >
                                {type}
                            </button>
                        )
                    })}
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="ml-auto text-[hsl(var(--text-muted))]"
                    >
                        Clear filters
                    </Button>
                )}
            </div>
        </div>
    )
}
