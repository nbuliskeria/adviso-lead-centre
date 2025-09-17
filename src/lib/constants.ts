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

// Lead Status Options
export const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'New Lead', label: 'New', color: 'blue' },
  { value: 'Qualified', label: 'Qualified', color: 'green' },
  { value: 'Proposal', label: 'Proposal', color: 'yellow' },
  { value: 'Negotiation', label: 'Negotiation', color: 'orange' },
  { value: 'Closed Won', label: 'Closed Won', color: 'emerald' },
  { value: 'Closed Lost', label: 'Closed Lost', color: 'red' },
  { value: 'On Hold', label: 'On Hold', color: 'gray' },
];

// Lead Source Options
export const LEAD_SOURCE_OPTIONS: { value: LeadSource; label: string }[] = [
  { value: 'Website', label: 'Website' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Cold Call', label: 'Cold Call' },
  { value: 'Email Campaign', label: 'Email Campaign' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Event', label: 'Event' },
  { value: 'Advertisement', label: 'Advertisement' },
  { value: 'Partner', label: 'Partner' },
  { value: 'Direct', label: 'Direct' },
];

// Lead Priority Options
export const LEAD_PRIORITY_OPTIONS: { value: LeadPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
];

// Client Health Options
export const CLIENT_HEALTH_OPTIONS: { value: ClientHealth; label: string; color: string }[] = [
  { value: 'Excellent', label: 'Excellent', color: 'emerald' },
  { value: 'Good', label: 'Good', color: 'green' },
  { value: 'Fair', label: 'Fair', color: 'yellow' },
  { value: 'Poor', label: 'Poor', color: 'orange' },
  { value: 'Critical', label: 'Critical', color: 'red' },
];

// Task Status Options
export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'To Do', label: 'To Do', color: 'gray' },
  { value: 'In Progress', label: 'In Progress', color: 'blue' },
  { value: 'Review', label: 'Review', color: 'yellow' },
  { value: 'Completed', label: 'Completed', color: 'green' },
  { value: 'Cancelled', label: 'Cancelled', color: 'red' },
];

// Task Priority Options
export const TASK_PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'Low', label: 'Low', color: 'gray' },
  { value: 'Medium', label: 'Medium', color: 'blue' },
  { value: 'High', label: 'High', color: 'orange' },
  { value: 'Critical', label: 'Critical', color: 'red' },
];

// Task Category Options
export const TASK_CATEGORY_OPTIONS: { value: TaskCategory; label: string }[] = [
  { value: 'Setup', label: 'Setup' },
  { value: 'Customization', label: 'Customization' },
  { value: 'Training', label: 'Training' },
  { value: 'Support', label: 'Support' },
  { value: 'Integration', label: 'Integration' },
  { value: 'Migration', label: 'Migration' },
  { value: 'Testing', label: 'Testing' },
  { value: 'Documentation', label: 'Documentation' },
  { value: 'Follow-up', label: 'Follow-up' },
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

// Query Keys for React Query
export const QUERY_KEYS = {
  LEADS: ['leads'] as const,
  LEAD: (id: string) => ['leads', id] as const,
  TASKS: ['tasks'] as const,
  TASK: (id: string) => ['tasks', id] as const,
  USERS: ['users'] as const,
  USER: (id: string) => ['users', id] as const,
  ACTIVITIES: ['activities'] as const,
  ACTIVITY: (id: string) => ['activities', id] as const,
} as const;
