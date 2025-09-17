// src/hooks/useOpportunityForm.ts
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema } from '../lib/schemas';
import { useCreateLead, useUpdateLead } from './queries/useUpdateLead';
import { useToast } from './useToast';
import type { LeadFormData } from '../lib/schemas';
import type { Database } from '../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

interface UseOpportunityFormProps {
  mode: 'create' | 'edit';
  leadId?: string;
  initialData?: LeadRow;
  onSuccess?: () => void;
  onClose?: () => void;
}

// Debounce utility
function useDebounce(
  callback: (data: LeadFormData) => void,
  delay: number
): (data: LeadFormData) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  return (data: LeadFormData) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(data);
    }, delay);
  };
}

export const useOpportunityForm = ({
  mode,
  leadId,
  initialData,
  onSuccess,
  onClose,
}: UseOpportunityFormProps) => {
  const { addToast } = useToast();
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  
  // Form setup with appropriate schema
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      company_name: '',
      industry: '',
      lead_owner: '',
      lead_source: null,
      status: null,
      priority: null,
      potential_mrr: null,
      subscription_package: null,
      client_health: null,
      needs_customization: false,
      customization_fee: null,
      customization_notes: null,
      ...initialData,
    },
  });

  const { watch, formState: { isDirty, isValid }, reset } = form;

  // Initialize form with lead data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  // Debounced autosave function
  const debouncedAutosave = useDebounce((data: LeadFormData) => {
    if (mode === 'edit' && leadId && isDirty && isValid) {
      // Enhanced data cleaning for autosave
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => {
          // Handle subscription package constraint
          if (key === 'subscription_package') {
            if (!value || value === '') return [key, null];
            const validPackages = ['Starter', 'Professional', 'Enterprise', 'Custom'];
            if (!validPackages.includes(value as string)) {
              return [key, null];
            }
          }
          
          // Handle priority constraint (ensure lowercase)
          if (key === 'priority') {
            if (!value || value === '') return [key, null];
            return [key, (value as string).toLowerCase()];
          }
          
          // Handle status constraint
          if (key === 'status') {
            if (!value || value === '') return [key, null];
            const statusMap: { [key: string]: string } = {
              'New': 'New Lead',
              'new': 'New Lead'
            };
            return [key, statusMap[value as string] || value];
          }
          
          // Handle numeric fields
          if ((key === 'potential_mrr' || key === 'customization_fee') && value === 0) {
            return [key, null];
          }
          
          // General null handling
          return [key, value === '' ? null : value];
        })
      );
      
      updateLeadMutation.mutate(
        { id: leadId, updates: cleanedData },
        {
          onSuccess: () => {
            // Silent success for autosave
            console.log('Autosaved lead:', leadId);
          },
          onError: (error) => {
            console.error('Autosave failed:', error);
            // Don't show toast for autosave failures to avoid spam
          },
        }
      );
    }
  }, 1500); // 1.5 seconds delay

  // Watch for form changes and trigger autosave
  useEffect(() => {
    if (mode === 'edit') {
      const subscription = watch((data) => {
        if (isDirty && isValid) {
          debouncedAutosave(data as LeadFormData);
        }
      });
      
      return () => subscription.unsubscribe();
    }
  }, [watch, isDirty, isValid, mode, debouncedAutosave]);

  // Form submission handler
  const onSubmit = async (data: LeadFormData) => {
    try {
      // Clean up the data - convert empty strings to null for optional fields
      const cleanedData = {
        ...data,
        lead_source: data.lead_source === '' ? null : data.lead_source,
        status: data.status === '' ? null : data.status,
        priority: data.priority === '' ? null : data.priority,
        subscription_package: data.subscription_package === '' ? null : data.subscription_package,
        client_health: data.client_health === '' ? null : data.client_health,
        customization_notes: data.customization_notes === '' ? null : data.customization_notes,
        potential_mrr: data.potential_mrr === 0 ? null : data.potential_mrr,
        customization_fee: data.customization_fee === 0 ? null : data.customization_fee,
      };

      if (mode === 'create') {
        await createLeadMutation.mutateAsync(cleanedData, {
          onSuccess: () => {
            addToast('Lead created successfully!', 'success');
            onSuccess?.();
            onClose?.();
          },
          onError: (error) => {
            addToast(`Failed to create lead: ${error.message}`, 'error');
          },
        });
      } else if (mode === 'edit' && leadId) {
        await updateLeadMutation.mutateAsync(
          { id: leadId, updates: cleanedData },
          {
            onSuccess: () => {
              addToast('Lead updated successfully!', 'success');
              onSuccess?.();
            },
            onError: (error) => {
              addToast(`Failed to update lead: ${error.message}`, 'error');
            },
          }
        );
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Get autosave status
  const getAutosaveStatus = () => {
    if (mode !== 'edit') return null;
    
    if (updateLeadMutation.isPending) {
      return { status: 'saving', message: 'Saving...' };
    }
    
    if (isDirty && isValid) {
      return { status: 'pending', message: 'Unsaved changes' };
    }
    
    if (!isDirty) {
      return { status: 'saved', message: 'All changes saved' };
    }
    
    return null;
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: createLeadMutation.isPending || updateLeadMutation.isPending,
    autosaveStatus: getAutosaveStatus(),
    isDirty,
    isValid,
  };
};
