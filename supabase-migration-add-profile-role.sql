-- Migration: Add role column to profiles table
-- Run this in Supabase SQL Editor

-- Create enum type for system roles
DO $$ BEGIN
    CREATE TYPE system_role AS ENUM ('owner', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add role column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role system_role DEFAULT 'member';

-- Update existing workspace owners to have 'owner' role
UPDATE profiles
SET role = 'owner'
WHERE id IN (SELECT owner_id FROM workspaces);

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
