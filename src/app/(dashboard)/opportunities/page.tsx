/**
 * Opportunities Browser Page
 * 
 * Main page for volunteers to discover and browse volunteer opportunities.
 * Features filtering, search, and beautiful opportunity cards.
 */

import { createClient } from '@/lib/supabase/server'
import { OpportunityFilters } from './opportunity-filters'
import { OpportunityGrid } from './opportunity-grid'

export const metadata = {
    title: 'Browse Opportunities',
    description: 'Discover volunteer opportunities that match your interests',
}

// Categories for filtering
const CATEGORIES = [
    'All',
    'Environment',
    'Education',
    'Health',
    'Food & Hunger',
    'Animals',
    'Arts & Culture',
    'Community',
    'Seniors',
    'Youth',
    'Disaster Relief',
]

interface SearchParams {
    category?: string
    location?: string
    search?: string
}

export default async function OpportunitiesPage({
    searchParams,
}: {
    searchParams: SearchParams
}) {
    const supabase = await createClient()

    // Build query with filters
    let query = supabase
        .from('opportunities')
        .select(`
      *,
      organizations (
        id,
        name,
        logo_url,
        is_verified
      )
    `)
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })

    // Apply category filter
    if (searchParams.category && searchParams.category !== 'All') {
        query = query.eq('category', searchParams.category)
    }

    // Apply location filter
    if (searchParams.location) {
        query = query.eq('location_type', searchParams.location)
    }

    // Apply search filter
    if (searchParams.search) {
        query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
    }

    const { data: opportunities, error } = await query.limit(20)

    if (error) {
        console.error('Error fetching opportunities:', error)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))]">
                    Discover Opportunities
                </h1>
                <p className="text-[hsl(var(--text-secondary))] mt-1">
                    Find meaningful ways to contribute to your community
                </p>
            </div>

            {/* Filters */}
            <OpportunityFilters
                categories={CATEGORIES}
                currentCategory={searchParams.category}
                currentLocation={searchParams.location}
                currentSearch={searchParams.search}
            />

            {/* Results */}
            <OpportunityGrid opportunities={opportunities || []} />
        </div>
    )
}
