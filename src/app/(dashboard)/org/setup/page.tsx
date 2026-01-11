/**
 * Organization Setup Page
 * 
 * Allows organization users to create their organization profile.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { OrgSetupForm } from './org-setup-form'

export const metadata = {
    title: 'Create Organization',
    description: 'Set up your organization on Safha',
}

export default async function OrgSetupPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user already has an organization
    const { data: membership } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    if (membership?.organization_id) {
        redirect('/org')
    }

    return (
        <div className="max-w-xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-display text-2xl sm:text-3xl mb-2">
                    Create your organization
                </h1>
                <p className="text-[hsl(var(--text-secondary))]">
                    Tell us about your organization to get started
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrgSetupForm userId={user.id} />
                </CardContent>
            </Card>
        </div>
    )
}
