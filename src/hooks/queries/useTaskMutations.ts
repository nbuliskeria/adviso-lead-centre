// src/hooks/queries/useTaskMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../useToast';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type TaskInsert = Database['public']['Tables']['client_tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['client_tasks']['Update'];
type TaskRow = Database['public']['Tables']['client_tasks']['Row'];

// Add Task Mutation
export const useAddTask = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (taskData: TaskInsert): Promise<TaskRow> => {
      const { data, error } = await supabase
        .from('client_tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      addToast('Task created successfully!', 'success');
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
      addToast('Failed to create task. Please try again.', 'error');
    },
  });
};

// Update Task Mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TaskUpdate }): Promise<TaskRow> => {
      const { data, error } = await supabase
        .from('client_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      addToast('Task updated successfully!', 'success');
    },
    onError: (error) => {
      console.error('Failed to update task:', error);
      addToast('Failed to update task. Please try again.', 'error');
    },
  });
};

// Delete Task Mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('client_tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting task:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch tasks
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
      addToast('Task deleted successfully!', 'success');
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
      addToast('Failed to delete task. Please try again.', 'error');
    },
  });
};
