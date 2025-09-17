-- Migration: Add onboarding fields to clients table
-- Created: 2025-09-17
-- Description: Adds onboarding information fields for client setup process

-- Add onboarding columns to clients table (onboarding_completed fields already exist)
ALTER TABLE public.clients
ADD COLUMN rs_username TEXT,
ADD COLUMN rs_password TEXT, -- Security Warning: For production, use Supabase Vault
ADD COLUMN user_emails JSONB DEFAULT '[]'::jsonb,
ADD COLUMN bank_details JSONB DEFAULT '[]'::jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.clients.rs_username IS 'RS.GE username for government integration';
COMMENT ON COLUMN public.clients.rs_password IS 'RS.GE password - WARNING: Use Supabase Vault in production';
COMMENT ON COLUMN public.clients.user_emails IS 'Array of user email objects: [{"email": "user@example.com"}]';
COMMENT ON COLUMN public.clients.bank_details IS 'Array of bank account objects: [{"bankName": "Bank", "iban": "GE...", "clientId": "...", "clientSecret": "..."}]';
COMMENT ON COLUMN public.clients.onboarding_completed IS 'Flag indicating if onboarding process is complete';
COMMENT ON COLUMN public.clients.onboarding_completed_at IS 'Timestamp when onboarding was completed';

-- Create index for onboarding queries
CREATE INDEX idx_clients_onboarding_status ON public.clients(onboarding_completed);

-- Update RLS policies to include new fields
-- (Inherits existing RLS policies from clients table)
