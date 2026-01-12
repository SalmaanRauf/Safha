/**
 * Opportunity Detail Page (Org View)
 * 
 * Detailed view of an opportunity with volunteer management.
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui'
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    Pencil,
    Clock,
    CheckCircle,
    XCircle,
    Mail
} from 'lucide-react'

interface PageProps {
    params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('opportunities')
        .select('title')
        .eq('id', params.id)
        .single() as { data: { title: string } | null }

    return {
        title: `Manage: ${data?.title || 'Opportunity'}`,
    }
}

export default async function OrgOpportunityDetailPage({ params }: PageProps) {
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
        .single() as { data: { organization_id: string } | null }

    if (!membership?.organization_id) {
        redirect('/org/setup')
    }

    // Fetch opportunity
    const { data: oppData, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('id', params.id)
        .eq('organization_id', membership.organization_id)
        .single()

    if (error || !oppData) {
        notFound()
    }

    const opportunity = oppData as {
        id: string
        title: string
        description: string
        category: string
        location_type: string
        city: string | null
        start_date: string
        end_date: string | null
        max_volunteers: number | null
        current_volunteers: number
        status: string
    }

    // Fetch registrations
    const { data: regsData } = await supabase
        .from('registrations')
        .select(`
      id,
      status,
      hours_logged,
      checked_in_at,
      created_at,
      profiles (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
        .eq('opportunity_id', params.id)
        .order('created_at', { ascending: true })

    type Registration = {
        id: string
        status: string
        hours_logged: number
        checked_in_at: string | null
        created_at: string
        profiles: {
            id: string
            full_name: string | null
            email: string
            avatar_url: string | null
        }
    }

    const registrations = (regsData || []) as Registration[]

    const startDate = new Date(opportunity.start_date)
    const endDate = opportunity.end_date ? new Date(opportunity.end_date) : null
    const spotsLeft = opportunity.max_volunteers
        ? opportunity.max_volunteers - opportunity.current_volunteers
        : null

    // Group registrations by status
    const confirmed = registrations.filter(r => r.status === 'confirmed')
    const pending = registrations.filter(r => r.status === 'pending')
    const waitlisted = registrations.filter(r => r.status === 'waitlisted')

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Back link */}
            <Link
                href="/org/opportunities"
                className="inline-flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to opportunities
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={opportunity.status === 'published' ? 'success' : 'warning'}>
                            {opportunity.status}
                        </Badge>
                        <Badge>{opportunity.category}</Badge>
                    </div>
                    <h1 className="text-display text-2xl sm:text-3xl">
                        {opportunity.title}
                    </h1>
                </div>
                <Link href={`/org/opportunities/${opportunity.id}/edit`}>
                    <Button variant="secondary">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </Button>
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-4 text-center">
                                <p className="text-display text-2xl">{registrations.length}</p>
                                <p className="text-xs text-[hsl(var(--text-muted))]">Total Signups</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 text-center">
                                <p className="text-display text-2xl">{confirmed.length}</p>
                                <p className="text-xs text-[hsl(var(--text-muted))]">Confirmed</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-4 text-center">
                                <p className="text-display text-2xl">{spotsLeft ?? '∞'}</p>
                                <p className="text-xs text-[hsl(var(--text-muted))]">Spots Left</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Volunteers list */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Volunteers ({registrations.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {registrations.length === 0 ? (
                                <p className="text-center py-8 text-[hsl(var(--text-muted))]">
                                    No volunteers have signed up yet.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {pending.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-[hsl(var(--text-muted))] mb-2">
                                                Pending Approval ({pending.length})
                                            </h4>
                                            {pending.map((reg) => (
                                                <VolunteerRow key={reg.id} registration={reg} showActions />
                                            ))}
                                        </div>
                                    )}

                                    {confirmed.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-[hsl(var(--text-muted))] mb-2">
                                                Confirmed ({confirmed.length})
                                            </h4>
                                            {confirmed.map((reg) => (
                                                <VolunteerRow key={reg.id} registration={reg} />
                                            ))}
                                        </div>
                                    )}

                                    {waitlisted.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-[hsl(var(--text-muted))] mb-2">
                                                Waitlisted ({waitlisted.length})
                                            </h4>
                                            {waitlisted.map((reg) => (
                                                <VolunteerRow key={reg.id} registration={reg} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right column - Info */}
                <div className="space-y-4">
                    <Card>
                        <CardContent className="pt-4 space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-[hsl(var(--color-primary-600))] mt-0.5" />
                                <div>
                                    <p className="font-medium">
                                        {startDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-[hsl(var(--text-secondary))]">
                                        {startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                        {endDate && ` - ${endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[hsl(var(--color-primary-600))] mt-0.5" />
                                <div>
                                    <p className="font-medium capitalize">{opportunity.location_type}</p>
                                    {opportunity.city && (
                                        <p className="text-sm text-[hsl(var(--text-secondary))]">{opportunity.city}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-[hsl(var(--color-primary-600))] mt-0.5" />
                                <div>
                                    <p className="font-medium">
                                        {opportunity.current_volunteers} / {opportunity.max_volunteers ?? '∞'} volunteers
                                    </p>
                                    <p className="text-sm text-[hsl(var(--text-secondary))]">
                                        {spotsLeft === 0 ? 'Full' : spotsLeft ? `${spotsLeft} spots remaining` : 'Unlimited spots'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function VolunteerRow({
    registration,
    showActions = false
}: {
    registration: {
        id: string
        status: string
        profiles: {
            full_name: string | null
            email: string
        }
    }
    showActions?: boolean
}) {
    return (
        <div className="flex items-center justify-between p-3 rounded-[var(--radius-md)] bg-[hsl(var(--bg-secondary))]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--color-primary-100))] flex items-center justify-center text-sm font-medium text-[hsl(var(--color-primary-700))]">
                    {registration.profiles.full_name?.[0] || registration.profiles.email[0].toUpperCase()}
                </div>
                <div>
                    <p className="font-medium">{registration.profiles.full_name || 'Unknown'}</p>
                    <p className="text-sm text-[hsl(var(--text-muted))]">{registration.profiles.email}</p>
                </div>
            </div>
            {showActions && (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="text-[hsl(var(--color-success))]">
                        <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[hsl(var(--color-error))]">
                        <XCircle className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
