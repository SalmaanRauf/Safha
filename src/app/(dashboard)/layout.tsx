/**
 * Dashboard Layout
 * 
 * The main layout for authenticated users. Includes sidebar navigation
 * and responsive design for mobile/desktop.
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileNav } from '@/components/layout/mobile-nav'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    // Get user role from profiles table (not user_metadata)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single() as { data: { role: string } | null }

    const role = profile?.role || 'volunteer'

    return (
        <div className="min-h-screen bg-[hsl(var(--bg-secondary))]">
            {/* Desktop sidebar */}
            <Sidebar user={user} role={role} />

            {/* Mobile bottom nav */}
            <MobileNav role={role} />

            {/* Main content area */}
            <main className="lg:pl-64 pb-20 lg:pb-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

