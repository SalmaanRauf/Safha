/**
 * Database Type Definitions
 * 
 * Auto-generated types from Supabase schema. This file defines the shape of
 * all tables, views, and functions in the database for type-safe queries.
 * 
 * TODO: Replace with generated types once schema is applied to Supabase.
 * Run: `npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts`
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

/**
 * User roles in the system.
 * - volunteer: Standard users who participate in opportunities
 * - organization: Orgs that create and manage volunteer opportunities
 * - admin: System administrators with full access
 */
export type UserRole = 'volunteer' | 'organization' | 'admin'

/**
 * Status of a volunteer registration for an opportunity.
 */
export type RegistrationStatus = 'pending' | 'confirmed' | 'waitlisted' | 'cancelled' | 'completed'

/**
 * Frequency options for recurring opportunities.
 */
export type RecurrenceType = 'one-time' | 'daily' | 'weekly' | 'monthly'

export interface Database {
    public: {
        Tables: {
            // User profiles extending Supabase Auth
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: UserRole
                    phone: string | null
                    bio: string | null
                    skills: string[] | null
                    languages: string[] | null
                    availability: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: UserRole
                    phone?: string | null
                    bio?: string | null
                    skills?: string[] | null
                    languages?: string[] | null
                    availability?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: UserRole
                    phone?: string | null
                    bio?: string | null
                    skills?: string[] | null
                    languages?: string[] | null
                    availability?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            // Organizations that create opportunities
            organizations: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    logo_url: string | null
                    website: string | null
                    contact_email: string
                    address: string | null
                    city: string | null
                    is_verified: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    logo_url?: string | null
                    website?: string | null
                    contact_email: string
                    address?: string | null
                    city?: string | null
                    is_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    logo_url?: string | null
                    website?: string | null
                    contact_email?: string
                    address?: string | null
                    city?: string | null
                    is_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            // Links users to organizations (org admins/members)
            organization_members: {
                Row: {
                    id: string
                    user_id: string
                    organization_id: string
                    role: 'owner' | 'admin' | 'member'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    organization_id: string
                    role?: 'owner' | 'admin' | 'member'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    organization_id?: string
                    role?: 'owner' | 'admin' | 'member'
                    created_at?: string
                }
            }
            // Volunteer opportunities
            opportunities: {
                Row: {
                    id: string
                    organization_id: string
                    title: string
                    description: string
                    short_description: string | null
                    category: string
                    skills_needed: string[] | null
                    location_type: 'in-person' | 'remote' | 'hybrid'
                    address: string | null
                    city: string | null
                    start_date: string
                    end_date: string | null
                    recurrence: RecurrenceType
                    max_volunteers: number | null
                    current_volunteers: number
                    waitlist_enabled: boolean
                    status: 'draft' | 'published' | 'cancelled' | 'completed'
                    image_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    organization_id: string
                    title: string
                    description: string
                    short_description?: string | null
                    category: string
                    skills_needed?: string[] | null
                    location_type?: 'in-person' | 'remote' | 'hybrid'
                    address?: string | null
                    city?: string | null
                    start_date: string
                    end_date?: string | null
                    recurrence?: RecurrenceType
                    max_volunteers?: number | null
                    current_volunteers?: number
                    waitlist_enabled?: boolean
                    status?: 'draft' | 'published' | 'cancelled' | 'completed'
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    organization_id?: string
                    title?: string
                    description?: string
                    short_description?: string | null
                    category?: string
                    skills_needed?: string[] | null
                    location_type?: 'in-person' | 'remote' | 'hybrid'
                    address?: string | null
                    city?: string | null
                    start_date?: string
                    end_date?: string | null
                    recurrence?: RecurrenceType
                    max_volunteers?: number | null
                    current_volunteers?: number
                    waitlist_enabled?: boolean
                    status?: 'draft' | 'published' | 'cancelled' | 'completed'
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            // Volunteer registrations for opportunities
            registrations: {
                Row: {
                    id: string
                    user_id: string
                    opportunity_id: string
                    status: RegistrationStatus
                    hours_logged: number
                    notes: string | null
                    checked_in_at: string | null
                    checked_out_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    opportunity_id: string
                    status?: RegistrationStatus
                    hours_logged?: number
                    notes?: string | null
                    checked_in_at?: string | null
                    checked_out_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    opportunity_id?: string
                    status?: RegistrationStatus
                    hours_logged?: number
                    notes?: string | null
                    checked_in_at?: string | null
                    checked_out_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: UserRole
            registration_status: RegistrationStatus
            recurrence_type: RecurrenceType
        }
    }
}

// Convenience type exports for components
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Organization = Database['public']['Tables']['organizations']['Row']
export type Opportunity = Database['public']['Tables']['opportunities']['Row']
export type Registration = Database['public']['Tables']['registrations']['Row']
