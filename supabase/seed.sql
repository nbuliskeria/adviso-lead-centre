-- Sample data for development and testing

-- Note: User profiles will be created automatically when users sign up
-- For now, we'll create leads without user references to avoid foreign key issues

-- Insert sample leads
INSERT INTO leads (id, company_name, lead_owner, industry, lead_source, status, priority, potential_mrr, subscription_package, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440011', 'Acme Corporation', 'Demo User', 'Technology', 'Website', 'New Lead', 'high', 2500, 'Invoicing Pro', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440012', 'Global Solutions Inc', 'Demo User', 'Consulting', 'Referral', 'Qualified', 'medium', 5000, 'Invoicing Pro Max', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440013', 'StartupXYZ', 'Demo User', 'SaaS', 'LinkedIn', 'Won', 'high', 1200, 'Invoicing', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440014', 'TechFlow Ltd', 'Sarah Johnson', 'Software', 'Cold Call', 'Negotiating', 'medium', 3500, 'Invoicing Pro', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440015', 'InnovateCorp', 'Sarah Johnson', 'Manufacturing', 'Networking Event', 'Proposal Sent', 'low', 8000, 'Custom', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  industry = EXCLUDED.industry,
  lead_source = EXCLUDED.lead_source,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority,
  potential_mrr = EXCLUDED.potential_mrr,
  subscription_package = EXCLUDED.subscription_package,
  lead_owner_id = EXCLUDED.lead_owner_id,
  updated_at = EXCLUDED.updated_at;

-- Sample tasks and activities will be created when users sign up and interact with the system

-- Insert sample task templates for onboarding
INSERT INTO task_templates (id, name, description, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440041', 'Standard Client Onboarding', 'Standard onboarding process for new clients', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = EXCLUDED.updated_at;

-- Insert task template items
INSERT INTO task_template_items (id, template_id, title, description, category, priority, due_days, order_index, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440041', 'Welcome Call', 'Schedule and conduct welcome call with new client', 'Setup', 'High', 1, 1, NOW()),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440041', 'Account Setup', 'Create client account and configure initial settings', 'Setup', 'High', 2, 2, NOW()),
('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440041', 'Documentation Review', 'Review and approve client documentation', 'Documentation', 'Medium', 3, 3, NOW()),
('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440041', 'Training Session', 'Conduct platform training session', 'Training', 'Medium', 7, 4, NOW()),
('550e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440041', 'First Check-in', 'Schedule first check-in call', 'Follow-up', 'Low', 14, 5, NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  due_days = EXCLUDED.due_days,
  order_index = EXCLUDED.order_index;
