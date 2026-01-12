/**
 * Admin Dashboard Page
 * 
 * Overview of platform stats and recent activity for administrators.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Users, Building2, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Admin Dashboard | Safha',
}

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    // Check if user is admin
    const role = user.user_metadata?.role
    if (role !== 'admin') {
        redirect('/dashboard')
    }

    // Fetch platform stats
    const [
        { count: totalUsers },
        { count: totalOrgs },
        { count: verifiedOrgs },
        { count: totalOpportunities },
        { count: activeOpportunities },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('organizations').select('*', { count: 'exact', head: true }),
        supabase.from('organizations').select('*', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('opportunities').select('*', { count: 'exact', head: true }),
        supabase.from('opportunities').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    ])

    // Fetch recent organizations (for pending verification)
    const { data: recentOrgs } = await supabase
        .from('organizations')
        .select('id, name, slug, is_verified, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    // Fetch recent users
    const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

    const pendingOrgs = recentOrgs?.filter(org => !org.is_verified) || []

    const stats = [
        { label: 'Total Users', value: totalUsers || 0, icon: Users, color: 'primary' },
        { label: 'Organizations', value: totalOrgs || 0, icon: Building2, color: 'accent' },
        { label: 'Verified Orgs', value: verifiedOrgs || 0, icon: CheckCircle, color: 'success' },
        { label: 'Active Opportunities', value: activeOpportunities || 0, icon: Calendar, color: 'info' },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))]">
                    Admin Dashboard
                </h1>
                <p className="text-[hsl(var(--text-secondary))] mt-1">
                    Platform overview and management
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="relative overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-[hsl(var(--text-muted))] uppercase tracking-wider">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-semibold text-[hsl(var(--text-primary))] mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <stat.icon className="w-8 h-8 text-[hsl(var(--color-primary-400))] opacity-60" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Verifications */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-[hsl(var(--color-warning))]" />
                                Pending Verifications
                            </CardTitle>
                            <Link
                                href="/admin/organizations"
                                className="text-sm text-[hsl(var(--color-primary-600))] hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {pendingOrgs.length === 0 ? (
                            <p className="text-sm text-[hsl(var(--text-muted))] py-4 text-center">
                                No pending verifications
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {pendingOrgs.map((org) => (
                                    <div
                                        key={org.id}
                                        className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))]"
                                    >
                                        <div>
                                            <p className="font-medium text-[hsl(var(--text-primary))]">
                                                {org.name}
                                            </p>
                                            <p className="text-xs text-[hsl(var(--text-muted))]">
                                                {new Date(org.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/admin/organizations?verify=${org.id}`}
                                            className="text-sm px-3 py-1.5 rounded-[var(--radius-md)] bg-[hsl(var(--color-primary-600))] text-white hover:bg-[hsl(var(--color-primary-700))] transition-colors"
                                        >
                                            Review
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-[hsl(var(--color-primary-500))]" />
                                Recent Users
                            </CardTitle>
                            <Link
                                href="/admin/users"
                                className="text-sm text-[hsl(var(--color-primary-600))] hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!recentUsers || recentUsers.length === 0 ? (
                            <p className="text-sm text-[hsl(var(--text-muted))] py-4 text-center">
                                No users yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {recentUsers.map((profile) => (
                                    <div
                                        key={profile.id}
                                        className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[hsl(var(--color-primary-100))] flex items-center justify-center text-xs font-medium text-[hsl(var(--color-primary-700))]">
                                                {(profile.full_name || profile.email || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-[hsl(var(--text-primary))]">
                                                    {profile.full_name || profile.email}
                                                </p>
                                                <p className="text-xs text-[hsl(var(--text-muted))] capitalize">
                                                    {profile.role}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-[hsl(var(--text-muted))]">
                                            {new Date(profile.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Link
                            href="/admin/users"
                            className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))] hover:bg-[hsl(var(--color-primary-50))] transition-colors group"
                        >
                            <Users className="w-6 h-6 text-[hsl(var(--color-primary-600))]" />
                            <div>
                                <p className="font-medium text-[hsl(var(--text-primary))] group-hover:text-[hsl(var(--color-primary-700))]">
                                    Manage Users
                                </p>
                                <p className="text-xs text-[hsl(var(--text-muted))]">
                                    View and manage all users
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/organizations"
                            className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))] hover:bg-[hsl(var(--color-primary-50))] transition-colors group"
                        >
                            <Building2 className="w-6 h-6 text-[hsl(var(--color-primary-600))]" />
                            <div>
                                <p className="font-medium text-[hsl(var(--text-primary))] group-hover:text-[hsl(var(--color-primary-700))]">
                                    Organizations
                                </p>
                                <p className="text-xs text-[hsl(var(--text-muted))]">
                                    Verify and manage orgs
                                </p>
                            </div>
                        </Link>
                        <Link
                            href="/admin/analytics"
                            className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))] hover:bg-[hsl(var(--color-primary-50))] transition-colors group"
                        >
                            <Clock className="w-6 h-6 text-[hsl(var(--color-primary-600))]" />
                            <div>
                                <p className="font-medium text-[hsl(var(--text-primary))] group-hover:text-[hsl(var(--color-primary-700))]">
                                    Analytics
                                </p>
                                <p className="text-xs text-[hsl(var(--text-muted))]">
                                    Platform insights
                                </p>
                            </div>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
