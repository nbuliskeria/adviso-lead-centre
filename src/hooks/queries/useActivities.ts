// src/hooks/queries/useActivities.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type Activity = Database['public']['Tables']['activities']['Row'];
type ActivityWithRelations = Activity & {
  owner_profile?: {
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

const fetchActivities = async (): Promise<ActivityWithRelations[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      owner_profile:user_profiles!activities_owner_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      ),
      lead:leads!activities_lead_id_fkey (
        id,
        company_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activities:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useActivities = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ACTIVITIES,
    queryFn: fetchActivities,
    staleTime: 2 * 60 * 1000, // 2 minutes - activities are more dynamic
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch activities by lead ID
const fetchActivitiesByLead = async (leadId: string): Promise<ActivityWithRelations[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      owner_profile:user_profiles!activities_owner_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      ),
      lead:leads!activities_lead_id_fkey (
        id,
        company_name
      )
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching activities by lead:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useActivitiesByLead = (leadId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ACTIVITIES, 'by-lead', leadId],
    queryFn: () => fetchActivitiesByLead(leadId),
    enabled: !!leadId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for creating a new activity
type ActivityInsert = Database['public']['Tables']['activities']['Insert'];

const createActivity = async (activityData: ActivityInsert) => {
  const { data, error } = await supabase
    .from('activities')
    .insert({
      ...activityData,
      created_at: new Date().toISOString(),
    })
    .select(`
      *,
      owner_profile:user_profiles!activities_owner_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      ),
      lead:leads!activities_lead_id_fkey (
        id,
        company_name
      )
    `)
    .single();

  if (error) {
    console.error('Error creating activity:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createActivity,
    onSuccess: (newActivity) => {
      // Invalidate activities list to refetch with new activity
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES });
      
      // If activity belongs to a lead, invalidate lead-specific activities
      if (newActivity.lead_id) {
        queryClient.invalidateQueries({ 
          queryKey: [...QUERY_KEYS.ACTIVITIES, 'by-lead', newActivity.lead_id] 
        });
      }
    },
    onError: (error) => {
      console.error('Error creating activity:', error);
    },
  });
};
