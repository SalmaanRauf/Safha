/**
 * Auth Layout
 * 
 * Shared layout for authentication pages (login, signup).
 * Centers content and provides consistent branding.
 */

import Link from 'next/link'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Simple header with logo */}
            <header className="py-6 px-4">
                <div className="max-w-md mx-auto">
                    <Link
                        href="/"
                        className="text-display text-xl text-[hsl(var(--color-primary-600))] hover:opacity-80 transition-opacity"
                    >
                        صفحة
                    </Link>
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
