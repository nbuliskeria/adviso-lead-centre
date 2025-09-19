// src/hooks/queries/useTaskTemplates.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../lib/constants';
import { useToast } from '../useToast';

// Mock types since task_templates table doesn't exist yet
interface TaskTemplateItem {
  id: string;
  template_id: string;
  title: string;
  description: string | null;
  order_index: number;
  due_days_offset: number;
  category: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskTemplateWithItems extends TaskTemplate {
  items: TaskTemplateItem[];
}

interface ApplyTemplateRequest {
  templateId: string;
  clientId: string;
  accountManagerId: string;
}

// Hook to fetch all task templates
export const useTaskTemplates = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TASK_TEMPLATES,
    queryFn: async (): Promise<TaskTemplateWithItems[]> => {
      // TODO: Implement when task_templates table is created
      // For now, return mock data to prevent build errors
      console.warn('Task templates not implemented yet - returning mock data');
      
      const mockTemplate: TaskTemplateWithItems = {
        id: 'mock-template-1',
        name: 'Standard Client Onboarding',
        description: 'Standard onboarding process for new clients',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [
          {
            id: 'mock-item-1',
            template_id: 'mock-template-1',
            title: 'Welcome call with client',
            description: 'Initial welcome call to introduce the team',
            order_index: 1,
            due_days_offset: 1,
            category: 'Meeting',
            priority: 'high',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]
      };

      return [mockTemplate];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch a single task template
export const useTaskTemplate = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.TASK_TEMPLATE(id),
    queryFn: async (): Promise<TaskTemplateWithItems> => {
      // TODO: Implement when task_templates table is created
      console.warn('Task template fetch not implemented yet - returning mock data');
      
      return {
        id: id,
        name: 'Mock Template',
        description: 'Mock template for development',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: []
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to apply a template to a client
export const useApplyTemplate = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ templateId, clientId, accountManagerId }: ApplyTemplateRequest) => {
      // TODO: Implement Edge Function call when available
      console.log('Applying template:', { templateId, clientId, accountManagerId });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true, tasksCreated: 5 };
    },
    onSuccess: (data: { success: boolean; tasksCreated: number }) => {
      addToast(`Template applied successfully! Created ${data.tasksCreated} tasks.`, 'success');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: unknown) => {
      console.error('Error applying template:', error);
      addToast('Failed to apply template. Please try again.', 'error');
    },
  });
};
