/**
 * Opportunity Detail Page
 * 
 * Shows full details of an opportunity with sign-up functionality.
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    ArrowLeft,
    CheckCircle2,
    Building2,
    Share2
} from 'lucide-react'
import { RegisterButton } from './register-button'

// Type for opportunity with joined organization
interface OpportunityWithOrg {
    id: string
    title: string
    description: string
    short_description: string | null
    category: string
    skills_needed: string[] | null
    location_type: string
    address: string | null
    city: string | null
    start_date: string
    end_date: string | null
    recurrence: string
    max_volunteers: number | null
    current_volunteers: number
    waitlist_enabled: boolean
    status: string
    image_url: string | null
    organizations: {
        id: string
        name: string
        logo_url: string | null
        is_verified: boolean
        description: string | null
        website: string | null
    }
}

interface PageProps {
    params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('opportunities')
        .select('title, short_description')
        .eq('id', params.id)
        .single()

    const opp = data as { title?: string; short_description?: string } | null

    return {
        title: opp?.title || 'Opportunity',
        description: opp?.short_description || 'View opportunity details',
    }
}

export default async function OpportunityDetailPage({ params }: PageProps) {
    const supabase = await createClient()

    // Fetch opportunity with organization
    const { data, error } = await supabase
        .from('opportunities')
        .select(`
      *,
      organizations (
        id,
        name,
        logo_url,
        is_verified,
        description,
        website
      )
    `)
        .eq('id', params.id)
        .single()

    if (error || !data) {
        notFound()
    }

    // Cast to proper type
    const opportunity = data as unknown as OpportunityWithOrg

    // Check if current user is registered
    const { data: { user } } = await supabase.auth.getUser()
    let registration: { id: string; status: string } | null = null

    if (user) {
        const { data } = await supabase
            .from('registrations')
            .select('id, status')
            .eq('opportunity_id', params.id)
            .eq('user_id', user.id)
            .single() as { data: { id: string; status: string } | null }
        registration = data
    }

    const startDate = new Date(opportunity.start_date)
    const endDate = opportunity.end_date ? new Date(opportunity.end_date) : null
    const spotsLeft = opportunity.max_volunteers
        ? opportunity.max_volunteers - opportunity.current_volunteers
        : null

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Back link */}
            <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to opportunities
            </Link>

            {/* Header */}
            <div className="mb-8">
                {/* Category & Status */}
                <div className="flex items-center gap-2 mb-3">
                    <Badge>{opportunity.category}</Badge>
                    <Badge variant={opportunity.status === 'published' ? 'success' : 'warning'}>
                        {opportunity.status}
                    </Badge>
                </div>

                {/* Title */}
                <h1 className="text-display text-2xl sm:text-3xl lg:text-4xl text-[hsl(var(--text-primary))] mb-4">
                    {opportunity.title}
                </h1>

                {/* Organization */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[hsl(var(--color-primary-100))] flex items-center justify-center">
                        {opportunity.organizations.logo_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={opportunity.organizations.logo_url}
                                alt={opportunity.organizations.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <Building2 className="w-5 h-5 text-[hsl(var(--color-primary-600))]" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-medium">{opportunity.organizations.name}</span>
                            {opportunity.organizations.is_verified && (
                                <CheckCircle2 className="w-4 h-4 text-[hsl(var(--color-primary-500))]" />
                            )}
                        </div>
                        {opportunity.organizations.website && (
                            <a
                                href={opportunity.organizations.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[hsl(var(--color-primary-600))] hover:underline"
                            >
                                Visit website
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image */}
                    {opportunity.image_url && (
                        <div className="rounded-[var(--radius-xl)] overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={opportunity.image_url}
                                alt={opportunity.title}
                                className="w-full h-64 object-cover"
                            />
                        </div>
                    )}

                    {/* Description */}
                    <Card>
                        <CardContent className="prose prose-stone max-w-none">
                            <h2 className="text-heading text-lg mb-4">About this opportunity</h2>
                            <p className="text-[hsl(var(--text-secondary))] whitespace-pre-wrap">
                                {opportunity.description}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Skills needed */}
                    {opportunity.skills_needed && opportunity.skills_needed.length > 0 && (
                        <Card>
                            <CardContent>
                                <h2 className="text-heading text-lg mb-4">Skills needed</h2>
                                <div className="flex flex-wrap gap-2">
                                    {opportunity.skills_needed.map((skill: string) => (
                                        <Badge key={skill} variant="info">{skill}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Quick info card */}
                    <Card>
                        <CardContent className="space-y-4">
                            {/* Date & Time */}
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-[hsl(var(--color-primary-600))] mt-0.5" />
                                <div>
                                    <p className="font-medium">
                                        {startDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    <p className="text-sm text-[hsl(var(--text-secondary))]">
                                        {startDate.toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                        {endDate && ` - ${endDate.toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}`}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[hsl(var(--color-primary-600))] mt-0.5" />
                                <div>
                                    <p className="font-medium capitalize">{opportunity.location_type}</p>
                                    {opportunity.address && (
                                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                                            {opportunity.address}
                                            {opportunity.city && `, ${opportunity.city}`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Volunteers */}
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-[hsl(var(--color-primary-600))] mt-0.5" />
                                <div>
                                    <p className="font-medium">
                                        {opportunity.current_volunteers} volunteer{opportunity.current_volunteers !== 1 ? 's' : ''} signed up
                                    </p>
                                    {spotsLeft !== null && (
                                        <p className={`text-sm ${spotsLeft <= 3 ? 'text-[hsl(var(--color-warning))]' : 'text-[hsl(var(--text-secondary))]'}`}>
                                            {spotsLeft === 0 ? 'No spots available' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} remaining`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Recurrence */}
                            {opportunity.recurrence !== 'one-time' && (
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-[hsl(var(--color-primary-600))] mt-0.5" />
                                    <div>
                                        <p className="font-medium capitalize">{opportunity.recurrence}</p>
                                        <p className="text-sm text-[hsl(var(--text-secondary))]">
                                            This is a recurring opportunity
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Action buttons */}
                    <Card>
                        <CardContent className="space-y-3">
                            <RegisterButton
                                opportunityId={opportunity.id}
                                isRegistered={!!registration}
                                registrationStatus={registration?.status}
                                isFull={spotsLeft === 0}
                                waitlistEnabled={opportunity.waitlist_enabled}
                            />

                            <Button variant="secondary" className="w-full">
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
