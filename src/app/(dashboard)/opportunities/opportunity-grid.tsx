/**
 * Opportunity Grid Component
 * 
 * Displays a grid of opportunity cards with beautiful styling.
 */

import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { formatRelativeTime } from '@/lib/utils'

interface Organization {
    id: string
    name: string
    logo_url: string | null
    is_verified: boolean
}

interface Opportunity {
    id: string
    title: string
    short_description: string | null
    description: string
    category: string
    location_type: 'in-person' | 'remote' | 'hybrid'
    city: string | null
    start_date: string
    end_date: string | null
    max_volunteers: number | null
    current_volunteers: number
    image_url: string | null
    organizations: Organization
}

interface OpportunityGridProps {
    opportunities: Opportunity[]
}

export function OpportunityGrid({ opportunities }: OpportunityGridProps) {
    if (opportunities.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--bg-secondary))] flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-[hsl(var(--text-muted))]" />
                </div>
                <h3 className="text-heading text-lg mb-2">No opportunities found</h3>
                <p className="text-[hsl(var(--text-secondary))] max-w-md mx-auto">
                    Try adjusting your filters or check back later for new opportunities.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp, index) => (
                <OpportunityCard key={opp.id} opportunity={opp} index={index} />
            ))}
        </div>
    )
}

function OpportunityCard({ opportunity, index }: { opportunity: Opportunity; index: number }) {
    const spotsLeft = opportunity.max_volunteers
        ? opportunity.max_volunteers - opportunity.current_volunteers
        : null

    const startDate = new Date(opportunity.start_date)
    const isUpcoming = startDate > new Date()

    return (
        <Link href={`/opportunities/${opportunity.id}`}>
            <Card
                hover
                className="h-full flex flex-col overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                {/* Image or gradient header */}
                <div className="h-32 bg-gradient-to-br from-[hsl(var(--color-primary-100))] to-[hsl(var(--color-primary-200))] relative">
                    {opportunity.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={opportunity.image_url}
                            alt={opportunity.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* Category badge */}
                    <Badge className="absolute top-3 left-3" variant="default">
                        {opportunity.category}
                    </Badge>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col">
                    {/* Org name */}
                    <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-sm text-[hsl(var(--text-secondary))] truncate">
                            {opportunity.organizations.name}
                        </span>
                        {opportunity.organizations.is_verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--color-primary-500))]" />
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-heading text-base mb-2 line-clamp-2 group-hover:text-[hsl(var(--color-primary-600))] transition-colors">
                        {opportunity.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[hsl(var(--text-secondary))] line-clamp-2 mb-4 flex-1">
                        {opportunity.short_description || opportunity.description}
                    </p>

                    {/* Meta info */}
                    <div className="space-y-2 text-sm">
                        {/* Date */}
                        <div className="flex items-center gap-2 text-[hsl(var(--text-secondary))]">
                            <Clock className="w-4 h-4" />
                            <span>
                                {startDate.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                                {isUpcoming && (
                                    <span className="text-[hsl(var(--color-primary-600))] ml-1">
                                        • {formatRelativeTime(startDate)}
                                    </span>
                                )}
                            </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-[hsl(var(--text-secondary))]">
                            <MapPin className="w-4 h-4" />
                            <span className="capitalize">
                                {opportunity.location_type === 'in-person' && opportunity.city
                                    ? opportunity.city
                                    : opportunity.location_type}
                            </span>
                        </div>

                        {/* Spots */}
                        {spotsLeft !== null && (
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
                                <span className={spotsLeft <= 3 ? 'text-[hsl(var(--color-warning))] font-medium' : 'text-[hsl(var(--text-secondary))]'}>
                                    {spotsLeft === 0 ? 'Waitlist only' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-[hsl(var(--border-subtle))] flex items-center justify-between bg-[hsl(var(--bg-secondary)/0.3)]">
                    <span className="text-sm font-medium text-[hsl(var(--color-primary-600))]">
                        View details
                    </span>
                    <ChevronRight className="w-4 h-4 text-[hsl(var(--color-primary-600))] group-hover:translate-x-1 transition-transform" />
                </div>
            </Card>
        </Link>
    )
}
