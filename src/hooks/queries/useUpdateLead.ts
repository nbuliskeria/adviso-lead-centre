// src/hooks/queries/useUpdateLead.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type LeadUpdate = Database['public']['Tables']['leads']['Update'];
type LeadUpdateInput = { id: string } & LeadUpdate;

const updateLead = async ({ id, ...updates }: LeadUpdateInput) => {
  // Clean the updates to ensure no empty strings are sent
  const cleanedUpdates = Object.fromEntries(
    Object.entries(updates).map(([key, value]) => [
      key,
      value === '' ? null : value
    ])
  );

  const { data, error } = await supabase
    .from('leads')
    .update({
      ...cleanedUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      lead_owner_profile:user_profiles!leads_lead_owner_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    console.error('Error updating lead:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLead,
    onSuccess: (updatedLead) => {
      // Invalidate and refetch leads list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS });
      
      // Update the specific lead in cache
      queryClient.setQueryData(QUERY_KEYS.LEAD(updatedLead.id), updatedLead);
    },
    onError: (error) => {
      console.error('Error updating lead:', error);
      // Here you could use the ToastContext to show an error notification
    },
  });
};

// Hook for creating a new lead
type LeadInsert = Database['public']['Tables']['leads']['Insert'];

const createLead = async (leadData: LeadInsert) => {
  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...leadData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select(`
      *,
      lead_owner_profile:user_profiles!leads_lead_owner_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      )
    `)
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      // Invalidate leads list to refetch with new lead
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS });
    },
    onError: (error) => {
      console.error('Error creating lead:', error);
    },
  });
};

// Hook for deleting a lead
const deleteLead = async (id: string) => {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting lead:', error);
    throw new Error(error.message);
  }

  return { id };
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLead,
    onSuccess: (deletedLead) => {
      // Remove the lead from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.LEAD(deletedLead.id) });
      
      // Invalidate leads list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS });
    },
    onError: (error) => {
      console.error('Error deleting lead:', error);
    },
  });
};
