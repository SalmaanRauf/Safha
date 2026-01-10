/**
 * Sidebar Component
 * 
 * Desktop navigation sidebar with role-based menu items.
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { cn, getInitials } from '@/lib/utils'
import {
    Home,
    Search,
    Calendar,
    User as UserIcon,
    Settings,
    Building2,
    Users,
    BarChart3,
    PlusCircle,
    LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
    user: User
    role: string
}

export function Sidebar({ user, role }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    // Navigation items based on role
    const volunteerNav = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/opportunities', label: 'Browse', icon: Search },
        { href: '/my-schedule', label: 'My Schedule', icon: Calendar },
        { href: '/profile', label: 'Profile', icon: UserIcon },
    ]

    const orgNav = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/org/volunteers', label: 'Volunteers', icon: Users },
        { href: '/org/opportunities', label: 'Opportunities', icon: Calendar },
        { href: '/org/create', label: 'Create New', icon: PlusCircle },
        { href: '/org/settings', label: 'Settings', icon: Settings },
    ]

    const adminNav = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/organizations', label: 'Organizations', icon: Building2 },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ]

    const navItems = role === 'admin' ? adminNav : role === 'organization' ? orgNav : volunteerNav

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-[hsl(var(--bg-elevated))] border-r border-[hsl(var(--border-subtle))]">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-[hsl(var(--border-subtle))]">
                <Link href="/dashboard" className="text-display text-xl text-[hsl(var(--color-primary-600))]">
                    صفحة
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-[var(--transition-fast)]',
                                isActive
                                    ? 'bg-[hsl(var(--color-primary-50))] text-[hsl(var(--color-primary-700))]'
                                    : 'text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-secondary))] hover:text-[hsl(var(--text-primary))]'
                            )}
                        >
                            <item.icon className={cn(
                                'w-5 h-5',
                                isActive ? 'text-[hsl(var(--color-primary-600))]' : ''
                            )} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* User profile & logout */}
            <div className="p-3 border-t border-[hsl(var(--border-subtle))]">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-9 h-9 rounded-full bg-[hsl(var(--color-primary-100))] flex items-center justify-center text-sm font-medium text-[hsl(var(--color-primary-700))]">
                        {getInitials(user.user_metadata?.full_name || user.email || 'U')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[hsl(var(--text-primary))] truncate">
                            {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-[hsl(var(--text-muted))] truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-[var(--radius-md)] text-sm font-medium text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-secondary))] hover:text-[hsl(var(--color-error))] transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Log Out
                </button>
            </div>
        </aside>
    )
}
