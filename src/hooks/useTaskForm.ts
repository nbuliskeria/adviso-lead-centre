// src/hooks/useTaskForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { taskSchema, type TaskFormData } from '../lib/schemas';
import { useAddTask, useUpdateTask } from './queries/useTaskMutations';
import { useAuth } from './useAuth';
import type { Database } from '../lib/database.types';

type TaskRow = Database['public']['Tables']['client_tasks']['Row'];

interface UseTaskFormProps {
  task?: TaskRow;
  onSuccess?: () => void;
}

export const useTaskForm = ({ task, onSuccess }: UseTaskFormProps = {}) => {
  const { user } = useAuth();
  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();

  const isEditing = !!task;

  // Initialize form with default values
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'To Do',
      priority: 'medium',
      category: undefined,
      due_date: '',
      estimated_hours: undefined,
      lead_id: '',
      client_id: '',
      subtasks: [],
      notes: '',
    },
    mode: 'onChange',
  });

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      // Parse subtasks from JSONB if they exist
      let subtasks = [];
      try {
        if (task.tags && typeof task.tags === 'object' && 'subtasks' in task.tags) {
          subtasks = Array.isArray(task.tags.subtasks) ? task.tags.subtasks : [];
        }
      } catch (error) {
        console.warn('Failed to parse subtasks:', error);
      }

      form.reset({
        title: task.title || '',
        description: task.description || '',
        status: (task.status as any) || 'To Do',
        priority: (task.priority as any) || 'Medium',
        category: task.category || '',
        due_date: task.due_date || '',
        estimated_hours: task.estimated_hours || undefined,
        lead_id: task.lead_id || '',
        client_id: '', // Will be populated when clients table exists
        subtasks,
        notes: task.notes || '',
      });
    }
  }, [task, form]);

  // Handle form submission
  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (isEditing && task) {
        // Update existing task
        await updateTaskMutation.mutateAsync({
          id: task.id,
          updates: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            category: data.category,
            due_date: data.due_date || null,
            estimated_hours: data.estimated_hours || null,
            lead_id: data.lead_id || null,
            notes: data.notes,
            // Store subtasks in tags JSONB field for now
            tags: {
              ...((task.tags as any) || {}),
              subtasks: data.subtasks,
            },
            updated_at: new Date().toISOString(),
          },
        });
      } else {
        // Create new task
        await addTaskMutation.mutateAsync({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          category: data.category,
          due_date: data.due_date || null,
          estimated_hours: data.estimated_hours || null,
          lead_id: data.lead_id || null,
          assignee: user?.email || 'Unknown',
          assignee_id: user?.id || null,
          task_id: crypto.randomUUID(), // Generate unique task ID
          notes: data.notes,
          // Store subtasks in tags JSONB field for now
          tags: {
            subtasks: data.subtasks,
          },
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Failed to save task:', error);
      throw error;
    }
  };

  // Helper function to add a new subtask
  const addSubtask = (title: string) => {
    const currentSubtasks = form.getValues('subtasks');
    const newSubtask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      created_at: new Date().toISOString(),
    };
    form.setValue('subtasks', [...currentSubtasks, newSubtask]);
  };

  // Helper function to toggle subtask completion
  const toggleSubtask = (subtaskId: string) => {
    const currentSubtasks = form.getValues('subtasks');
    const updatedSubtasks = currentSubtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    form.setValue('subtasks', updatedSubtasks);
  };

  // Helper function to remove a subtask
  const removeSubtask = (subtaskId: string) => {
    const currentSubtasks = form.getValues('subtasks');
    const updatedSubtasks = currentSubtasks.filter(subtask => subtask.id !== subtaskId);
    form.setValue('subtasks', updatedSubtasks);
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting: addTaskMutation.isPending || updateTaskMutation.isPending,
    isEditing,
    addSubtask,
    toggleSubtask,
    removeSubtask,
  };
};
