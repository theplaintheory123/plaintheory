-- ============================================================
-- Plantheory Database Schema for Supabase
-- Copy and paste this entire file into the Supabase SQL Editor
-- ============================================================

-- ============ EXTENSIONS ============
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============ TYPES ============
DO $$ BEGIN
    CREATE TYPE playbook_category AS ENUM ('HR', 'Operations', 'Support', 'Finance', 'Marketing', 'Sales', 'Other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE team_role AS ENUM ('admin', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============ TABLES ============

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Workspaces table
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    industry TEXT,
    team_size TEXT,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    share_link TEXT UNIQUE,
    share_pin TEXT,
    share_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Playbooks table
CREATE TABLE IF NOT EXISTS public.playbooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category playbook_category DEFAULT 'Other',
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_template BOOLEAN DEFAULT false,
    template_id UUID REFERENCES public.playbooks(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Steps table
CREATE TABLE IF NOT EXISTS public.steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    playbook_id UUID REFERENCES public.playbooks(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tools table
CREATE TABLE IF NOT EXISTS public.tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    step_id UUID REFERENCES public.steps(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Templates table (admin-managed global templates)
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category playbook_category DEFAULT 'Other',
    industry TEXT,
    steps_count INTEGER DEFAULT 0,
    uses_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Template steps table
CREATE TABLE IF NOT EXISTS public.template_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    tools JSONB DEFAULT '[]'::jsonb
);

-- Workspace members table
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role team_role DEFAULT 'viewer' NOT NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(workspace_id, user_id)
);

-- Workspace invitations table
CREATE TABLE IF NOT EXISTS public.workspace_invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role team_role DEFAULT 'viewer' NOT NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(workspace_id, email)
);

-- Workspace tools directory (optional)
CREATE TABLE IF NOT EXISTS public.workspace_tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT,
    description TEXT,
    category TEXT,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON public.workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_workspaces_share_link ON public.workspaces(share_link);
CREATE INDEX IF NOT EXISTS idx_playbooks_workspace ON public.playbooks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_playbooks_owner ON public.playbooks(owner_id);
CREATE INDEX IF NOT EXISTS idx_playbooks_category ON public.playbooks(category);
CREATE INDEX IF NOT EXISTS idx_playbooks_title_search ON public.playbooks USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_playbooks_is_template ON public.playbooks(is_template) WHERE is_template = true;
CREATE INDEX IF NOT EXISTS idx_steps_playbook ON public.steps(playbook_id);
CREATE INDEX IF NOT EXISTS idx_steps_order ON public.steps(playbook_id, order_index);
CREATE INDEX IF NOT EXISTS idx_tools_step ON public.tools(step_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_industry ON public.templates(industry);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON public.templates(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_template_steps_template ON public.template_steps(template_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_email ON public.workspace_invitations(email);
CREATE INDEX IF NOT EXISTS idx_workspace_invitations_token ON public.workspace_invitations(token);
CREATE INDEX IF NOT EXISTS idx_workspace_tools_workspace ON public.workspace_tools(workspace_id);

-- ============ FUNCTIONS & TRIGGERS ============

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS workspaces_updated_at ON public.workspaces;
CREATE TRIGGER workspaces_updated_at
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS playbooks_updated_at ON public.playbooks;
CREATE TRIGGER playbooks_updated_at
    BEFORE UPDATE ON public.playbooks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS steps_updated_at ON public.steps;
CREATE TRIGGER steps_updated_at
    BEFORE UPDATE ON public.steps
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ ROW LEVEL SECURITY ============

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_tools ENABLE ROW LEVEL SECURITY;

-- ============ HELPER FUNCTIONS FOR RLS ============
-- These functions use SECURITY DEFINER to bypass RLS and avoid recursion

-- Check if user is owner of workspace
CREATE OR REPLACE FUNCTION public.is_workspace_owner(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE id = workspace_uuid AND owner_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user is member of workspace (any role)
CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = workspace_uuid AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user has admin/editor access to workspace
CREATE OR REPLACE FUNCTION public.has_workspace_edit_access(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.workspaces WHERE id = workspace_uuid AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = workspace_uuid AND user_id = auth.uid() AND role IN ('admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if user has admin access to workspace
CREATE OR REPLACE FUNCTION public.has_workspace_admin_access(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.workspaces WHERE id = workspace_uuid AND owner_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = workspace_uuid AND user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if workspace is shared
CREATE OR REPLACE FUNCTION public.is_workspace_shared(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.workspaces
        WHERE id = workspace_uuid AND share_enabled = true AND share_link IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Get user's workspace IDs (owned + member)
CREATE OR REPLACE FUNCTION public.get_user_workspace_ids()
RETURNS SETOF UUID AS $$
BEGIN
    RETURN QUERY
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    UNION
    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view profiles of workspace members" ON public.profiles;
CREATE POLICY "Users can view profiles of workspace members"
    ON public.profiles FOR SELECT
    USING (
        id IN (
            SELECT owner_id FROM public.workspaces WHERE id IN (SELECT public.get_user_workspace_ids())
            UNION
            SELECT user_id FROM public.workspace_members WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
        )
    );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- Workspaces policies
DROP POLICY IF EXISTS "Users can view their own workspaces" ON public.workspaces;
CREATE POLICY "Users can view their own workspaces"
    ON public.workspaces FOR SELECT
    USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON public.workspaces;
CREATE POLICY "Users can view workspaces they are members of"
    ON public.workspaces FOR SELECT
    USING (public.is_workspace_member(id));

DROP POLICY IF EXISTS "Anyone can view shared workspaces" ON public.workspaces;
CREATE POLICY "Anyone can view shared workspaces"
    ON public.workspaces FOR SELECT
    USING (share_enabled = true AND share_link IS NOT NULL);

DROP POLICY IF EXISTS "Users can create workspaces" ON public.workspaces;
CREATE POLICY "Users can create workspaces"
    ON public.workspaces FOR INSERT
    WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Workspace owners can update their workspaces" ON public.workspaces;
CREATE POLICY "Workspace owners can update their workspaces"
    ON public.workspaces FOR UPDATE
    USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Workspace owners can delete their workspaces" ON public.workspaces;
CREATE POLICY "Workspace owners can delete their workspaces"
    ON public.workspaces FOR DELETE
    USING (owner_id = auth.uid());

-- Playbooks policies
DROP POLICY IF EXISTS "Users can view playbooks in their workspaces" ON public.playbooks;
CREATE POLICY "Users can view playbooks in their workspaces"
    ON public.playbooks FOR SELECT
    USING (workspace_id IN (SELECT public.get_user_workspace_ids()));

DROP POLICY IF EXISTS "Anyone can view playbooks in shared workspaces" ON public.playbooks;
CREATE POLICY "Anyone can view playbooks in shared workspaces"
    ON public.playbooks FOR SELECT
    USING (public.is_workspace_shared(workspace_id));

DROP POLICY IF EXISTS "Admins and editors can create playbooks" ON public.playbooks;
CREATE POLICY "Admins and editors can create playbooks"
    ON public.playbooks FOR INSERT
    WITH CHECK (public.has_workspace_edit_access(workspace_id));

DROP POLICY IF EXISTS "Admins and editors can update playbooks" ON public.playbooks;
CREATE POLICY "Admins and editors can update playbooks"
    ON public.playbooks FOR UPDATE
    USING (public.has_workspace_edit_access(workspace_id));

DROP POLICY IF EXISTS "Admins can delete playbooks" ON public.playbooks;
CREATE POLICY "Admins can delete playbooks"
    ON public.playbooks FOR DELETE
    USING (public.has_workspace_admin_access(workspace_id));

-- Steps policies
DROP POLICY IF EXISTS "Users can view steps in accessible playbooks" ON public.steps;
CREATE POLICY "Users can view steps in accessible playbooks"
    ON public.steps FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.playbooks p
            WHERE p.id = playbook_id
            AND (p.workspace_id IN (SELECT public.get_user_workspace_ids()) OR public.is_workspace_shared(p.workspace_id))
        )
    );

DROP POLICY IF EXISTS "Admins and editors can insert steps" ON public.steps;
CREATE POLICY "Admins and editors can insert steps"
    ON public.steps FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.playbooks p
            WHERE p.id = playbook_id AND public.has_workspace_edit_access(p.workspace_id)
        )
    );

DROP POLICY IF EXISTS "Admins and editors can update steps" ON public.steps;
CREATE POLICY "Admins and editors can update steps"
    ON public.steps FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.playbooks p
            WHERE p.id = playbook_id AND public.has_workspace_edit_access(p.workspace_id)
        )
    );

DROP POLICY IF EXISTS "Admins and editors can delete steps" ON public.steps;
CREATE POLICY "Admins and editors can delete steps"
    ON public.steps FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.playbooks p
            WHERE p.id = playbook_id AND public.has_workspace_edit_access(p.workspace_id)
        )
    );

-- Tools policies
DROP POLICY IF EXISTS "Users can view tools in accessible steps" ON public.tools;
CREATE POLICY "Users can view tools in accessible steps"
    ON public.tools FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.steps s
            JOIN public.playbooks p ON p.id = s.playbook_id
            WHERE s.id = step_id
            AND (p.workspace_id IN (SELECT public.get_user_workspace_ids()) OR public.is_workspace_shared(p.workspace_id))
        )
    );

