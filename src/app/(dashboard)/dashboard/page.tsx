/**
 * Dashboard Page
 * 
 * Main dashboard view showing stats, upcoming events, and quick actions.
 * Content adapts based on user role.
 */

import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Calendar, Clock, TrendingUp, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Dashboard',
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const role = user?.user_metadata?.role || 'volunteer'
    const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome header */}
            <div>
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))]">
                    Welcome back, {name}
                </h1>
                <p className="text-[hsl(var(--text-secondary))] mt-1">
                    {role === 'volunteer'
                        ? "Here's what's happening with your volunteer journey."
                        : role === 'organization'
                            ? "Here's an overview of your organization's activity."
                            : "System overview and management tools."}
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {role === 'volunteer' ? (
                    <>
                        <StatCard
                            label="Hours Logged"
                            value="24.5"
                            icon={Clock}
                            trend="+3 this week"
                        />
                        <StatCard
                            label="Events Attended"
                            value="8"
                            icon={Calendar}
                            trend="+2 this month"
                        />
                        <StatCard
                            label="Impact Score"
                            value="856"
                            icon={TrendingUp}
                            trend="Top 15%"
                        />
                        <StatCard
                            label="Organizations"
                            value="3"
                            icon={Users}
                        />
                    </>
                ) : role === 'organization' ? (
                    <>
                        <StatCard
                            label="Active Volunteers"
                            value="48"
                            icon={Users}
                            trend="+5 this week"
                        />
                        <StatCard
                            label="Open Opportunities"
                            value="12"
                            icon={Calendar}
                        />
                        <StatCard
                            label="Total Hours"
                            value="1,240"
                            icon={Clock}
                            trend="+120 this month"
                        />
                        <StatCard
                            label="Completion Rate"
                            value="94%"
                            icon={TrendingUp}
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            label="Total Users"
                            value="2,547"
                            icon={Users}
                            trend="+89 this week"
                        />
                        <StatCard
                            label="Organizations"
                            value="156"
                            icon={Users}
                        />
                        <StatCard
                            label="Active Events"
                            value="324"
                            icon={Calendar}
                        />
                        <StatCard
                            label="Hours Logged"
                            value="45.2K"
                            icon={Clock}
                            trend="+2.1K this month"
                        />
                    </>
                )}
            </div>

            {/* Upcoming events */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Upcoming Events</CardTitle>
                    <Link
                        href={role === 'volunteer' ? '/my-schedule' : '/org/opportunities'}
                        className="text-sm text-[hsl(var(--color-primary-600))] hover:underline flex items-center gap-1"
                    >
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Placeholder events - will be replaced with real data */}
                        <EventRow
                            title="Community Food Drive"
                            organization="Local Food Bank"
                            date="Tomorrow, 9:00 AM"
                            status="confirmed"
                        />
                        <EventRow
                            title="Park Cleanup Day"
                            organization="Green City Initiative"
                            date="Sat, Jan 18 • 8:00 AM"
                            status="confirmed"
                        />
                        <EventRow
                            title="Youth Mentoring Session"
                            organization="Big Brothers Big Sisters"
                            date="Mon, Jan 20 • 4:00 PM"
                            status="pending"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Quick actions based on role */}
            {role === 'volunteer' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <QuickAction href="/opportunities" label="Find Opportunities" />
                            <QuickAction href="/profile" label="Update Profile" />
                            <QuickAction href="/my-schedule" label="View Schedule" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {role === 'organization' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <QuickAction href="/org/create" label="Create Event" />
                            <QuickAction href="/org/volunteers" label="Manage Volunteers" />
                            <QuickAction href="/org/settings" label="Organization Settings" />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

// Sub-components

function StatCard({
    label,
    value,
    icon: Icon,
    trend
}: {
    label: string
    value: string
    icon: React.ElementType
    trend?: string
}) {
    return (
        <Card>
            <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">{label}</p>
                        <p className="text-display text-2xl mt-1">{value}</p>
                        {trend && (
                            <p className="text-xs text-[hsl(var(--color-success))] mt-1">{trend}</p>
                        )}
                    </div>
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[hsl(var(--color-primary-50))] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[hsl(var(--color-primary-600))]" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function EventRow({
    title,
    organization,
    date,
    status
}: {
    title: string
    organization: string
    date: string
    status: 'confirmed' | 'pending' | 'waitlisted'
}) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] hover:bg-[hsl(var(--bg-secondary))] transition-colors">
            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[hsl(var(--color-primary-50))] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[hsl(var(--color-primary-600))]" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-[hsl(var(--text-primary))] truncate">{title}</p>
                <p className="text-sm text-[hsl(var(--text-secondary))] truncate">{organization}</p>
            </div>
            <div className="text-right shrink-0">
                <p className="text-sm text-[hsl(var(--text-secondary))]">{date}</p>
                <Badge
                    variant={status === 'confirmed' ? 'success' : status === 'pending' ? 'warning' : 'default'}
                    className="mt-1"
                >
                    {status}
                </Badge>
            </div>
        </div>
    )
}

function QuickAction({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-center p-4 rounded-[var(--radius-lg)] border border-[hsl(var(--border-default))] text-sm font-medium text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-secondary))] hover:border-[hsl(var(--border-strong))] transition-all"
        >
            {label}
        </Link>
    )
}
