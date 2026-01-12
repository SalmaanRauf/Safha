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
    const [oauthLoading, setOauthLoading] = useState<string | null>(null)
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

    async function handleOAuthLogin(provider: 'google' | 'apple') {
        setOauthLoading(provider)
        setError(null)

        const supabase = createClient()

        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (oauthError) {
            setError(oauthError.message)
            setOauthLoading(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* OAuth buttons */}
            <div className="space-y-3">
                <button
                    type="button"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={oauthLoading !== null}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[hsl(var(--border-default))] bg-white hover:bg-[hsl(var(--bg-secondary))] transition-colors disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {oauthLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
                </button>

                <button
                    type="button"
                    onClick={() => handleOAuthLogin('apple')}
                    disabled={oauthLoading !== null}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-[hsl(var(--border-default))] bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    {oauthLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}
                </button>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[hsl(var(--border-subtle))]" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[hsl(var(--bg-primary))] text-[hsl(var(--text-muted))]">
                        or continue with email
                    </span>
                </div>
            </div>

            {/* Email/Password form */}
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
        </div>
    )
}
