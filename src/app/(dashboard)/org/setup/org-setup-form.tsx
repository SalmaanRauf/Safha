/**
 * Organization Setup Form
 * 
 * Client component for creating a new organization.
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

interface OrgSetupFormProps {
    userId: string
}

export function OrgSetupForm({ userId }: OrgSetupFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const contactEmail = formData.get('contactEmail') as string
        const website = formData.get('website') as string
        const city = formData.get('city') as string

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const supabase = createClient()

        // Create organization
        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert({
                name,
                slug,
                description,
                contact_email: contactEmail,
                website: website || null,
                city: city || null,
            } as never)
            .select('id')
            .single()

        if (orgError) {
            if (orgError.message.includes('duplicate')) {
                setError('An organization with this name already exists')
            } else {
                setError(orgError.message)
            }
            return
        }

        // Add user as owner
        const { error: memberError } = await supabase
            .from('organization_members')
            .insert({
                user_id: userId,
                organization_id: org.id,
                role: 'owner',
            } as never)

        if (memberError) {
            setError(memberError.message)
            return
        }

        startTransition(() => {
            router.push('/org')
            router.refresh()
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="p-3 rounded-[var(--radius-md)] bg-[hsl(var(--color-error)/0.1)] border border-[hsl(var(--color-error)/0.2)]">
                    <p className="text-sm text-[hsl(var(--color-error))]">{error}</p>
                </div>
            )}

            <Input
                label="Organization Name"
                name="name"
                placeholder="e.g., Community Food Bank"
                required
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Description
                </label>
                <textarea
                    name="description"
                    rows={4}
                    placeholder="Tell volunteers about your organization and mission..."
                    className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-white border border-[hsl(var(--border-default))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:border-[hsl(var(--color-primary-500))] focus:ring-2 focus:ring-[hsl(var(--color-primary-500)/0.15)] transition-all resize-none"
                    required
                />
            </div>

            <Input
                label="Contact Email"
                name="contactEmail"
                type="email"
                placeholder="contact@organization.org"
                required
            />

            <div className="grid sm:grid-cols-2 gap-4">
                <Input
                    label="Website"
                    name="website"
                    type="url"
                    placeholder="https://..."
                />
                <Input
                    label="City"
                    name="city"
                    placeholder="e.g., San Francisco"
                />
            </div>

            <div className="pt-4">
                <Button type="submit" className="w-full" isLoading={isPending}>
                    Create Organization
                </Button>
            </div>
        </form>
    )
}
