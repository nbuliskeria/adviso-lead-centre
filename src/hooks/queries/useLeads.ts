// src/hooks/queries/useLeads.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type Lead = Database['public']['Tables']['leads']['Row'];
type LeadWithProfile = Lead & {
  lead_owner_profile?: {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

const fetchLeads = async (): Promise<LeadWithProfile[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      lead_owner_profile:user_profiles!lead_owner_id (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useLeads = () => {
  return useQuery({
    queryKey: QUERY_KEYS.LEADS,
    queryFn: fetchLeads,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook to fetch a single lead by ID
const fetchLead = async (id: string): Promise<LeadWithProfile> => {
  const { data, error } = await supabase
    .from('leads')
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
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching lead:', error);
    throw new Error(error.message);
  }

  return data;
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.LEAD(id),
    queryFn: () => fetchLead(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
