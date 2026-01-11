/**
 * Profile Page
 * 
 * Volunteer profile management page.
 */

import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from './profile-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import type { Profile } from '@/types/database.types'

interface RegistrationStats {
    status: string
    hours_logged: number
}

export const metadata = {
    title: 'Profile',
    description: 'Manage your volunteer profile',
}

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null // Layout will redirect
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Fetch user's stats
    const { data: regsData } = await supabase
        .from('registrations')
        .select('status, hours_logged')
        .eq('user_id', user.id)

    const registrations = (regsData || []) as RegistrationStats[]
    const totalHours = registrations.reduce((acc, r) => acc + (r.hours_logged || 0), 0)
    const completedEvents = registrations.filter(r => r.status === 'completed').length
    const upcomingEvents = registrations.filter(r => r.status === 'confirmed' || r.status === 'pending').length

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))]">
                    Your Profile
                </h1>
                <p className="text-[hsl(var(--text-secondary))] mt-1">
                    Manage your information and preferences
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-5 text-center">
                        <p className="text-display text-2xl">{totalHours}</p>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">Hours logged</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5 text-center">
                        <p className="text-display text-2xl">{completedEvents}</p>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">Events completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5 text-center">
                        <p className="text-display text-2xl">{upcomingEvents}</p>
                        <p className="text-sm text-[hsl(var(--text-secondary))]">Upcoming</p>
                    </CardContent>
                </Card>
            </div>

            {/* Profile form */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProfileForm profile={profile} />
                </CardContent>
            </Card>
        </div>
    )
}
