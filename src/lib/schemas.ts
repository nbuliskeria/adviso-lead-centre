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
