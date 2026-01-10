/**
 * Login Form Component
 * 
 * Client component handling login form state and submission.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        const supabase = createClient()

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            setError(signInError.message)
            setIsLoading(false)
            return
        }

        // Refresh the page to trigger middleware redirect
        router.refresh()
        router.push('/dashboard')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
                <div className="p-3 rounded-[var(--radius-md)] bg-[hsl(var(--color-error)/0.1)] border border-[hsl(var(--color-error)/0.2)]">
                    <p className="text-sm text-[hsl(var(--color-error))]">{error}</p>
                </div>
            )}

            <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
            />

            <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Log In
            </Button>
        </form>
    )
}
