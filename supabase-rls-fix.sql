-- ============================================
-- COMPLETE RLS FIX FOR PLAINTHEORY
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Drop ALL existing policies to start fresh
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Step 2: Drop existing helper function if exists
DROP FUNCTION IF EXISTS public.user_has_workspace_access(uuid);
DROP FUNCTION IF EXISTS public.is_workspace_owner(uuid);

-- Step 3: Create helper functions with SECURITY DEFINER (bypasses RLS to prevent recursion)

-- Check if user owns a workspace
CREATE OR REPLACE FUNCTION public.is_workspace_owner(workspace_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces
    WHERE id = workspace_uuid AND owner_id = auth.uid()
  );
$$;

-- Check if user has access to workspace (owner OR member)
CREATE OR REPLACE FUNCTION public.user_has_workspace_access(workspace_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces WHERE id = workspace_uuid AND owner_id = auth.uid()
    UNION ALL
    SELECT 1 FROM workspace_members WHERE workspace_id = workspace_uuid AND user_id = auth.uid()
  );
$$;

-- Step 4: Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_steps ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- ============================================
-- WORKSPACES POLICIES
-- ============================================
CREATE POLICY "workspaces_select" ON public.workspaces
  FOR SELECT USING (
    owner_id = auth.uid() OR
    id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "workspaces_insert" ON public.workspaces
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspaces_update" ON public.workspaces
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "workspaces_delete" ON public.workspaces
  FOR DELETE USING (owner_id = auth.uid());

-- ============================================
-- WORKSPACE MEMBERS POLICIES (No recursion - direct checks only)
-- ============================================
CREATE POLICY "workspace_members_select" ON public.workspace_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    public.is_workspace_owner(workspace_id)
  );

CREATE POLICY "workspace_members_insert" ON public.workspace_members
  FOR INSERT WITH CHECK (public.is_workspace_owner(workspace_id));

CREATE POLICY "workspace_members_update" ON public.workspace_members
  FOR UPDATE USING (public.is_workspace_owner(workspace_id));

CREATE POLICY "workspace_members_delete" ON public.workspace_members
  FOR DELETE USING (public.is_workspace_owner(workspace_id));

-- ============================================
-- WORKSPACE INVITATIONS POLICIES
-- ============================================
CREATE POLICY "workspace_invitations_select" ON public.workspace_invitations
  FOR SELECT USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
    public.is_workspace_owner(workspace_id)
  );

CREATE POLICY "workspace_invitations_insert" ON public.workspace_invitations
  FOR INSERT WITH CHECK (public.is_workspace_owner(workspace_id));

CREATE POLICY "workspace_invitations_delete" ON public.workspace_invitations
  FOR DELETE USING (public.is_workspace_owner(workspace_id));

-- ============================================
-- WORKSPACE TOOLS POLICIES
-- ============================================
CREATE POLICY "workspace_tools_select" ON public.workspace_tools
  FOR SELECT USING (public.user_has_workspace_access(workspace_id));

CREATE POLICY "workspace_tools_insert" ON public.workspace_tools
  FOR INSERT WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "workspace_tools_update" ON public.workspace_tools
  FOR UPDATE USING (public.user_has_workspace_access(workspace_id));

CREATE POLICY "workspace_tools_delete" ON public.workspace_tools
  FOR DELETE USING (public.user_has_workspace_access(workspace_id));

-- ============================================
-- PLAYBOOKS POLICIES
-- ============================================
CREATE POLICY "playbooks_select" ON public.playbooks
  FOR SELECT USING (public.user_has_workspace_access(workspace_id));

CREATE POLICY "playbooks_insert" ON public.playbooks
  FOR INSERT WITH CHECK (public.user_has_workspace_access(workspace_id));

CREATE POLICY "playbooks_update" ON public.playbooks
  FOR UPDATE USING (public.user_has_workspace_access(workspace_id));

CREATE POLICY "playbooks_delete" ON public.playbooks
  FOR DELETE USING (public.user_has_workspace_access(workspace_id));

-- ============================================
-- STEPS POLICIES
-- ============================================
CREATE POLICY "steps_select" ON public.steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM playbooks p
      WHERE p.id = playbook_id AND public.user_has_workspace_access(p.workspace_id)
    )
  );

CREATE POLICY "steps_insert" ON public.steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM playbooks p
      WHERE p.id = playbook_id AND public.user_has_workspace_access(p.workspace_id)
    )
  );

CREATE POLICY "steps_update" ON public.steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM playbooks p
      WHERE p.id = playbook_id AND public.user_has_workspace_access(p.workspace_id)
    )
  );

CREATE POLICY "steps_delete" ON public.steps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM playbooks p
      WHERE p.id = playbook_id AND public.user_has_workspace_access(p.workspace_id)
    )
  );

-- ============================================
-- TOOLS POLICIES (tools linked to steps)
-- ============================================
CREATE POLICY "tools_select" ON public.tools
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM steps s
      JOIN playbooks p ON p.id = s.playbook_id
      WHERE s.id = step_id AND public.user_has_workspace_access(p.workspace_id)
    )
  );

CREATE POLICY "tools_insert" ON public.tools
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM steps s
      JOIN playbooks p ON p.id = s.playbook_id
      WHERE s.id = step_id AND public.user_has_workspace_access(p.workspace_id)
    )
  );

CREATE POLICY "tools_update" ON public.tools
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM steps s
      JOIN playbooks p ON p.id = s.playbook_id
      WHERE s.id = step_id AND public.user_has_workspace_access(p.workspace_id)
    )
  );

CREATE POLICY "tools_delete" ON public.tools
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM steps s
      JOIN playbooks p ON p.id = s.playbook_id
      WHERE s.id = step_id AND public.user_has_workspace_access(p.workspace_id)
    )
  );

-- ============================================
-- TEMPLATES POLICIES (public read, admin write)
-- ============================================
CREATE POLICY "templates_select_all" ON public.templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "templates_insert_admin" ON public.templates
  FOR INSERT WITH CHECK (false); -- Only via service role

CREATE POLICY "templates_update_admin" ON public.templates
  FOR UPDATE USING (false); -- Only via service role

-- ============================================
-- TEMPLATE STEPS POLICIES (public read)
-- ============================================
CREATE POLICY "template_steps_select" ON public.template_steps
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM templates t WHERE t.id = template_id AND t.is_active = true)
  );

CREATE POLICY "template_steps_insert_admin" ON public.template_steps
  FOR INSERT WITH CHECK (false); -- Only via service role

-- ============================================
-- GRANT EXECUTE on functions to authenticated users
-- ============================================
GRANT EXECUTE ON FUNCTION public.is_workspace_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_workspace_access(uuid) TO authenticated;

-- ============================================
-- DONE! Test by creating a playbook
-- ============================================
