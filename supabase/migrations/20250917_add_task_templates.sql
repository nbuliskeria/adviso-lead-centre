-- Phase 7: Add Task Templates and Playbooks for Client Onboarding
-- This migration adds support for onboarding playbooks and task templates

-- Create Task Templates (Playbooks) Table
CREATE TABLE IF NOT EXISTS task_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create Task Template Items Table
CREATE TABLE IF NOT EXISTS task_template_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES public.task_templates(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_days INTEGER NOT NULL DEFAULT 1, -- Days from template application
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    category TEXT DEFAULT 'Setup' CHECK (category IN ('Setup', 'Customization', 'Training', 'Support', 'Integration', 'Migration', 'Testing', 'Documentation', 'Follow-up')),
    estimated_hours DECIMAL(5,2),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Clients Table (if not exists)
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    account_manager_id UUID REFERENCES public.user_profiles(id),
    business_id_number TEXT,
    original_lead_id UUID REFERENCES public.leads(id),
    client_status TEXT DEFAULT 'Active' CHECK (client_status IN ('Active', 'Onboarding', 'Inactive', 'Churned')),
    subscription_package TEXT,
    monthly_value DECIMAL(10,2),
    contract_start_date DATE,
    contract_end_date DATE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    tags JSONB DEFAULT '[]'::JSONB
);

-- Enable RLS (Row Level Security)
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_template_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Task Templates
CREATE POLICY "Allow read access to authenticated users" ON task_templates 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read access to authenticated users" ON task_template_items 
FOR SELECT USING (auth.role() = 'authenticated');

-- Create RLS Policies for Clients
CREATE POLICY "Allow full access to authenticated users" ON clients 
FOR ALL USING (auth.role() = 'authenticated');

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_template_items_template_id ON task_template_items(template_id);
CREATE INDEX IF NOT EXISTS idx_task_template_items_order ON task_template_items(template_id, order_index);
CREATE INDEX IF NOT EXISTS idx_clients_account_manager ON clients(account_manager_id);
CREATE INDEX IF NOT EXISTS idx_clients_original_lead ON clients(original_lead_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(client_status);

-- Insert sample onboarding playbook data
INSERT INTO task_templates (name, description, is_active) VALUES 
('Standard Client Onboarding Playbook', 'Complete onboarding process for new Adviso clients', TRUE),
('Enterprise Client Onboarding', 'Enhanced onboarding for enterprise-level clients', TRUE),
('Quick Start Onboarding', 'Streamlined onboarding for small business clients', TRUE)
ON CONFLICT DO NOTHING;

-- Get the template ID for Standard Client Onboarding Playbook
DO $$
DECLARE
    template_uuid UUID;
BEGIN
    SELECT id INTO template_uuid FROM task_templates WHERE name = 'Standard Client Onboarding Playbook' LIMIT 1;
    
    IF template_uuid IS NOT NULL THEN
        -- Insert sample task template items
        INSERT INTO task_template_items (template_id, title, description, due_days, priority, category, estimated_hours, order_index) VALUES
        (template_uuid, 'Welcome & Kick-off Call', 'Schedule and conduct initial welcome call with client', 1, 'High', 'Setup', 1.0, 1),
        (template_uuid, 'Grant System Access', 'Provide client with system credentials and initial access', 2, 'High', 'Setup', 0.5, 2),
        (template_uuid, 'Account Configuration', 'Configure client account settings and preferences', 3, 'Medium', 'Setup', 2.0, 3),
        (template_uuid, 'Data Migration Planning', 'Plan and schedule data migration from existing systems', 5, 'Medium', 'Migration', 3.0, 4),
        (template_uuid, 'Initial Training Session', 'Conduct first training session for key users', 7, 'High', 'Training', 2.0, 5),
        (template_uuid, 'Custom Integration Setup', 'Configure any required custom integrations', 10, 'Medium', 'Integration', 4.0, 6),
        (template_uuid, 'User Acceptance Testing', 'Guide client through UAT process', 14, 'Medium', 'Testing', 1.5, 7),
        (template_uuid, 'Go-Live Support', 'Provide support during go-live phase', 21, 'High', 'Support', 2.0, 8),
        (template_uuid, 'First Month Check-in', 'Schedule follow-up call to ensure satisfaction', 30, 'Medium', 'Follow-up', 1.0, 9)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
