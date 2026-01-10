/**
 * Login Page
 * 
 * Clean, focused login form with email/password authentication.
 */

import Link from 'next/link'
import { LoginForm } from './login-form'

export const metadata = {
    title: 'Log In',
    description: 'Log in to your Safha account',
}

export default function LoginPage() {
    return (
        <div>
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))] mb-2">
                    Welcome back
                </h1>
                <p className="text-[hsl(var(--text-secondary))]">
                    Log in to continue making an impact
                </p>
            </div>

            {/* Login form */}
            <LoginForm />

            {/* Links */}
            <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-[hsl(var(--text-secondary))]">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/signup"
                        className="text-[hsl(var(--color-primary-600))] hover:underline font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
