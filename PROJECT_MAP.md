# Safha - Project Architecture

A volunteer management platform built with Next.js 14, TypeScript, and Supabase.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database/Auth | Supabase |
| State | Zustand (client), TanStack Query (server) |
| Animation | Framer Motion |
| Icons | Lucide React |

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Auth group (login, signup)
│   │   ├── layout.tsx      # Centered auth layout
│   │   ├── login/          # Login page + form
│   │   └── signup/         # Signup page + form (role selection)
│   ├── (dashboard)/        # Protected dashboard group
│   │   ├── layout.tsx      # Dashboard shell with sidebar
│   │   └── dashboard/      # Main dashboard page
│   ├── globals.css         # Design system tokens & base styles
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   └── page.tsx            # Landing page (public)
├── components/
│   ├── layout/             # Navigation components
│   │   ├── sidebar.tsx     # Desktop sidebar (role-based)
│   │   └── mobile-nav.tsx  # Mobile bottom tab bar
│   └── ui/                 # Reusable UI primitives
│       ├── button.tsx      # Button with variants
│       ├── input.tsx       # Text input with label/error
│       ├── card.tsx        # Card components
│       ├── badge.tsx       # Status badges
│       └── index.ts        # Barrel export
├── lib/
│   ├── supabase/           # Supabase client instances
│   │   ├── client.ts       # Browser client (anon key)
│   │   ├── server.ts       # Server client (cookie-based)
│   │   └── admin.ts        # Admin client (service role)
│   └── utils.ts            # Helper functions (cn, formatters)
├── types/
│   └── database.types.ts   # Supabase table types
└── middleware.ts           # Auth middleware (session refresh)
```

## Key Files

- **`globals.css`** - Design tokens (colors, spacing, shadows, typography)
- **`middleware.ts`** - Protects routes, refreshes sessions
- **`database.types.ts`** - TypeScript types for all Supabase tables

## User Roles

| Role | Access |
|------|--------|
| `volunteer` | Browse opportunities, sign up, track hours |
| `organization` | Create opportunities, manage volunteers |
| `admin` | Full system access, user management |

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Public anon key
SUPABASE_SERVICE_ROLE_KEY=     # Private service key (server only)
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```
