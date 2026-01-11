/**
 * Profile Form Component
 * 
 * Client-side form for updating user profile.
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database.types'

interface ProfileFormProps {
    profile: Profile | null
}

// Common skills for suggestions
const SKILL_OPTIONS = [
    'Teaching', 'Mentoring', 'First Aid', 'Driving', 'Cooking',
    'Event Planning', 'Photography', 'Social Media', 'Translation',
    'Construction', 'Gardening', 'Music', 'Art', 'Writing', 'Tech Support'
]

export function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [skills, setSkills] = useState<string[]>(profile?.skills || [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        if (!profile?.id) {
            setError('Profile not found')
            return
        }

        const formData = new FormData(e.currentTarget)
        const supabase = createClient()

        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                full_name: formData.get('fullName') as string,
                phone: formData.get('phone') as string,
                bio: formData.get('bio') as string,
                skills,
            } as never) // Type assertion for Supabase generic types
            .eq('id', profile.id)

        if (updateError) {
            setError(updateError.message)
            return
        }

        setSuccess(true)
        startTransition(() => {
            router.refresh()
        })

        // Clear success message after 3s
        setTimeout(() => setSuccess(false), 3000)
    }

    function toggleSkill(skill: string) {
        setSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 rounded-[var(--radius-md)] bg-[hsl(var(--color-error)/0.1)] border border-[hsl(var(--color-error)/0.2)]">
                    <p className="text-sm text-[hsl(var(--color-error))]">{error}</p>
                </div>
            )}

            {success && (
                <div className="p-3 rounded-[var(--radius-md)] bg-[hsl(var(--color-success)/0.1)] border border-[hsl(var(--color-success)/0.2)]">
                    <p className="text-sm text-[hsl(var(--color-success))]">Profile updated successfully!</p>
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
                <Input
                    label="Full Name"
                    name="fullName"
                    defaultValue={profile?.full_name || ''}
                    placeholder="Your name"
                />
                <Input
                    label="Phone"
                    name="phone"
                    type="tel"
                    defaultValue={profile?.phone || ''}
                    placeholder="+1 (555) 000-0000"
                />
            </div>

            <Input
                label="Email"
                type="email"
                value={profile?.email || ''}
                disabled
                hint="Email cannot be changed"
            />

            <div className="space-y-2">
                <label className="block text-sm font-medium text-[hsl(var(--text-primary))]">
                    Bio
                </label>
                <textarea
                    name="bio"
                    rows={4}
                    defaultValue={profile?.bio || ''}
                    placeholder="Tell organizations about yourself..."
                    className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))] border border-[hsl(var(--border-default))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:border-[hsl(var(--color-primary-500))] focus:ring-2 focus:ring-[hsl(var(--color-primary-500)/0.15)] transition-all resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-[hsl(var(--text-primary))]">
                    Skills
                </label>
                <p className="text-sm text-[hsl(var(--text-muted))]">
                    Select skills you can contribute
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                    {SKILL_OPTIONS.map((skill) => {
                        const isSelected = skills.includes(skill)
                        return (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`px-3 py-1.5 rounded-full text-sm transition-all ${isSelected
                                    ? 'bg-[hsl(var(--color-primary-600))] text-white'
                                    : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--color-primary-100))]'
                                    }`}
                            >
                                {skill}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" isLoading={isPending}>
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