DROP POLICY IF EXISTS "Admins and editors can insert tools" ON public.tools;
CREATE POLICY "Admins and editors can insert tools"
    ON public.tools FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.steps s
            JOIN public.playbooks p ON p.id = s.playbook_id
            WHERE s.id = step_id AND public.has_workspace_edit_access(p.workspace_id)
        )
    );

DROP POLICY IF EXISTS "Admins and editors can update tools" ON public.tools;
CREATE POLICY "Admins and editors can update tools"
    ON public.tools FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.steps s
            JOIN public.playbooks p ON p.id = s.playbook_id
            WHERE s.id = step_id AND public.has_workspace_edit_access(p.workspace_id)
        )
    );

DROP POLICY IF EXISTS "Admins and editors can delete tools" ON public.tools;
CREATE POLICY "Admins and editors can delete tools"
    ON public.tools FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.steps s
            JOIN public.playbooks p ON p.id = s.playbook_id
            WHERE s.id = step_id AND public.has_workspace_edit_access(p.workspace_id)
        )
    );

-- Workspace members policies
DROP POLICY IF EXISTS "Users can view members of owned workspaces" ON public.workspace_members;
CREATE POLICY "Users can view members of owned workspaces"
    ON public.workspace_members FOR SELECT
    USING (public.is_workspace_owner(workspace_id));

