# Supabase Database Schema for Plantheory

This document contains all the SQL commands needed to set up the Plantheory database in Supabase.

## Table of Contents
1. [Enable Extensions](#enable-extensions)
2. [Users & Profiles](#users--profiles)
3. [Workspaces](#workspaces)
4. [Playbooks](#playbooks)
5. [Steps](#steps)
6. [Tools](#tools)
7. [Templates](#templates)
8. [Team Members](#team-members)
9. [Row Level Security (RLS)](#row-level-security-rls)
10. [Storage Buckets](#storage-buckets)
11. [Functions & Triggers](#functions--triggers)

---

## Enable Extensions

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

## Users & Profiles

```sql
-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## Workspaces

```sql
-- Workspaces table
CREATE TABLE public.workspaces (
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

-- Enable RLS
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON public.workspaces(slug);
CREATE INDEX idx_workspaces_share_link ON public.workspaces(share_link);

-- Updated at trigger
CREATE TRIGGER workspaces_updated_at
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION public.generate_workspace_slug(workspace_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    base_slug := lower(regexp_replace(workspace_name, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    final_slug := base_slug;

    WHILE EXISTS (SELECT 1 FROM public.workspaces WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;

    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to generate share link
CREATE OR REPLACE FUNCTION public.generate_share_link()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

---

## Playbooks

```sql
-- Categories enum
CREATE TYPE playbook_category AS ENUM (
    'HR',
    'Operations',
    'Support',
    'Finance',
    'Marketing',
    'Sales',
    'Other'
);

-- Playbooks table
CREATE TABLE public.playbooks (
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

-- Enable RLS
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_playbooks_workspace ON public.playbooks(workspace_id);
CREATE INDEX idx_playbooks_owner ON public.playbooks(owner_id);
CREATE INDEX idx_playbooks_category ON public.playbooks(category);
CREATE INDEX idx_playbooks_title_search ON public.playbooks USING gin(title gin_trgm_ops);
CREATE INDEX idx_playbooks_is_template ON public.playbooks(is_template) WHERE is_template = true;

-- Updated at trigger
CREATE TRIGGER playbooks_updated_at
    BEFORE UPDATE ON public.playbooks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## Steps

```sql
-- Steps table
CREATE TABLE public.steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    playbook_id UUID REFERENCES public.playbooks(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_steps_playbook ON public.steps(playbook_id);
CREATE INDEX idx_steps_order ON public.steps(playbook_id, order_index);

-- Updated at trigger
CREATE TRIGGER steps_updated_at
    BEFORE UPDATE ON public.steps
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## Tools

```sql
-- Tools table (linked to steps)
CREATE TABLE public.tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    step_id UUID REFERENCES public.steps(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_tools_step ON public.tools(step_id);

-- Workspace tools directory (optional - for Phase 2)
CREATE TABLE public.workspace_tools (
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

-- Enable RLS
ALTER TABLE public.workspace_tools ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_workspace_tools_workspace ON public.workspace_tools(workspace_id);
```

---

## Templates

```sql
-- Global templates table (admin-managed)
CREATE TABLE public.templates (
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

-- Template steps
CREATE TABLE public.template_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    tools JSONB DEFAULT '[]'::jsonb
);

-- Indexes
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_industry ON public.templates(industry);
CREATE INDEX idx_templates_featured ON public.templates(is_featured) WHERE is_featured = true;
CREATE INDEX idx_template_steps_template ON public.template_steps(template_id);
```

---

## Team Members

```sql
-- Team member roles enum
CREATE TYPE team_role AS ENUM ('admin', 'editor', 'viewer');

-- Workspace members table
CREATE TABLE public.workspace_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role team_role DEFAULT 'viewer' NOT NULL,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(workspace_id, user_id)
);

-- Enable RLS
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON public.workspace_members(user_id);

-- Pending invitations table
CREATE TABLE public.workspace_invitations (
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

-- Enable RLS
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX idx_workspace_invitations_email ON public.workspace_invitations(email);
CREATE INDEX idx_workspace_invitations_token ON public.workspace_invitations(token);
```

---

## Row Level Security (RLS)

```sql
-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Workspaces policies
CREATE POLICY "Users can view workspaces they own or are members of"
    ON public.workspaces FOR SELECT
    USING (
        owner_id = auth.uid() OR
        id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create workspaces"
    ON public.workspaces FOR INSERT
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Workspace owners can update their workspaces"
    ON public.workspaces FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Workspace owners can delete their workspaces"
    ON public.workspaces FOR DELETE
    USING (owner_id = auth.uid());

-- Public workspace access (for sharing)
CREATE POLICY "Anyone can view shared workspaces"
    ON public.workspaces FOR SELECT
    USING (share_enabled = true AND share_link IS NOT NULL);

-- Playbooks policies
CREATE POLICY "Users can view playbooks in their workspaces"
    ON public.playbooks FOR SELECT
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces
            WHERE owner_id = auth.uid()
        ) OR
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins and editors can create playbooks"
    ON public.playbooks FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT id FROM public.workspaces
            WHERE owner_id = auth.uid()
        ) OR
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins and editors can update playbooks"
    ON public.playbooks FOR UPDATE
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces
            WHERE owner_id = auth.uid()
        ) OR
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
        )
    );

CREATE POLICY "Admins can delete playbooks"
    ON public.playbooks FOR DELETE
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces
            WHERE owner_id = auth.uid()
        ) OR
        workspace_id IN (
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Steps policies
CREATE POLICY "Users can view steps in accessible playbooks"
    ON public.steps FOR SELECT
    USING (
        playbook_id IN (
            SELECT id FROM public.playbooks
            WHERE workspace_id IN (
                SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
                UNION
                SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Admins and editors can manage steps"
    ON public.steps FOR ALL
    USING (
        playbook_id IN (
            SELECT id FROM public.playbooks
            WHERE workspace_id IN (
                SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
                UNION
                SELECT workspace_id FROM public.workspace_members
                WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
            )
        )
    );

-- Tools policies
CREATE POLICY "Users can view tools in accessible steps"
    ON public.tools FOR SELECT
    USING (
        step_id IN (
            SELECT id FROM public.steps
            WHERE playbook_id IN (
                SELECT id FROM public.playbooks
                WHERE workspace_id IN (
                    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
                    UNION
                    SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "Admins and editors can manage tools"
    ON public.tools FOR ALL
    USING (
        step_id IN (
            SELECT id FROM public.steps
            WHERE playbook_id IN (
                SELECT id FROM public.playbooks
                WHERE workspace_id IN (
                    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
                    UNION
                    SELECT workspace_id FROM public.workspace_members
                    WHERE user_id = auth.uid() AND role IN ('admin', 'editor')
                )
            )
        )
    );

-- Workspace members policies
CREATE POLICY "Users can view members of their workspaces"
    ON public.workspace_members FOR SELECT
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
            UNION
            SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage workspace members"
    ON public.workspace_members FOR ALL
    USING (
        workspace_id IN (
            SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
            UNION
            SELECT workspace_id FROM public.workspace_members
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

---

## Storage Buckets

```sql
-- Create storage buckets (run in Supabase dashboard or use API)

-- Avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Playbook images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('playbook-images', 'playbook-images', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Storage policies for playbook images
CREATE POLICY "Playbook images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'playbook-images');

CREATE POLICY "Authenticated users can upload playbook images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'playbook-images' AND
        auth.role() = 'authenticated'
    );
```

---

## Functions & Triggers

```sql
-- Function to get playbook with steps and tools
CREATE OR REPLACE FUNCTION public.get_playbook_with_details(playbook_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'id', p.id,
        'title', p.title,
        'description', p.description,
        'category', p.category,
        'owner', json_build_object(
            'id', pr.id,
            'name', pr.full_name,
            'email', pr.email
        ),
        'created_at', p.created_at,
        'updated_at', p.updated_at,
        'steps', (
            SELECT json_agg(
                json_build_object(
                    'id', s.id,
                    'title', s.title,
                    'description', s.description,
                    'order_index', s.order_index,
                    'tools', (
                        SELECT json_agg(
                            json_build_object(
                                'id', t.id,
                                'name', t.name,
                                'url', t.url
                            )
                        )
                        FROM public.tools t
                        WHERE t.step_id = s.id
                    )
                )
                ORDER BY s.order_index
            )
            FROM public.steps s
            WHERE s.playbook_id = p.id
        )
    ) INTO result
    FROM public.playbooks p
    LEFT JOIN public.profiles pr ON p.owner_id = pr.id
    WHERE p.id = playbook_uuid;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to duplicate a playbook (for templates)
CREATE OR REPLACE FUNCTION public.duplicate_playbook(
    source_playbook_id UUID,
    target_workspace_id UUID,
    new_title TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_playbook_id UUID;
    step_record RECORD;
    new_step_id UUID;
BEGIN
    -- Create new playbook
    INSERT INTO public.playbooks (workspace_id, title, description, category, owner_id, template_id)
    SELECT
        target_workspace_id,
        COALESCE(new_title, title || ' (Copy)'),
        description,
        category,
        auth.uid(),
        source_playbook_id
    FROM public.playbooks
    WHERE id = source_playbook_id
    RETURNING id INTO new_playbook_id;

    -- Copy steps and tools
    FOR step_record IN
        SELECT * FROM public.steps WHERE playbook_id = source_playbook_id ORDER BY order_index
    LOOP
        INSERT INTO public.steps (playbook_id, title, description, order_index)
        VALUES (new_playbook_id, step_record.title, step_record.description, step_record.order_index)
        RETURNING id INTO new_step_id;

        -- Copy tools for this step
        INSERT INTO public.tools (step_id, name, url, description)
        SELECT new_step_id, name, url, description
        FROM public.tools
        WHERE step_id = step_record.id;
    END LOOP;

    RETURN new_playbook_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search across workspace
CREATE OR REPLACE FUNCTION public.search_workspace(
    search_workspace_id UUID,
    search_query TEXT
)
RETURNS TABLE (
    result_type TEXT,
    result_id UUID,
    title TEXT,
    description TEXT,
    playbook_id UUID,
    playbook_title TEXT
) AS $$
BEGIN
    RETURN QUERY
    -- Search playbooks
    SELECT
        'playbook'::TEXT as result_type,
        p.id as result_id,
        p.title,
        p.description,
        p.id as playbook_id,
        p.title as playbook_title
    FROM public.playbooks p
    WHERE p.workspace_id = search_workspace_id
    AND (
        p.title ILIKE '%' || search_query || '%' OR
        p.description ILIKE '%' || search_query || '%'
    )

    UNION ALL

    -- Search steps
    SELECT
        'step'::TEXT as result_type,
        s.id as result_id,
        s.title,
        s.description,
        p.id as playbook_id,
        p.title as playbook_title
    FROM public.steps s
    JOIN public.playbooks p ON s.playbook_id = p.id
    WHERE p.workspace_id = search_workspace_id
    AND (
        s.title ILIKE '%' || search_query || '%' OR
        s.description ILIKE '%' || search_query || '%'
    )

    UNION ALL

    -- Search tools
    SELECT
        'tool'::TEXT as result_type,
        t.id as result_id,
        t.name as title,
        t.url as description,
        p.id as playbook_id,
        p.title as playbook_title
    FROM public.tools t
    JOIN public.steps s ON t.step_id = s.id
    JOIN public.playbooks p ON s.playbook_id = p.id
    WHERE p.workspace_id = search_workspace_id
    AND t.name ILIKE '%' || search_query || '%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment template usage count
CREATE OR REPLACE FUNCTION public.increment_template_usage(template_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.templates
    SET uses_count = uses_count + 1
    WHERE id = template_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update steps count in playbooks
CREATE OR REPLACE FUNCTION public.update_playbook_steps_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.playbooks
        SET updated_at = NOW()
        WHERE id = NEW.playbook_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.playbooks
        SET updated_at = NOW()
        WHERE id = OLD.playbook_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_playbook_on_step_change
    AFTER INSERT OR DELETE ON public.steps
    FOR EACH ROW EXECUTE FUNCTION public.update_playbook_steps_count();
```

---

## Seed Data (Templates)

```sql
-- Insert default templates
INSERT INTO public.templates (title, description, category, industry, steps_count, is_featured) VALUES
('Employee Onboarding Process', 'Comprehensive checklist for bringing new team members up to speed efficiently.', 'HR', 'All', 18, true),
('Customer Support Workflow', 'Standard operating procedures for handling customer inquiries professionally.', 'Support', 'All', 8, false),
('Restaurant Opening Checklist', 'Daily tasks for opening a restaurant including kitchen prep and safety checks.', 'Operations', 'Restaurant', 15, true),
('Restaurant Closing Procedures', 'End of day tasks including cleaning, cash reconciliation, and security.', 'Operations', 'Restaurant', 12, false),
('Client Onboarding Process', 'Guide for onboarding new clients including contracts and kickoff.', 'Sales', 'Agency', 14, false),
('Weekly Inventory Check', 'Process for conducting weekly inventory counts and reorder management.', 'Operations', 'Retail', 10, false),
('Monthly Financial Reporting', 'Checklist for preparing and distributing monthly financial reports.', 'Finance', 'All', 11, false),
('Social Media Content Publishing', 'Workflow for creating, reviewing, and publishing social media content.', 'Marketing', 'All', 7, false);

-- Insert template steps for Employee Onboarding
INSERT INTO public.template_steps (template_id, title, description, order_index, tools)
SELECT
    id,
    step_title,
    step_description,
    step_order,
    step_tools::jsonb
FROM public.templates,
LATERAL (VALUES
    ('Send Welcome Email', 'Send a personalized welcome email with first-day instructions.', 1, '[{"name": "Gmail", "url": "https://mail.google.com"}]'),
    ('Prepare Workstation', 'Set up desk with computer, monitor, and office supplies.', 2, '[]'),
    ('Create User Accounts', 'Set up email, Slack, and other tool access.', 3, '[{"name": "Google Admin", "url": "https://admin.google.com"}]'),
    ('Schedule Orientation', 'Book orientation meeting with HR and manager.', 4, '[{"name": "Google Calendar", "url": "https://calendar.google.com"}]'),
    ('Assign Onboarding Buddy', 'Pair with experienced team member for guidance.', 5, '[]'),
    ('Review Company Policies', 'Walk through policies, benefits, and procedures.', 6, '[]')
) AS steps(step_title, step_description, step_order, step_tools)
WHERE templates.title = 'Employee Onboarding Process';
```

---

## Quick Setup Commands

Copy and paste this entire block to set up everything at once:

```sql
-- Run all setup in order
-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create all tables and types (copy from sections above)
-- 3. Enable RLS on all tables
-- 4. Create all policies
-- 5. Create all functions and triggers
-- 6. Insert seed data
```

---

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Notes

1. **Run order matters**: Execute extensions first, then types, then tables, then RLS policies, then functions.
2. **Service role key**: Keep this secret and only use it server-side.
3. **RLS policies**: These ensure users can only access data they're authorized to see.
4. **Indexes**: Added for performance on common queries.
5. **Triggers**: Automatically handle timestamps and related updates.
