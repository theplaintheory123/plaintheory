-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.playbooks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category USER-DEFINED DEFAULT 'Other'::playbook_category,
  owner_id uuid,
  is_template boolean DEFAULT false,
  template_id uuid,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT playbooks_pkey PRIMARY KEY (id),
  CONSTRAINT playbooks_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id),
  CONSTRAINT playbooks_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.playbooks(id),
  CONSTRAINT playbooks_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.steps (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  playbook_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT steps_pkey PRIMARY KEY (id),
  CONSTRAINT steps_playbook_id_fkey FOREIGN KEY (playbook_id) REFERENCES public.playbooks(id)
);
CREATE TABLE public.template_steps (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  template_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  tools jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT template_steps_pkey PRIMARY KEY (id),
  CONSTRAINT template_steps_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.templates(id)
);
CREATE TABLE public.templates (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  category USER-DEFINED DEFAULT 'Other'::playbook_category,
  industry text,
  steps_count integer DEFAULT 0,
  uses_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT templates_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  step_id uuid NOT NULL,
  name text NOT NULL,
  url text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tools_pkey PRIMARY KEY (id),
  CONSTRAINT tools_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.steps(id)
);
CREATE TABLE public.workspace_invitations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL,
  email text NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'viewer'::team_role,
  invited_by uuid,
  token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT workspace_invitations_pkey PRIMARY KEY (id),
  CONSTRAINT workspace_invitations_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT workspace_invitations_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.workspace_members (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role USER-DEFINED NOT NULL DEFAULT 'viewer'::team_role,
  invited_by uuid,
  invited_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  joined_at timestamp with time zone,
  CONSTRAINT workspace_members_pkey PRIMARY KEY (id),
  CONSTRAINT workspace_members_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT workspace_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT workspace_members_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.workspace_tools (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL,
  name text NOT NULL,
  url text,
  description text,
  category text,
  owner_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT workspace_tools_pkey PRIMARY KEY (id),
  CONSTRAINT workspace_tools_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.workspaces(id),
  CONSTRAINT workspace_tools_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.workspaces (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  industry text,
  team_size text,
  owner_id uuid NOT NULL,
  share_link text UNIQUE,
  share_pin text,
  share_enabled boolean DEFAULT false,
  invite_link text UNIQUE,
  invite_link_enabled boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT workspaces_pkey PRIMARY KEY (id),
  CONSTRAINT workspaces_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id)
);

-- Migration to add invite link columns (run this if table already exists):
-- ALTER TABLE public.workspaces ADD COLUMN invite_link text UNIQUE;
-- ALTER TABLE public.workspaces ADD COLUMN invite_link_enabled boolean DEFAULT false;