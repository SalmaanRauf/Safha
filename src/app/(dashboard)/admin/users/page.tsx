/**
 * Admin Users Page
 * 
 * View and manage all platform users.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Users, Search } from 'lucide-react'
import { UserSearch } from './user-search'

export const metadata = {
    title: 'User Management | Safha Admin',
}

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: { search?: string; role?: string }
}) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    // Check if user is admin (read from profiles table)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as { data: { role: string } | null }

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    // Build query
    let query = supabase
        .from('profiles')
        .select('id, email, full_name, role, phone, created_at')
        .order('created_at', { ascending: false })

    // Apply filters
    if (searchParams.search) {
        query = query.or(`email.ilike.%${searchParams.search}%,full_name.ilike.%${searchParams.search}%`)
    }
    if (searchParams.role && searchParams.role !== 'all') {
        query = query.eq('role', searchParams.role)
    }

    const { data: users, error: usersError } = await query.limit(50) as {
        data: Array<{
            id: string
            email: string | null
            full_name: string | null
            role: string
            phone: string | null
            created_at: string
        }> | null
        error: Error | null
    }

    // Get role counts
    const { count: volunteerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'volunteer')

    const { count: orgCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'organization')

    const { count: adminCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin')

    const roleCounts = {
        volunteer: volunteerCount || 0,
        organization: orgCount || 0,
        admin: adminCount || 0,
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))]">
                        User Management
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] mt-1">
                        View and manage all platform users
                    </p>
                </div>
            </div>

            {/* Role Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-[hsl(var(--color-primary-600))]">
                            {roleCounts.volunteer}
                        </p>
                        <p className="text-xs text-[hsl(var(--text-muted))] uppercase">Volunteers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-[hsl(var(--color-accent-600))]">
                            {roleCounts.organization}
                        </p>
                        <p className="text-xs text-[hsl(var(--text-muted))] uppercase">Organizations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
                            {roleCounts.admin}
                        </p>
                        <p className="text-xs text-[hsl(var(--text-muted))] uppercase">Admins</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <UserSearch
                initialSearch={searchParams.search || ''}
                initialRole={searchParams.role || 'all'}
            />

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Users ({users?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!users || users.length === 0 ? (
                        <div className="text-center py-8">
                            <Search className="w-12 h-12 mx-auto text-[hsl(var(--text-muted))] opacity-50" />
                            <p className="mt-4 text-[hsl(var(--text-secondary))]">
                                No users found
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[hsl(var(--border-subtle))]">
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[hsl(var(--text-muted))] uppercase">
                                            User
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[hsl(var(--text-muted))] uppercase">
                                            Role
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[hsl(var(--text-muted))] uppercase hidden sm:table-cell">
                                            Phone
                                        </th>
                                        <th className="text-left py-3 px-4 text-xs font-medium text-[hsl(var(--text-muted))] uppercase hidden md:table-cell">
                                            Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((profile) => (
                                        <tr
                                            key={profile.id}
                                            className="border-b border-[hsl(var(--border-subtle))] last:border-0 hover:bg-[hsl(var(--bg-secondary))]"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[hsl(var(--color-primary-100))] flex items-center justify-center text-xs font-medium text-[hsl(var(--color-primary-700))]">
                                                        {(profile.full_name || profile.email || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-[hsl(var(--text-primary))]">
                                                            {profile.full_name || 'No name'}
                                                        </p>
                                                        <p className="text-xs text-[hsl(var(--text-muted))]">
                                                            {profile.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge
                                                    variant={
                                                        profile.role === 'admin'
                                                            ? 'error'
                                                            : profile.role === 'organization'
                                                                ? 'info'
                                                                : 'success'
                                                    }
                                                >
                                                    {profile.role}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-[hsl(var(--text-secondary))] hidden sm:table-cell">
                                                {profile.phone || '-'}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-[hsl(var(--text-muted))] hidden md:table-cell">
                                                {new Date(profile.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
