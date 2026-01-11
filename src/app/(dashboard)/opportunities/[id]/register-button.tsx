/**
 * Register Button Component
 * 
 * Handles volunteer registration for opportunities.
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { Check, X, Clock } from 'lucide-react'

interface RegisterButtonProps {
    opportunityId: string
    isRegistered: boolean
    registrationStatus?: string
    isFull: boolean
    waitlistEnabled: boolean
}

export function RegisterButton({
    opportunityId,
    isRegistered,
    registrationStatus,
    isFull,
    waitlistEnabled,
}: RegisterButtonProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    async function handleRegister() {
        setError(null)
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login?redirectTo=/opportunities/' + opportunityId)
            return
        }

        const status = isFull && waitlistEnabled ? 'waitlisted' : 'pending'

        const { error: insertError } = await supabase
            .from('registrations')
            .insert({
                user_id: user.id,
                opportunity_id: opportunityId,
                status,
            } as never)

        if (insertError) {
            setError(insertError.message)
            return
        }

        startTransition(() => {
            router.refresh()
        })
    }

    async function handleCancel() {
        setError(null)
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error: updateError } = await supabase
            .from('registrations')
            .update({ status: 'cancelled' } as never)
            .eq('opportunity_id', opportunityId)
            .eq('user_id', user.id)

        if (updateError) {
            setError(updateError.message)
            return
        }

        startTransition(() => {
            router.refresh()
        })
    }

    // Already registered
    if (isRegistered && registrationStatus !== 'cancelled') {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 rounded-[var(--radius-md)] bg-[hsl(var(--color-success)/0.1)] text-[hsl(var(--color-success))]">
                    {registrationStatus === 'confirmed' && <Check className="w-5 h-5" />}
                    {registrationStatus === 'pending' && <Clock className="w-5 h-5" />}
                    {registrationStatus === 'waitlisted' && <Clock className="w-5 h-5" />}
                    <span className="font-medium capitalize">
                        {registrationStatus === 'pending' ? 'Registration pending' : registrationStatus}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    className="w-full text-[hsl(var(--color-error))]"
                    onClick={handleCancel}
                    isLoading={isPending}
                >
                    <X className="w-4 h-4" />
                    Cancel Registration
                </Button>
            </div>
        )
    }

    // Full and no waitlist
    if (isFull && !waitlistEnabled) {
        return (
            <Button disabled className="w-full">
                No spots available
            </Button>
        )
    }

    return (
        <div className="space-y-2">
            <Button
                className="w-full"
                onClick={handleRegister}
                isLoading={isPending}
            >
                {isFull ? 'Join Waitlist' : 'Sign Up to Volunteer'}
            </Button>
            {error && (
                <p className="text-sm text-[hsl(var(--color-error))]">{error}</p>
            )}
        </div>
    )
}
