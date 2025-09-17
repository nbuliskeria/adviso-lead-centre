// src/hooks/queries/useTaskTemplates.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type TaskTemplate = Database['public']['Tables']['task_templates']['Row'];
type TaskTemplateItem = Database['public']['Tables']['task_template_items']['Row'];

interface TaskTemplateWithItems extends TaskTemplate {
  items: TaskTemplateItem[];
}

interface ApplyTemplateRequest {
  clientId: string;
  templateId: string;
  assigneeId?: string;
}

interface ApplyTemplateResponse {
  success: boolean;
  tasks?: any[];
  template?: string;
  error?: string;
  message?: string;
}

// Fetch all task templates
const fetchTaskTemplates = async (): Promise<TaskTemplate[]> => {
  const { data, error } = await supabase
    .from('task_templates')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching task templates:', error);
    throw new Error(error.message);
  }

  return data || [];
};

// Fetch single task template with items
const fetchTaskTemplate = async (id: string): Promise<TaskTemplateWithItems> => {
  const { data, error } = await supabase
    .from('task_templates')
    .select(`
      *,
      items:task_template_items (*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching task template:', error);
    throw new Error(error.message);
  }

  // Sort items by order_index
  if (data.items) {
    data.items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  }

  return data;
};

// Apply template to client (calls Edge Function)
const applyTemplate = async ({ clientId, templateId, assigneeId }: ApplyTemplateRequest): Promise<any[]> => {
  console.log('Applying template to client:', { clientId, templateId, assigneeId });

  const { data, error } = await supabase.functions.invoke('apply-onboarding-template', {
    body: { clientId, templateId, assigneeId },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Failed to apply template');
  }

  const response = data as ApplyTemplateResponse;
  
  if (!response.success) {
    throw new Error(response.error || 'Template application failed');
  }

  return response.tasks || [];
};

// Hook to fetch all task templates
export const useTaskTemplates = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TASK_TEMPLATES,
    queryFn: fetchTaskTemplates,
    staleTime: 10 * 60 * 1000, // 10 minutes (templates don't change often)
  });
};

// Hook to fetch single task template with items
export const useTaskTemplate = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.TASK_TEMPLATE(id),
    queryFn: () => fetchTaskTemplate(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to apply template to client
export const useApplyTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: applyTemplate,
    onSuccess: (tasks, variables) => {
      // Invalidate tasks queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES });
      
      // Invalidate client data to update onboarding status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENT(variables.clientId) });
      
      console.log('Template applied successfully:', tasks);
    },
    onError: (error) => {
      console.error('Template application failed:', error);
    },
  });
};
