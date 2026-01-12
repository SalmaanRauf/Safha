/**
 * Edit Opportunity Page
 * 
 * Allows organizations to edit existing opportunities.
 */

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import { OpportunityForm } from '../../new/opportunity-form'

interface PageProps {
    params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('opportunities')
        .select('title')
        .eq('id', params.id)
        .single()

    return {
        title: `Edit: ${data?.title || 'Opportunity'}`,
    }
}

export default async function EditOpportunityPage({ params }: PageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user's organization
    const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .single()

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
        short_description: string | null
        category: string
        skills_needed: string[]
        location_type: string
        address: string | null
        city: string | null
        start_date: string
        end_date: string | null
        max_volunteers: number | null
        status: string
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Back link */}
            <Link
                href="/org/opportunities"
                className="inline-flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to opportunities
            </Link>

            <div className="mb-8">
                <h1 className="text-display text-2xl sm:text-3xl mb-2">
                    Edit Opportunity
                </h1>
                <p className="text-[hsl(var(--text-secondary))]">
                    Update the details for &quot;{opportunity.title}&quot;
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <OpportunityForm
                        organizationId={membership.organization_id}
                        initialData={opportunity}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
