/**
 * Auth Layout
 * 
 * Shared layout for authentication pages (login, signup).
 * Centers content and provides consistent branding.
 */

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Simple header with logo */}
            {/* Simple header with logo and navigation */}
            <header className="py-6 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--color-primary-600))] transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <Logo />

                    <div className="w-[100px]" /> {/* Spacer for centering if needed, or just empty */}
                </div>
            </header>

            {/* Centered content area */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md animate-slide-up">
                    {children}
                </div>
            </main>

            {/* Minimal footer */}
            <footer className="py-6 px-4 text-center">
                <p className="text-sm text-[hsl(var(--text-muted))]">
                    © {new Date().getFullYear()} Safha. All rights reserved.
                </p>
            </footer>
        </div>
    )
}
