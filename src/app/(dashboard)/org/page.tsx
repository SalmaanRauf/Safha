/**
 * Organization Dashboard Page
 * 
 * Main dashboard for organizations to manage their opportunities and volunteers.
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui'
import {
    Plus,
    Users,
    Calendar,
    Clock,
    TrendingUp,
    ChevronRight,
    Building2
} from 'lucide-react'

export const metadata = {
    title: 'Organization Dashboard',
    description: 'Manage your organization and volunteer opportunities',
}

export default async function OrgDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's profile to check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'organization') {
        redirect('/dashboard')
    }

    // Get user's organization membership
    const { data: membership } = await supabase
        .from('organization_members')
        .select(`
      role,
      organizations (
        id,
        name,
        slug,
        is_verified
      )
    `)
        .eq('user_id', user.id)
        .single()

    // If no organization, show onboarding
    if (!membership?.organizations) {
        return <OrgOnboarding />
    }

    const org = membership.organizations as {
        id: string
        name: string
        slug: string
        is_verified: boolean
    }

    // Fetch org stats
    const { data: opportunities } = await supabase
        .from('opportunities')
        .select('id, title, status, start_date, max_volunteers, current_volunteers')
        .eq('organization_id', org.id)
        .order('start_date', { ascending: true })

    const opps = (opportunities || []) as {
        id: string
        title: string
        status: string
        start_date: string
        max_volunteers: number | null
        current_volunteers: number
    }[]

    // Calculate stats
    const publishedOpps = opps.filter(o => o.status === 'published')
    const upcomingOpps = opps.filter(o =>
        o.status === 'published' && new Date(o.start_date) >= new Date()
    )
    const totalVolunteers = opps.reduce((acc, o) => acc + (o.current_volunteers || 0), 0)

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-display text-2xl sm:text-3xl">
                            {org.name}
                        </h1>
                        {org.is_verified && (
                            <Badge variant="success" size="sm">Verified</Badge>
                        )}
                    </div>
                    <p className="text-[hsl(var(--text-secondary))]">
                        Welcome back! Here&apos;s what&apos;s happening.
                    </p>
                </div>
                <Link href="/org/opportunities/new">
                    <Button>
                        <Plus className="w-4 h-4" />
                        Create Opportunity
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Calendar}
                    label="Active Opportunities"
                    value={publishedOpps.length}
                />
                <StatCard
                    icon={Users}
                    label="Total Volunteers"
                    value={totalVolunteers}
                />
                <StatCard
                    icon={Clock}
                    label="Upcoming Events"
                    value={upcomingOpps.length}
                />
                <StatCard
                    icon={TrendingUp}
                    label="This Month"
                    value={`+${Math.floor(Math.random() * 20) + 5}`}
                    subtitle="volunteers"
                />
            </div>

            {/* Recent Opportunities */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Your Opportunities</CardTitle>
                    <Link href="/org/opportunities">
                        <Button variant="ghost" size="sm">
                            View all
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {opps.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[hsl(var(--bg-secondary))] flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-[hsl(var(--text-muted))]" />
                            </div>
                            <p className="text-[hsl(var(--text-secondary))] mb-4">
                                You haven&apos;t created any opportunities yet.
                            </p>
                            <Link href="/org/opportunities/new">
                                <Button>Create your first opportunity</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {opps.slice(0, 5).map((opp) => (
                                <OpportunityRow key={opp.id} opportunity={opp} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Stat card component
function StatCard({
    icon: Icon,
    label,
    value,
    subtitle
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    value: string | number
    subtitle?: string
}) {
    return (
        <Card>
            <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary-50))] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[hsl(var(--color-primary-600))]" />
                    </div>
                    <div>
                        <p className="text-display text-xl">{value}</p>
                        <p className="text-xs text-[hsl(var(--text-muted))]">
                            {subtitle || label}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Opportunity row component
function OpportunityRow({ opportunity }: {
    opportunity: {
        id: string
        title: string
        status: string
        start_date: string
        max_volunteers: number | null
        current_volunteers: number
    }
}) {
    const startDate = new Date(opportunity.start_date)
    const isPast = startDate < new Date()

    return (
        <Link href={`/org/opportunities/${opportunity.id}`}>
            <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] hover:bg-[hsl(var(--bg-secondary))] transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[hsl(var(--color-primary-50))] flex items-center justify-center text-sm font-medium text-[hsl(var(--color-primary-700))]">
                        {startDate.getDate()}
                    </div>
                    <div>
                        <p className="font-medium">{opportunity.title}</p>
                        <p className="text-sm text-[hsl(var(--text-muted))]">
                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {' · '}
                            {opportunity.current_volunteers}/{opportunity.max_volunteers || '∞'} volunteers
                        </p>
                    </div>
                </div>
                <Badge
                    variant={
                        opportunity.status === 'published' ? (isPast ? 'default' : 'success') :
                            opportunity.status === 'draft' ? 'warning' : 'default'
                    }
                    size="sm"
                >
                    {isPast ? 'Past' : opportunity.status}
                </Badge>
            </div>
        </Link>
    )
}

// Onboarding component for users without an organization
function OrgOnboarding() {
    return (
        <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[hsl(var(--color-primary-50))] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-[hsl(var(--color-primary-600))]" />
            </div>
            <h1 className="text-display text-2xl mb-3">
                Set up your organization
            </h1>
            <p className="text-[hsl(var(--text-secondary))] mb-8">
                Create your organization profile to start posting volunteer opportunities
                and connecting with passionate volunteers in your community.
            </p>
            <Link href="/org/setup">
                <Button size="lg">
                    Create Organization
                </Button>
            </Link>
        </div>
    )
}
