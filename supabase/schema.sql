-- =============================================
-- SAFHA DATABASE SCHEMA (Fixed Order)
-- =============================================
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE user_role AS ENUM ('volunteer', 'organization', 'admin');
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'waitlisted', 'cancelled', 'completed');
CREATE TYPE recurrence_type AS ENUM ('one-time', 'daily', 'weekly', 'monthly');
CREATE TYPE location_type AS ENUM ('in-person', 'remote', 'hybrid');
CREATE TYPE opportunity_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE org_member_role AS ENUM ('owner', 'admin', 'member');

-- =============================================
-- TABLES (Create all tables first, no policies yet)
-- =============================================

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'volunteer',
  phone TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email TEXT NOT NULL,
  address TEXT,
  city TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Members (links users to orgs)
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role org_member_role DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Opportunities
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  skills_needed TEXT[] DEFAULT '{}',
  location_type location_type DEFAULT 'in-person',
  address TEXT,
  city TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  recurrence recurrence_type DEFAULT 'one-time',
  max_volunteers INTEGER,
  current_volunteers INTEGER DEFAULT 0,
  waitlist_enabled BOOLEAN DEFAULT false,
  status opportunity_status DEFAULT 'draft',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  status registration_status DEFAULT 'pending',
  hours_logged DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  checked_in_at TIMESTAMPTZ,
  checked_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES (Now all tables exist)
-- =============================================

-- PROFILES policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ORGANIZATIONS policies
CREATE POLICY "orgs_select" ON organizations FOR SELECT USING (true);
CREATE POLICY "orgs_insert" ON organizations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "orgs_update" ON organizations FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = organizations.id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  )
);

-- ORGANIZATION_MEMBERS policies
CREATE POLICY "org_members_select_own" ON organization_members FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "org_members_select_admin" ON organization_members FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );
CREATE POLICY "org_members_insert" ON organization_members FOR INSERT 
  WITH CHECK (
    -- Allow if user is owner OR if no members exist yet (first member becomes owner)
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'owner'
    )
    OR NOT EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
    )
  );

-- OPPORTUNITIES policies
CREATE POLICY "opps_select" ON opportunities FOR SELECT 
  USING (
    status = 'published' 
    OR EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = opportunities.organization_id
      AND user_id = auth.uid()
    )
  );
CREATE POLICY "opps_insert" ON opportunities FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = opportunities.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
CREATE POLICY "opps_update" ON opportunities FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = opportunities.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
CREATE POLICY "opps_delete" ON opportunities FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = opportunities.organization_id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- REGISTRATIONS policies
CREATE POLICY "regs_select_own" ON registrations FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "regs_select_org" ON registrations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM opportunities o
      JOIN organization_members om ON om.organization_id = o.organization_id
      WHERE o.id = registrations.opportunity_id
      AND om.user_id = auth.uid()
    )
  );
CREATE POLICY "regs_insert" ON registrations FOR INSERT 
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "regs_update_own" ON registrations FOR UPDATE 
  USING (user_id = auth.uid());
CREATE POLICY "regs_update_org" ON registrations FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM opportunities o
      JOIN organization_members om ON om.organization_id = o.organization_id
      WHERE o.id = registrations.opportunity_id
      AND om.user_id = auth.uid()
    )
  );

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'volunteer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_opportunities_org ON opportunities(organization_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_start_date ON opportunities(start_date);
CREATE INDEX idx_registrations_user ON registrations(user_id);
CREATE INDEX idx_registrations_opportunity ON registrations(opportunity_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_org_members_org ON organization_members(organization_id);

-- =============================================
-- DONE!
-- =============================================
