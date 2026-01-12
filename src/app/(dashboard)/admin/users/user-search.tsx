/**
 * User Search Component
 * 
 * Client-side search and filter for users.
 */

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface UserSearchProps {
    initialSearch: string
    initialRole: string
}

const ROLES = [
    { value: 'all', label: 'All Roles' },
    { value: 'volunteer', label: 'Volunteers' },
    { value: 'organization', label: 'Organizations' },
    { value: 'admin', label: 'Admins' },
]

export function UserSearch({ initialSearch, initialRole }: UserSearchProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [search, setSearch] = useState(initialSearch)
    const [role, setRole] = useState(initialRole)

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        updateFilters(search, role)
    }

    function updateFilters(newSearch: string, newRole: string) {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())

            if (newSearch) {
                params.set('search', newSearch)
            } else {
                params.delete('search')
            }

            if (newRole && newRole !== 'all') {
                params.set('role', newRole)
            } else {
                params.delete('role')
            }

            router.push(`/admin/users?${params.toString()}`)
        })
    }

    function handleRoleChange(newRole: string) {
        setRole(newRole)
        updateFilters(search, newRole)
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] bg-white border border-[hsl(var(--border-default))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:border-[hsl(var(--color-primary-500))] focus:ring-2 focus:ring-[hsl(var(--color-primary-500)/0.15)] transition-all"
                    />
                </div>
                <Button type="submit" isLoading={isPending}>
                    Search
                </Button>
            </form>

            {/* Role Filter Pills */}
            <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                    <button
                        key={r.value}
                        onClick={() => handleRoleChange(r.value)}
                        className={cn(
                            'px-4 py-2 rounded-full text-sm font-medium transition-all',
                            role === r.value
                                ? 'bg-[hsl(var(--color-primary-600))] text-white'
                                : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--color-primary-100))]'
                        )}
                    >
                        {r.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
