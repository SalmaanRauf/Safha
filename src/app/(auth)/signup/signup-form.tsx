/**
 * Signup Form Component
 * 
 * Client component for user registration with role selection.
 */

'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { Users, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Role = 'volunteer' | 'organization'

// Wrapper component to handle Suspense for useSearchParams
export function SignupForm() {
    return (
        <Suspense fallback={<SignupFormSkeleton />}>
            <SignupFormContent />
        </Suspense>
    )
}

// Loading skeleton for SSR
function SignupFormSkeleton() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="h-20 bg-[hsl(var(--bg-secondary))] rounded-[var(--radius-lg)]" />
            <div className="h-12 bg-[hsl(var(--bg-secondary))] rounded-[var(--radius-md)]" />
            <div className="h-12 bg-[hsl(var(--bg-secondary))] rounded-[var(--radius-md)]" />
            <div className="h-12 bg-[hsl(var(--bg-secondary))] rounded-[var(--radius-md)]" />
            <div className="h-11 bg-[hsl(var(--color-primary-200))] rounded-[var(--radius-md)]" />
        </div>
    )
}

function SignupFormContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialRole = searchParams.get('role') as Role | null

    const [role, setRole] = useState<Role>(initialRole === 'organization' ? 'organization' : 'volunteer')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const fullName = formData.get('fullName') as string

        const supabase = createClient()

        // Sign up the user
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role,
                },
            },
        })

        if (signUpError) {
            setError(signUpError.message)
            setIsLoading(false)
            return
        }

        // If email confirmation is required, show message
        if (data.user && !data.session) {
            router.push('/login?message=Check your email to confirm your account')
            return
        }

        // Otherwise, redirect to dashboard
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

            {/* Role selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[hsl(var(--text-primary))]">
                    I want to...
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setRole('volunteer')}
                        className={cn(
                            'flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] border-2 transition-all',
                            role === 'volunteer'
                                ? 'border-[hsl(var(--color-primary-500))] bg-[hsl(var(--color-primary-50))]'
                                : 'border-[hsl(var(--border-default))] hover:border-[hsl(var(--border-strong))]'
                        )}
                    >
                        <Users className={cn(
                            'w-6 h-6',
                            role === 'volunteer'
                                ? 'text-[hsl(var(--color-primary-600))]'
                                : 'text-[hsl(var(--text-muted))]'
                        )} />
                        <span className={cn(
                            'text-sm font-medium',
                            role === 'volunteer'
                                ? 'text-[hsl(var(--color-primary-700))]'
                                : 'text-[hsl(var(--text-secondary))]'
                        )}>
                            Volunteer
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('organization')}
                        className={cn(
                            'flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] border-2 transition-all',
                            role === 'organization'
                                ? 'border-[hsl(var(--color-primary-500))] bg-[hsl(var(--color-primary-50))]'
                                : 'border-[hsl(var(--border-default))] hover:border-[hsl(var(--border-strong))]'
                        )}
                    >
                        <Building2 className={cn(
                            'w-6 h-6',
                            role === 'organization'
                                ? 'text-[hsl(var(--color-primary-600))]'
                                : 'text-[hsl(var(--text-muted))]'
                        )} />
                        <span className={cn(
                            'text-sm font-medium',
                            role === 'organization'
                                ? 'text-[hsl(var(--color-primary-700))]'
                                : 'text-[hsl(var(--text-secondary))]'
                        )}>
                            Organization
                        </span>
                    </button>
                </div>
            </div>

            <Input
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                required
            />

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
                autoComplete="new-password"
                hint="At least 8 characters"
                required
                minLength={8}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Account
            </Button>

            <p className="text-xs text-center text-[hsl(var(--text-muted))]">
                By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
        </form>
    )
}
