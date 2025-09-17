// src/lib/constants.ts
import type { Database } from './database.types';

// Extract types from generated schema
type LeadStatus = Database['public']['Tables']['leads']['Row']['status'];
type LeadSource = Database['public']['Tables']['leads']['Row']['lead_source'];
type LeadPriority = Database['public']['Tables']['leads']['Row']['priority'];
type ClientHealth = Database['public']['Tables']['leads']['Row']['client_health'];
type TaskStatus = Database['public']['Tables']['client_tasks']['Row']['status'];
type TaskPriority = Database['public']['Tables']['client_tasks']['Row']['priority'];
type TaskCategory = Database['public']['Tables']['client_tasks']['Row']['category'];

// Lead Status Options (must match database constraint)
export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'New Lead', label: 'New Lead', color: 'blue' },
  { value: 'Contacting', label: 'Contacting', color: 'blue' },
  { value: 'Qualified', label: 'Qualified', color: 'green' },
  { value: 'Proposal Sent', label: 'Proposal Sent', color: 'yellow' },
  { value: 'Negotiating', label: 'Negotiating', color: 'orange' },
  { value: 'Won', label: 'Won', color: 'emerald' },
  { value: 'Lost', label: 'Lost', color: 'red' },
  { value: 'On Hold', label: 'On Hold', color: 'gray' },
];

// Lead Source Options (must match database constraint)
export const LEAD_SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'Referral', label: 'Referral' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Website', label: 'Website' },
  { value: 'Cold Call', label: 'Cold Call' },
  { value: 'Networking Event', label: 'Networking Event' },
  { value: 'Other', label: 'Other' },
];

// Lead Priority Options (must match database constraint)
export const LEAD_PRIORITY_OPTIONS: { value: LeadPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' },
];

// Client Health Options
export const CLIENT_HEALTH_OPTIONS: { value: ClientHealth; label: string; color: string }[] = [
  { value: 'Excellent', label: 'Excellent', color: 'emerald' },
  { value: 'Good', label: 'Good', color: 'green' },
  { value: 'Fair', label: 'Fair', color: 'yellow' },
  { value: 'Poor', label: 'Poor', color: 'orange' },
  { value: 'Critical', label: 'Critical', color: 'red' },
];

// Task Status Options (must match database constraint)
export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'To Do', label: 'To Do', color: 'gray' },
  { value: 'In Progress', label: 'In Progress', color: 'blue' },
  { value: 'Done', label: 'Done', color: 'green' },
];

// Task Priority Options (must match database constraint)
export const TASK_PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' },
];

// Task Category Options (must match database constraint)
export const TASK_CATEGORY_OPTIONS: { value: TaskCategory; label: string }[] = [
  { value: 'General', label: 'General' },
  { value: 'Follow-up', label: 'Follow-up' },
  { value: 'Onboarding', label: 'Onboarding' },
  { value: 'Support', label: 'Support' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Review', label: 'Review' },
];

// Industry Options (for leads)
export const INDUSTRY_OPTIONS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Consulting',
  'Marketing',
  'Legal',
  'Non-profit',
  'Government',
  'Other',
];

// Subscription Package Options
export const SUBSCRIPTION_PACKAGE_OPTIONS = [
  'Starter',
  'Professional',
  'Enterprise',
  'Custom',
];

// Client Status Options
export const CLIENT_STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'Active', label: 'Active', color: 'green' },
  { value: 'Onboarding', label: 'Onboarding', color: 'blue' },
  { value: 'Inactive', label: 'Inactive', color: 'gray' },
  { value: 'Churned', label: 'Churned', color: 'red' },
];

// Query Keys for React Query
export const QUERY_KEYS = {
  LEADS: ['leads'] as const,
  LEAD: (id: string) => ['leads', id] as const,
  CLIENTS: ['clients'] as const,
  CLIENT: (id: string) => ['clients', id] as const,
  TASKS: ['tasks'] as const,
  TASK: (id: string) => ['tasks', id] as const,
  USERS: ['users'] as const,
  USER: (id: string) => ['users', id] as const,
  ACTIVITIES: ['activities'] as const,
  ACTIVITY: (id: string) => ['activities', id] as const,
  TASK_TEMPLATES: ['task_templates'] as const,
  TASK_TEMPLATE: (id: string) => ['task_templates', id] as const,
} as const;
