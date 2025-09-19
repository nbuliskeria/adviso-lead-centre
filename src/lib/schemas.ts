// src/lib/schemas.ts
import { z } from 'zod';

// Single flexible schema that works for both create and edit
export const leadSchema = z.object({
  // Core fields (required for create, optional for edit)
  company_name: z.string().min(1, 'Company name is required').max(255, 'Company name is too long'),
  industry: z.string().min(1, 'Industry is required'),
  lead_owner: z.string().min(1, 'Lead owner is required'),
  
  // Optional fields
  lead_source: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  priority: z.string().optional().nullable(),
  potential_mrr: z.number().min(0, 'Potential MRR must be positive').optional().nullable(),
  subscription_package: z.string().optional().nullable(),
  client_health: z.string().optional().nullable(),
  
  // Customization fields
  needs_customization: z.boolean().optional().nullable(),
  customization_fee: z.number().min(0, 'Customization fee must be positive').optional().nullable(),
  customization_notes: z.string().optional().nullable(),
  
  // System fields (handled automatically)
  lead_owner_id: z.string().optional().nullable(),
  assigned_team_id: z.string().optional().nullable(),
  created_by: z.string().optional().nullable(),
  
  // JSON fields (simplified for form)
  contacts: z.any().optional().nullable(),
  tags: z.any().optional().nullable(),
  activity_log: z.any().optional().nullable(),
  client_tasks: z.any().optional().nullable(),
  onboarding_info: z.any().optional().nullable(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// Lead to Client Conversion Schema
export const conversionSchema = z.object({
  accountManagerId: z.string().min(1, 'Account manager is required'),
  businessIdNumber: z.string().optional(),
  subscriptionPackage: z.string().optional(),
  monthlyValue: z.number().min(0, 'Monthly value must be positive').optional(),
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  notes: z.string().optional(),
});

export type ConversionFormData = z.infer<typeof conversionSchema>;

// Task Schema
const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Subtask title is required'),
  completed: z.boolean().default(false),
  created_at: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']).default('To Do'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.enum(['General', 'Follow-up', 'Onboarding', 'Support', 'Meeting', 'Documentation', 'Technical', 'Review']).optional(),
  due_date: z.string().optional(),
  estimated_hours: z.number().min(0).optional(),
  lead_id: z.string().optional(),
  client_id: z.string().optional(),
  subtasks: z.array(subtaskSchema).default([]),
  notes: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type SubtaskData = z.infer<typeof subtaskSchema>;

// Client Onboarding Schema
export const clientOnboardingSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  business_id_number: z.string().optional(),
  rs_username: z.string().optional(),
  rs_password: z.string().optional(),
  user_emails: z.array(z.object({
    email: z.string().email('Invalid email format'),
  })).default([]),
  bank_details: z.array(z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    iban: z.string().min(15, 'IBAN must be at least 15 characters').max(34, 'IBAN cannot exceed 34 characters'),
    clientId: z.string().min(1, 'Client ID is required'),
    clientSecret: z.string().min(1, 'Client Secret is required'),
  })).default([]),
  onboarding_completed: z.boolean().default(false),
});

export type ClientOnboardingFormData = z.infer<typeof clientOnboardingSchema>;
