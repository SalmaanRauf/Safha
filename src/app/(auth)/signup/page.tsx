/**
 * Signup Page
 * 
 * Registration page with role selection (volunteer vs organization).
 */

import Link from 'next/link'
import { SignupForm } from './signup-form'

export const metadata = {
    title: 'Sign Up',
    description: 'Create your Safha account',
}

export default function SignupPage() {
    return (
        <div>
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))] mb-2">
                    Create your account
                </h1>
                <p className="text-[hsl(var(--text-secondary))]">
                    Start making a difference in your community
                </p>
            </div>

            {/* Signup form */}
            <SignupForm />

            {/* Links */}
            <div className="mt-6 text-center">
                <p className="text-sm text-[hsl(var(--text-secondary))]">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-[hsl(var(--color-primary-600))] hover:underline font-medium"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
