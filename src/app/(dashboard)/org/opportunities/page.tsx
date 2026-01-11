/**
 * Organization Opportunities List Page
 * 
 * Lists all opportunities for an organization with management options.
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { Plus, Calendar, Users, MoreVertical, Pencil, Eye, Trash2 } from 'lucide-react'

export const metadata = {
    title: 'Manage Opportunities',
    description: 'View and manage your volunteer opportunities',
}

export default async function OrgOpportunitiesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's organization
    const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    if (!membership?.organization_id) {
        redirect('/org/setup')
    }

    // Fetch opportunities
    const { data: oppsData } = await supabase
        .from('opportunities')
        .select('*')
        .eq('organization_id', membership.organization_id)
        .order('start_date', { ascending: false })

    const opportunities = (oppsData || []) as {
        id: string
        title: string
        status: string
        start_date: string
        end_date: string | null
        location_type: string
        city: string | null
        max_volunteers: number | null
        current_volunteers: number
        category: string
    }[]

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-display text-2xl sm:text-3xl">
                        Your Opportunities
                    </h1>
                    <p className="text-[hsl(var(--text-secondary))] mt-1">
                        Create and manage volunteer opportunities
                    </p>
                </div>
                <Link href="/org/opportunities/new">
                    <Button>
                        <Plus className="w-4 h-4" />
                        New Opportunity
                    </Button>
                </Link>
            </div>

            {/* Opportunities Grid */}
            {opportunities.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--bg-secondary))] flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-[hsl(var(--text-muted))]" />
                        </div>
                        <h3 className="text-heading text-lg mb-2">No opportunities yet</h3>
                        <p className="text-[hsl(var(--text-secondary))] max-w-md mx-auto mb-6">
                            Create your first volunteer opportunity to start connecting with passionate volunteers.
                        </p>
                        <Link href="/org/opportunities/new">
                            <Button>
                                <Plus className="w-4 h-4" />
                                Create Opportunity
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {opportunities.map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                </div>
            )}
        </div>
    )
}

function OpportunityCard({ opportunity }: {
    opportunity: {
        id: string
        title: string
        status: string
        start_date: string
        end_date: string | null
        location_type: string
        city: string | null
        max_volunteers: number | null
        current_volunteers: number
        category: string
    }
}) {
    const startDate = new Date(opportunity.start_date)
    const isPast = startDate < new Date()
    const spotsLeft = opportunity.max_volunteers
        ? opportunity.max_volunteers - opportunity.current_volunteers
        : null

    return (
        <Card hover className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Date Badge */}
                <div className="shrink-0 w-16 h-16 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary-50))] flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-[hsl(var(--color-primary-600))] uppercase">
                        {startDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold text-[hsl(var(--color-primary-700))]">
                        {startDate.getDate()}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                            <h3 className="font-medium text-lg">{opportunity.title}</h3>
                            <p className="text-sm text-[hsl(var(--text-muted))]">
                                {opportunity.category} • {opportunity.location_type === 'in-person' && opportunity.city ? opportunity.city : opportunity.location_type}
                            </p>
                        </div>
                        <Badge
                            variant={
                                isPast ? 'default' :
                                    opportunity.status === 'published' ? 'success' :
                                        opportunity.status === 'draft' ? 'warning' : 'default'
                            }
                        >
                            {isPast ? 'Completed' : opportunity.status}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-[hsl(var(--text-secondary))]">
                        <span className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {opportunity.current_volunteers} signed up
                            {spotsLeft !== null && ` (${spotsLeft} spots left)`}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {startDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                hour: 'numeric',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/opportunities/${opportunity.id}`}>
                        <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-1">View</span>
                        </Button>
                    </Link>
                    <Link href={`/org/opportunities/${opportunity.id}/edit`}>
                        <Button variant="ghost" size="sm">
                            <Pencil className="w-4 h-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    )
}
