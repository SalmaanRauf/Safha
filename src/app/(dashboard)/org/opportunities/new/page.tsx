/**
 * Create New Opportunity Page
 * 
 * Form for organizations to create new volunteer opportunities.
 */

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import { OpportunityForm } from './opportunity-form'

export const metadata = {
    title: 'Create Opportunity',
    description: 'Create a new volunteer opportunity',
}

export default async function NewOpportunityPage() {
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

    if (membership.role !== 'owner' && membership.role !== 'admin') {
        redirect('/org')
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
                    Create Opportunity
                </h1>
                <p className="text-[hsl(var(--text-secondary))]">
                    Fill in the details below to post a new volunteer opportunity.
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <OpportunityForm organizationId={membership.organization_id} />
                </CardContent>
            </Card>
        </div>
    )
}
