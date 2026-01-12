/**
 * Admin Organizations Page
 * 
 * View and manage organizations, including verification.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Building2, CheckCircle, Clock, Search } from 'lucide-react'
import { OrgVerifyButton } from './org-verify-button'

export const metadata = {
    title: 'Organization Management | Safha Admin',
}

export default async function AdminOrganizationsPage({
    searchParams,
}: {
    searchParams: { filter?: string; search?: string }
}) {
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

    // Build query
    let query = supabase
        .from('organizations')
        .select('id, name, slug, description, contact_email, city, is_verified, created_at')
        .order('created_at', { ascending: false })

    // Apply filters
    if (searchParams.filter === 'verified') {
        query = query.eq('is_verified', true)
    } else if (searchParams.filter === 'pending') {
        query = query.eq('is_verified', false)
    }

    if (searchParams.search) {
        query = query.ilike('name', `%${searchParams.search}%`)
    }

    const { data: organizations } = await query.limit(50)

    // Get counts
    const { count: totalCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true })

    const { count: verifiedCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true)

    const { count: pendingCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false)

    const counts = {
        total: totalCount || 0,
        verified: verifiedCount || 0,
        pending: pendingCount || 0,
    }

    const currentFilter = searchParams.filter || 'all'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))]">
                    Organization Management
                </h1>
                <p className="text-[hsl(var(--text-secondary))] mt-1">
                    View and verify organizations
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
                            {counts.total}
                        </p>
                        <p className="text-xs text-[hsl(var(--text-muted))] uppercase">Total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-[hsl(var(--color-success))]">
                            {counts.verified}
                        </p>
                        <p className="text-xs text-[hsl(var(--text-muted))] uppercase">Verified</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-semibold text-[hsl(var(--color-warning))]">
                            {counts.pending}
                        </p>
                        <p className="text-xs text-[hsl(var(--text-muted))] uppercase">Pending</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-[hsl(var(--border-subtle))] pb-2">
                {[
                    { value: 'all', label: 'All', count: counts.total },
                    { value: 'pending', label: 'Pending', count: counts.pending },
                    { value: 'verified', label: 'Verified', count: counts.verified },
                ].map((tab) => (
                    <a
                        key={tab.value}
                        href={`/admin/organizations${tab.value !== 'all' ? `?filter=${tab.value}` : ''}`}
                        className={`px-4 py-2 text-sm font-medium rounded-t-[var(--radius-md)] transition-colors ${currentFilter === tab.value
                                ? 'bg-[hsl(var(--color-primary-50))] text-[hsl(var(--color-primary-700))] border-b-2 border-[hsl(var(--color-primary-600))]'
                                : 'text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </a>
                ))}
            </div>

            {/* Organizations List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Organizations ({organizations?.length || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!organizations || organizations.length === 0 ? (
                        <div className="text-center py-8">
                            <Building2 className="w-12 h-12 mx-auto text-[hsl(var(--text-muted))] opacity-50" />
                            <p className="mt-4 text-[hsl(var(--text-secondary))]">
                                No organizations found
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {organizations.map((org) => (
                                <div
                                    key={org.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))] border border-[hsl(var(--border-subtle))]"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-[hsl(var(--text-primary))]">
                                                {org.name}
                                            </h3>
                                            {org.is_verified ? (
                                                <Badge variant="success" size="sm">
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            ) : (
                                                <Badge variant="warning" size="sm">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Pending
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">
                                            {org.description?.slice(0, 100) || 'No description'}
                                            {org.description && org.description.length > 100 ? '...' : ''}
                                        </p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[hsl(var(--text-muted))]">
                                            <span>{org.contact_email}</span>
                                            {org.city && <span>• {org.city}</span>}
                                            <span>• Joined {new Date(org.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!org.is_verified && (
                                            <OrgVerifyButton orgId={org.id} orgName={org.name} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