DROP POLICY IF EXISTS "Users can view their own membership" ON public.workspace_members;
CREATE POLICY "Users can view their own membership"
    ON public.workspace_members FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage workspace members" ON public.workspace_members;
CREATE POLICY "Admins can manage workspace members"
    ON public.workspace_members FOR ALL
    USING (public.has_workspace_admin_access(workspace_id));

-- ============ SEED DATA: TEMPLATES ============
INSERT INTO public.templates (title, description, category, industry, steps_count, is_featured, uses_count) VALUES
('Employee Onboarding Process', 'Comprehensive checklist for bringing new team members up to speed efficiently.', 'HR', 'All', 6, true, 567),
('Customer Support Workflow', 'Standard operating procedures for handling customer inquiries professionally.', 'Support', 'All', 8, false, 423),
('Restaurant Opening Checklist', 'Daily tasks for opening a restaurant including kitchen prep and safety checks.', 'Operations', 'Restaurant', 15, true, 234),
('Restaurant Closing Procedures', 'End of day tasks including cleaning, cash reconciliation, and security.', 'Operations', 'Restaurant', 12, false, 189),
('Client Onboarding Process', 'Guide for onboarding new clients including contracts and kickoff.', 'Sales', 'Agency', 14, false, 278),
('Weekly Inventory Check', 'Process for conducting weekly inventory counts and reorder management.', 'Operations', 'Retail', 10, false, 312),
('Monthly Financial Reporting', 'Checklist for preparing and distributing monthly financial reports.', 'Finance', 'All', 11, false, 198),
('Social Media Content Publishing', 'Workflow for creating, reviewing, and publishing social media content.', 'Marketing', 'All', 7, false, 156)
ON CONFLICT DO NOTHING;

-- Insert template steps for Employee Onboarding
INSERT INTO public.template_steps (template_id, title, description, order_index, tools)
SELECT
    t.id,
    s.title,
    s.description,
    s.order_index,
    s.tools::jsonb
FROM public.templates t
CROSS JOIN (VALUES
    ('Send Welcome Email', 'Send a personalized welcome email with first-day instructions.', 1, '[{"name": "Gmail", "url": "https://mail.google.com"}]'),
    ('Prepare Workstation', 'Set up desk with computer, monitor, and office supplies.', 2, '[]'),
    ('Create User Accounts', 'Set up email, Slack, and other tool access.', 3, '[{"name": "Google Admin", "url": "https://admin.google.com"}]'),
    ('Schedule Orientation', 'Book orientation meeting with HR and manager.', 4, '[{"name": "Google Calendar", "url": "https://calendar.google.com"}]'),
    ('Assign Onboarding Buddy', 'Pair with experienced team member for guidance.', 5, '[]'),
    ('Review Company Policies', 'Walk through policies, benefits, and procedures.', 6, '[]')
) AS s(title, description, order_index, tools)
WHERE t.title = 'Employee Onboarding Process'
ON CONFLICT DO NOTHING;

-- ============ STORAGE BUCKETS ============
-- Note: Run these separately in the Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('playbook-images', 'playbook-images', true);

-- ============ COMPLETE ============
-- Schema setup complete! Your Plantheory database is ready to use.
