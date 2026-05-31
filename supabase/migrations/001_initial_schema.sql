-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Organizations table
CREATE TABLE public.organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('School', 'Nonprofit', 'Business')),
  school_district TEXT,        -- conditional: only for School
  nonprofit_ein TEXT,          -- conditional: only for Nonprofit
  business_registration TEXT,  -- conditional: only for Business
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Organization members table
CREATE TABLE public.organization_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'active')),
  role TEXT DEFAULT 'member',
  invited_at TIMESTAMPTZ DEFAULT now(),
  joined_at TIMESTAMPTZ,
  UNIQUE(organization_id, email)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Organizations: admins can only CRUD their own orgs
CREATE POLICY "Admins can view own organizations"
  ON public.organizations FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can insert organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update own organizations"
  ON public.organizations FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete own organizations"
  ON public.organizations FOR DELETE
  USING (auth.uid() = created_by);

-- Members: org admins can manage members of their own orgs
CREATE POLICY "Admins can view members of own orgs"
  ON public.organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE id = organization_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Admins can insert members to own orgs"
  ON public.organization_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizations
      WHERE id = organization_id AND created_by = auth.uid()
    )
  );

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, is_admin)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', true);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();