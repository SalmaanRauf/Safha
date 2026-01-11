/**
 * My Schedule Page
 * 
 * Shows volunteer's registered events in a calendar/list view.
 */

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, Badge } from '@/components/ui'
import { Calendar, MapPin, Building2, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'My Schedule',
    description: 'View your upcoming volunteer events',
}

export default async function MySchedulePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null // Layout will redirect
    }

    // Fetch user's registrations with opportunity details
    const { data: regsData } = await supabase
        .from('registrations')
        .select(`
      *,
      opportunities (
        id,
        title,
        start_date,
        end_date,
        location_type,
        city,
        address,
        organizations (
          name
        )
      )
    `)
        .eq('user_id', user.id)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })

    // Type for registration with opportunity
    type RegistrationWithOpp = {
        id: string
        status: string
        hours_logged: number
        opportunities: {
            id: string
            title: string
            start_date: string
            end_date: string | null
            location_type: string
            city: string | null
            address: string | null
            organizations: { name: string }
        }
    }

    const registrations = (regsData || []) as RegistrationWithOpp[]

    // Separate into upcoming and past
    const now = new Date()
    const upcoming = registrations.filter(r =>
        new Date(r.opportunities.start_date) >= now
    )
    const past = registrations.filter(r =>
        new Date(r.opportunities.start_date) < now
    )

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))]">
                    My Schedule
                </h1>
                <p className="text-[hsl(var(--text-secondary))] mt-1">
                    Track your volunteer commitments
                </p>
            </div>

            {/* Upcoming events */}
            <section>
                <h2 className="text-heading text-lg mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[hsl(var(--color-primary-600))]" />
                    Upcoming ({upcoming.length})
                </h2>

                {upcoming.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <p className="text-[hsl(var(--text-secondary))]">
                                You don&apos;t have any upcoming events.
                            </p>
                            <Link
                                href="/opportunities"
                                className="text-[hsl(var(--color-primary-600))] hover:underline mt-2 inline-block"
                            >
                                Browse opportunities
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {upcoming.map((reg) => (
                            <EventCard key={reg.id} registration={reg} />
                        ))}
                    </div>
                )}
            </section>

            {/* Past events */}
            {past.length > 0 && (
                <section>
                    <h2 className="text-heading text-lg mb-4 text-[hsl(var(--text-secondary))]">
                        Past Events ({past.length})
                    </h2>
                    <div className="space-y-3 opacity-75">
                        {past.slice(0, 5).map((reg) => (
                            <EventCard key={reg.id} registration={reg} isPast />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

interface EventCardProps {
    registration: {
        id: string
        status: string
        hours_logged: number
        opportunities: {
            id: string
            title: string
            start_date: string
            end_date: string | null
            location_type: string
            city: string | null
            address: string | null
            organizations: {
                name: string
            }
        }
    }
    isPast?: boolean
}

function EventCard({ registration, isPast }: EventCardProps) {
    const opp = registration.opportunities
    const startDate = new Date(opp.start_date)

    return (
        <Link href={`/opportunities/${opp.id}`}>
            <Card hover className="flex items-center gap-4 p-4">
                {/* Date badge */}
                <div className="shrink-0 w-14 h-14 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary-50))] flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-[hsl(var(--color-primary-600))] uppercase">
                        {startDate.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold text-[hsl(var(--color-primary-700))]">
                        {startDate.getDate()}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{opp.title}</h3>
                        <Badge
                            variant={
                                registration.status === 'confirmed' ? 'success' :
                                    registration.status === 'completed' ? 'default' :
                                        registration.status === 'waitlisted' ? 'warning' : 'info'
                            }
                            size="sm"
                        >
                            {registration.status}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[hsl(var(--text-secondary))]">
                        <span className="flex items-center gap-1 truncate">
                            <Building2 className="w-3.5 h-3.5" />
                            {opp.organizations.name}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {opp.location_type === 'in-person' && opp.city ? opp.city : opp.location_type}
                        </span>
                    </div>

                    {isPast && registration.hours_logged > 0 && (
                        <p className="text-sm text-[hsl(var(--color-success))] mt-1">
                            {registration.hours_logged} hours logged
                        </p>
                    )}
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-[hsl(var(--text-muted))] shrink-0" />
            </Card>
        </Link>
    )
}
