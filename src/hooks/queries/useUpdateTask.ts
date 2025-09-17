// src/hooks/queries/useUpdateTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type TaskUpdate = Database['public']['Tables']['client_tasks']['Update'];
type TaskUpdateInput = { id: string } & TaskUpdate;

const updateTask = async ({ id, ...updates }: TaskUpdateInput) => {
  const { data, error } = await supabase
    .from('client_tasks')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
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
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updatedTask) => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      
      // Update the specific task in cache
      queryClient.setQueryData(QUERY_KEYS.TASK(updatedTask.id), updatedTask);
      
      // If task belongs to a lead, invalidate lead-specific tasks
      if (updatedTask.lead_id) {
        queryClient.invalidateQueries({ 
          queryKey: [...QUERY_KEYS.TASKS, 'by-lead', updatedTask.lead_id] 
        });
      }
    },
    onError: (error) => {
      console.error('Error updating task:', error);
    },
  });
};

// Hook for creating a new task
type TaskInsert = Database['public']['Tables']['client_tasks']['Insert'];

const createTask = async (taskData: TaskInsert) => {
  const { data, error } = await supabase
    .from('client_tasks')
    .insert({
      ...taskData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
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
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      // Invalidate tasks list to refetch with new task
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      
      // If task belongs to a lead, invalidate lead-specific tasks
      if (newTask.lead_id) {
        queryClient.invalidateQueries({ 
          queryKey: [...QUERY_KEYS.TASKS, 'by-lead', newTask.lead_id] 
        });
      }
    },
    onError: (error) => {
      console.error('Error creating task:', error);
    },
  });
};

// Hook for deleting a task
const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('client_tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error(error.message);
  }

  return { id };
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (deletedTask) => {
      // Remove the task from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.TASK(deletedTask.id) });
      
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
    },
  });
};
