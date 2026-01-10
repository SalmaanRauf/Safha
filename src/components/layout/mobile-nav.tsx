/**
 * Mobile Navigation Component
 * 
 * Bottom tab bar for mobile devices with role-based navigation.
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    Home,
    Search,
    Calendar,
    User as UserIcon,
    Users,
    PlusCircle,
    BarChart3,
    Building2,
} from 'lucide-react'

interface MobileNavProps {
    role: string
}

export function MobileNav({ role }: MobileNavProps) {
    const pathname = usePathname()

    // Simplified nav for mobile (max 5 items)
    const volunteerNav = [
        { href: '/dashboard', label: 'Home', icon: Home },
        { href: '/opportunities', label: 'Browse', icon: Search },
        { href: '/my-schedule', label: 'Schedule', icon: Calendar },
        { href: '/profile', label: 'Profile', icon: UserIcon },
    ]

    const orgNav = [
        { href: '/dashboard', label: 'Home', icon: Home },
        { href: '/org/volunteers', label: 'Volunteers', icon: Users },
        { href: '/org/create', label: 'Create', icon: PlusCircle },
        { href: '/org/opportunities', label: 'Events', icon: Calendar },
    ]

    const adminNav = [
        { href: '/dashboard', label: 'Home', icon: Home },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/organizations', label: 'Orgs', icon: Building2 },
        { href: '/admin/analytics', label: 'Stats', icon: BarChart3 },
    ]

    const navItems = role === 'admin' ? adminNav : role === 'organization' ? orgNav : volunteerNav

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[hsl(var(--bg-elevated))] border-t border-[hsl(var(--border-subtle))] z-50 safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] transition-colors',
                                isActive
                                    ? 'text-[hsl(var(--color-primary-600))]'
                                    : 'text-[hsl(var(--text-muted))]'
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
