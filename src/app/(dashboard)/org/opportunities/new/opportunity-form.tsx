/**
 * Opportunity Form Component
 * 
 * Reusable form for creating and editing opportunities.
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Badge } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface OpportunityFormProps {
    organizationId: string
    initialData?: {
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
}

// Category options
const CATEGORIES = [
    'Environment',
    'Education',
    'Health',
    'Food & Hunger',
    'Animals',
    'Arts & Culture',
    'Community',
    'Seniors',
    'Youth',
    'Disaster Relief',
]

// Location type options
const LOCATION_TYPES = [
    { value: 'in-person', label: 'In Person' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
]

export function OpportunityForm({ organizationId, initialData }: OpportunityFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const [category, setCategory] = useState(initialData?.category || '')
    const [locationType, setLocationType] = useState(initialData?.location_type || 'in-person')
    const [skills, setSkills] = useState<string[]>(initialData?.skills_needed || [])
    const [skillInput, setSkillInput] = useState('')
    const [publishMode, setPublishMode] = useState<'published' | 'draft'>('draft')

    const isEditing = !!initialData

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const formData = new FormData(e.currentTarget)

        const data = {
            organization_id: organizationId,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            short_description: formData.get('shortDescription') as string || null,
            category,
            skills_needed: skills,
            location_type: locationType,
            address: formData.get('address') as string || null,
            city: formData.get('city') as string || null,
            start_date: formData.get('startDate') as string,
            end_date: formData.get('endDate') as string || null,
            max_volunteers: formData.get('maxVolunteers')
                ? parseInt(formData.get('maxVolunteers') as string)
                : null,
            status: publishMode,
        }

        if (!category) {
            setError('Please select a category')
            return
        }

        const supabase = createClient()

        if (isEditing) {
            const { error: updateError } = await supabase
                .from('opportunities')
                .update(data as never)
                .eq('id', initialData.id)

            if (updateError) {
                setError(updateError.message)
                return
            }
        } else {
            const { error: insertError } = await supabase
                .from('opportunities')
                .insert(data as never)

            if (insertError) {
                setError(insertError.message)
                return
            }
        }

        startTransition(() => {
            router.push('/org/opportunities')
            router.refresh()
        })
    }

    function addSkill() {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()])
            setSkillInput('')
        }
    }

    function removeSkill(skill: string) {
        setSkills(skills.filter(s => s !== skill))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 rounded-[var(--radius-md)] bg-[hsl(var(--color-error)/0.1)] border border-[hsl(var(--color-error)/0.2)]">
                    <p className="text-sm text-[hsl(var(--color-error))]">{error}</p>
                </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="text-heading text-sm text-[hsl(var(--text-muted))] uppercase tracking-wider">
                    Basic Information
                </h3>

                <Input
                    label="Title"
                    name="title"
                    placeholder="e.g., Beach Cleanup Day"
                    defaultValue={initialData?.title}
                    required
                />

                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Short Description
                    </label>
                    <input
                        name="shortDescription"
                        placeholder="A brief one-line summary..."
                        defaultValue={initialData?.short_description || ''}
                        maxLength={150}
                        className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-white border border-[hsl(var(--border-default))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:border-[hsl(var(--color-primary-500))] focus:ring-2 focus:ring-[hsl(var(--color-primary-500)/0.15)] transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Full Description
                    </label>
                    <textarea
                        name="description"
                        rows={5}
                        placeholder="Describe the opportunity, what volunteers will do, any requirements..."
                        defaultValue={initialData?.description}
                        className="w-full px-3.5 py-2.5 rounded-[var(--radius-md)] bg-white border border-[hsl(var(--border-default))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:border-[hsl(var(--color-primary-500))] focus:ring-2 focus:ring-[hsl(var(--color-primary-500)/0.15)] transition-all resize-none"
                        required
                    />
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm transition-all',
                                    category === cat
                                        ? 'bg-[hsl(var(--color-primary-600))] text-white'
                                        : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--color-primary-100))]'
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
                <h3 className="text-heading text-sm text-[hsl(var(--text-muted))] uppercase tracking-wider">
                    Date & Time
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                        label="Start Date & Time"
                        name="startDate"
                        type="datetime-local"
                        defaultValue={initialData?.start_date?.slice(0, 16)}
                        required
                    />
                    <Input
                        label="End Date & Time"
                        name="endDate"
                        type="datetime-local"
                        defaultValue={initialData?.end_date?.slice(0, 16)}
                    />
                </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
                <h3 className="text-heading text-sm text-[hsl(var(--text-muted))] uppercase tracking-wider">
                    Location
                </h3>

                <div className="flex gap-2">
                    {LOCATION_TYPES.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setLocationType(type.value)}
                            className={cn(
                                'px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all',
                                locationType === type.value
                                    ? 'bg-[hsl(var(--color-primary-600))] text-white'
                                    : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--color-primary-100))]'
                            )}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>

                {locationType !== 'remote' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Address"
                            name="address"
                            placeholder="123 Main St"
                        />
                        <Input
                            label="City"
                            name="city"
                            placeholder="San Francisco"
                        />
                    </div>
                )}
            </div>

            {/* Volunteers */}
            <div className="space-y-4">
                <h3 className="text-heading text-sm text-[hsl(var(--text-muted))] uppercase tracking-wider">
                    Volunteers
                </h3>

                <Input
                    label="Max Volunteers"
                    name="maxVolunteers"
                    type="number"
                    min={1}
                    placeholder="Leave empty for unlimited"
                    defaultValue={initialData?.max_volunteers || ''}
                    hint="Leave empty for unlimited spots"
                />

                {/* Skills */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium">Skills Needed</label>
                    <div className="flex gap-2">
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            placeholder="Add a skill..."
                            className="flex-1 px-3.5 py-2.5 rounded-[var(--radius-md)] bg-white border border-[hsl(var(--border-default))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none focus:border-[hsl(var(--color-primary-500))] focus:ring-2 focus:ring-[hsl(var(--color-primary-500)/0.15)] transition-all"
                        />
                        <Button type="button" variant="secondary" onClick={addSkill}>
                            Add
                        </Button>
                    </div>
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skills.map((skill) => (
                                <Badge key={skill} variant="info">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="ml-1 hover:text-[hsl(var(--color-error))]"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[hsl(var(--border-subtle))]">
                <Button
                    type="submit"
                    className="flex-1"
                    isLoading={isPending}
                    onClick={() => setPublishMode('published')}
                >
                    {isEditing ? 'Update & Publish' : 'Publish Opportunity'}
                </Button>
                <Button
                    type="submit"
                    variant="secondary"
                    className="flex-1"
                    isLoading={isPending}
                    onClick={() => setPublishMode('draft')}
                >
                    {isEditing ? 'Save as Draft' : 'Save Draft'}
                </Button>
            </div>
        </form>
    )
}
