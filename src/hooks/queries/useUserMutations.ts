// src/hooks/queries/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import { useToast } from '../useToast';
import type { Database } from '../../lib/database.types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  company?: string;
  department?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'user';
  is_active?: boolean;
}

interface UpdateUserRequest {
  id: string;
  updates: UserProfileUpdate;
}

// Create new user (admin only)
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (userData: CreateUserRequest): Promise<UserProfile> => {
      // Note: In a real implementation, this would need to create the auth user first
      // For now, we'll just create the profile assuming the auth user exists
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([{
          id: crypto.randomUUID(), // Generate a unique ID for the profile
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          display_name: userData.display_name,
          company: userData.company,
          department: userData.department,
          phone: userData.phone,
          role: userData.role,
          is_active: userData.is_active ?? true,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      addToast(`User ${data.first_name} ${data.last_name} created successfully`, 'success');
    },
    onError: (error: Error) => {
      console.error('Failed to create user:', error);
      addToast(`Failed to create user: ${error.message}`, 'error');
    },
  });
};

// Update user profile
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: UpdateUserRequest): Promise<UserProfile> => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(data.id) });
      addToast(`User ${data.first_name} ${data.last_name} updated successfully`, 'success');
    },
    onError: (error: Error) => {
      console.error('Failed to update user:', error);
      addToast(`Failed to update user: ${error.message}`, 'error');
    },
  });
};

// Deactivate user (soft delete)
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (userId: string): Promise<UserProfile> => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error deactivating user:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(data.id) });
      addToast(`User ${data.first_name} ${data.last_name} deactivated`, 'success');
    },
    onError: (error: Error) => {
      console.error('Failed to deactivate user:', error);
      addToast(`Failed to deactivate user: ${error.message}`, 'error');
    },
  });
};

// Reactivate user
export const useReactivateUser = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (userId: string): Promise<UserProfile> => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error reactivating user:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(data.id) });
      addToast(`User ${data.first_name} ${data.last_name} reactivated`, 'success');
    },
    onError: (error: Error) => {
      console.error('Failed to reactivate user:', error);
      addToast(`Failed to reactivate user: ${error.message}`, 'error');
    },
  });
};
