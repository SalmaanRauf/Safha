/**
 * Admin Analytics Page
 * 
 * Platform analytics and insights.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { BarChart3, Users, Building2, Calendar, TrendingUp, Activity } from 'lucide-react'

export const metadata = {
    title: 'Analytics | Safha Admin',
}

export default async function AdminAnalyticsPage() {
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

    // Fetch various stats
    const [
        { count: totalUsers },
        { count: totalOrgs },
        { count: verifiedOrgs },
        { count: totalOpportunities },
        { count: publishedOpportunities },
        { count: totalRegistrations },
        { count: confirmedRegistrations },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('organizations').select('*', { count: 'exact', head: true }),
        supabase.from('organizations').select('*', { count: 'exact', head: true }).eq('is_verified', true),
        supabase.from('opportunities').select('*', { count: 'exact', head: true }),
        supabase.from('opportunities').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
    ])

    // Get users by role
    const { count: volunteerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'volunteer')

    const { count: orgMemberCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'organization')

    // Calculate rates
    const orgVerificationRate = totalOrgs ? Math.round((verifiedOrgs || 0) / totalOrgs * 100) : 0
    const opportunityPublishRate = totalOpportunities ? Math.round((publishedOpportunities || 0) / totalOpportunities * 100) : 0
    const registrationConfirmRate = totalRegistrations ? Math.round((confirmedRegistrations || 0) / totalRegistrations * 100) : 0

    const stats = [
        {
            label: 'Total Users',
            value: totalUsers || 0,
            icon: Users,
            subStats: [
                { label: 'Volunteers', value: volunteerCount || 0 },
                { label: 'Org Members', value: orgMemberCount || 0 },
            ]
        },
        {
            label: 'Organizations',
            value: totalOrgs || 0,
            icon: Building2,
            subStats: [
                { label: 'Verified', value: verifiedOrgs || 0 },
                { label: 'Verification Rate', value: `${orgVerificationRate}%` },
            ]
        },
        {
            label: 'Opportunities',
            value: totalOpportunities || 0,
            icon: Calendar,
            subStats: [
                { label: 'Published', value: publishedOpportunities || 0 },
                { label: 'Publish Rate', value: `${opportunityPublishRate}%` },
            ]
        },
        {
            label: 'Registrations',
            value: totalRegistrations || 0,
            icon: Activity,
            subStats: [
                { label: 'Confirmed', value: confirmedRegistrations || 0 },
                { label: 'Confirm Rate', value: `${registrationConfirmRate}%` },
            ]
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))]">
                    Platform Analytics
                </h1>
                <p className="text-[hsl(var(--text-secondary))] mt-1">
                    Insights and metrics for the Safha platform
                </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <stat.icon className="w-8 h-8 text-[hsl(var(--color-primary-500))]" />
                                <TrendingUp className="w-5 h-5 text-[hsl(var(--color-success))]" />
                            </div>
                            <p className="text-3xl font-semibold text-[hsl(var(--text-primary))]">
                                {stat.value}
                            </p>
                            <p className="text-sm text-[hsl(var(--text-muted))] mt-1">
                                {stat.label}
                            </p>
                            {stat.subStats && (
                                <div className="mt-4 pt-4 border-t border-[hsl(var(--border-subtle))] space-y-2">
                                    {stat.subStats.map((sub) => (
                                        <div key={sub.label} className="flex justify-between text-sm">
                                            <span className="text-[hsl(var(--text-muted))]">{sub.label}</span>
                                            <span className="font-medium text-[hsl(var(--text-primary))]">{sub.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Summary Cards */}
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[hsl(var(--color-primary-500))]" />
                            Platform Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[hsl(var(--text-secondary))]">Organization Verification</span>
                                    <span className="font-medium">{orgVerificationRate}%</span>
                                </div>
                                <div className="h-2 bg-[hsl(var(--bg-secondary))] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[hsl(var(--color-success))] rounded-full transition-all"
                                        style={{ width: `${orgVerificationRate}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[hsl(var(--text-secondary))]">Opportunity Publish Rate</span>
                                    <span className="font-medium">{opportunityPublishRate}%</span>
                                </div>
                                <div className="h-2 bg-[hsl(var(--bg-secondary))] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[hsl(var(--color-primary-500))] rounded-full transition-all"
                                        style={{ width: `${opportunityPublishRate}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-[hsl(var(--text-secondary))]">Registration Confirmation</span>
                                    <span className="font-medium">{registrationConfirmRate}%</span>
                                </div>
                                <div className="h-2 bg-[hsl(var(--bg-secondary))] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[hsl(var(--color-accent-500))] rounded-full transition-all"
                                        style={{ width: `${registrationConfirmRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[hsl(var(--color-primary-500))]" />
                            Quick Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))]">
                                <p className="text-2xl font-semibold text-[hsl(var(--color-primary-600))]">
                                    {volunteerCount || 0}
                                </p>
                                <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Active Volunteers</p>
                            </div>
                            <div className="p-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))]">
                                <p className="text-2xl font-semibold text-[hsl(var(--color-accent-600))]">
                                    {verifiedOrgs || 0}
                                </p>
                                <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Verified Orgs</p>
                            </div>
                            <div className="p-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))]">
                                <p className="text-2xl font-semibold text-[hsl(var(--color-success))]">
                                    {publishedOpportunities || 0}
                                </p>
                                <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Live Opportunities</p>
                            </div>
                            <div className="p-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))]">
                                <p className="text-2xl font-semibold text-[hsl(var(--text-primary))]">
                                    {confirmedRegistrations || 0}
                                </p>
                                <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Confirmed Signups</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
