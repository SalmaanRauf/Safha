/**
 * Organization Verify Button
 * 
 * Client component to verify an organization.
 */

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle } from 'lucide-react'

interface OrgVerifyButtonProps {
    orgId: string
    orgName: string
}

export function OrgVerifyButton({ orgId, orgName }: OrgVerifyButtonProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    async function handleVerify() {
        setError(null)

        const supabase = createClient()

        const { error: updateError } = await supabase
            .from('organizations')
            .update({ is_verified: true } as never)
            .eq('id', orgId)

        if (updateError) {
            setError(updateError.message)
            return
        }

        startTransition(() => {
            router.refresh()
        })
    }

    return (
        <div className="flex flex-col gap-1">
            <Button
                size="sm"
                onClick={handleVerify}
                isLoading={isPending}
            >
                <CheckCircle className="w-4 h-4 mr-1" />
                Verify
            </Button>
            {error && (
                <p className="text-xs text-[hsl(var(--color-error))]">{error}</p>
            )}
        </div>
    )
}
