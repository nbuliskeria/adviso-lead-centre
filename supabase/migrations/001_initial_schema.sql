-- Create user profiles table
CREATE TABLE user_profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  display_name text,
  company text,
  avatar_url text,
  department text,
  phone text,
  last_login_at timestamptz,
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['admin'::text, 'manager'::text, 'user'::text])),
  timezone text DEFAULT 'UTC'::text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Set up Row Level Security (RLS) for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Create leads table
CREATE TABLE leads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name text NOT NULL,
    lead_owner text NOT NULL,
    lead_owner_id uuid REFERENCES user_profiles(id),
    assigned_team_id uuid,
    industry text NOT NULL,
    status text DEFAULT 'New Lead'::text CHECK (status = ANY (ARRAY['New Lead'::text, 'Contacting'::text, 'Qualified'::text, 'Proposal Sent'::text, 'Negotiating'::text, 'Won'::text, 'Lost'::text, 'On Hold'::text])),
    lead_source text DEFAULT 'Website'::text CHECK (lead_source = ANY (ARRAY['Referral'::text, 'LinkedIn'::text, 'Website'::text, 'Cold Call'::text, 'Networking Event'::text, 'Other'::text])),
    potential_mrr numeric DEFAULT 0,
    customization_fee numeric DEFAULT 0,
    subscription_package text DEFAULT 'Invoicing'::text CHECK (subscription_package = ANY (ARRAY['Invoicing'::text, 'Invoicing Pro'::text, 'Invoicing Pro Max'::text, 'Custom'::text])),
    needs_customization boolean DEFAULT false,
    priority text DEFAULT 'medium'::text CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text])),
    customization_notes text,
    client_health text CHECK (client_health = ANY (ARRAY['Excellent'::text, 'Good'::text, 'At Risk'::text])),
    onboarding_info jsonb,
    created_by uuid REFERENCES user_profiles(id),
    tags jsonb DEFAULT '[]'::jsonb,
    contacts jsonb DEFAULT '[]'::jsonb,
    activity_log jsonb DEFAULT '[]'::jsonb,
    client_tasks jsonb DEFAULT '[]'::jsonb,
    last_activity_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Set up RLS for leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to authenticated users" ON leads FOR ALL USING (auth.role() = 'authenticated');

-- Create client_tasks table
CREATE TABLE client_tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES leads(id),
    task_id text UNIQUE NOT NULL,
    title text NOT NULL,
    description text,
    assignee text NOT NULL,
    assignee_id uuid REFERENCES user_profiles(id),
    due_date date,
    estimated_hours numeric,
    actual_hours numeric,
    notes text,
    created_by uuid REFERENCES user_profiles(id),
    status text DEFAULT 'To Do'::text CHECK (status = ANY (ARRAY['To Do'::text, 'In Progress'::text, 'Done'::text])),
    priority text DEFAULT 'medium'::text CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text])),
    category text DEFAULT 'General'::text CHECK (category = ANY (ARRAY['General'::text, 'Follow-up'::text, 'Onboarding'::text, 'Support'::text, 'Meeting'::text, 'Documentation'::text, 'Technical'::text, 'Review'::text])),
    tags jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Set up RLS for client_tasks
ALTER TABLE client_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to authenticated users" ON client_tasks FOR ALL USING (auth.role() = 'authenticated');

-- Create contacts table
CREATE TABLE contacts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES leads(id),
    name text NOT NULL,
    position text NOT NULL,
    email text NOT NULL,
    phone_number text NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Set up RLS for contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to authenticated users" ON contacts FOR ALL USING (auth.role() = 'authenticated');

-- Create activities table
CREATE TABLE activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id uuid REFERENCES leads(id),
    owner_id uuid REFERENCES user_profiles(id),
    type text NOT NULL,
    notes text NOT NULL,
    metadata jsonb,
    is_system_event boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Set up RLS for activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to authenticated users" ON activities FOR ALL USING (auth.role() = 'authenticated');

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'first_name', 'User'), COALESCE(new.raw_user_meta_data->>'last_name', 'Name'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
