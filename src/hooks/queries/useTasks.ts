// src/hooks/queries/useTasks.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type Task = Database['public']['Tables']['client_tasks']['Row'];
type TaskWithRelations = Task & {
  assignee_profile?: {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  lead?: {
    id: string;
    company_name: string;
  } | null;
};

const fetchTasks = async (): Promise<TaskWithRelations[]> => {
  const { data, error } = await supabase
    .from('client_tasks')
    .select(`
      *,
      assignee_profile:user_profiles!client_tasks_assignee_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      ),
      lead:leads!client_tasks_lead_id_fkey (
        id,
        company_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useTasks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS,
    queryFn: fetchTasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch tasks by lead ID
const fetchTasksByLead = async (leadId: string): Promise<TaskWithRelations[]> => {
  const { data, error } = await supabase
    .from('client_tasks')
    .select(`
      *,
      assignee_profile:user_profiles!client_tasks_assignee_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      ),
      lead:leads!client_tasks_lead_id_fkey (
        id,
        company_name
      )
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks by lead:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useTasksByLead = (leadId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TASKS, 'by-lead', leadId],
    queryFn: () => fetchTasksByLead(leadId),
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook to fetch a single task by ID
const fetchTask = async (id: string): Promise<TaskWithRelations> => {
  const { data, error } = await supabase
    .from('client_tasks')
    .select(`
      *,
      assignee_profile:user_profiles!client_tasks_assignee_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      ),
      lead:leads!client_tasks_lead_id_fkey (
        id,
        company_name
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching task:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.TASK(id),
    queryFn: () => fetchTask(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
