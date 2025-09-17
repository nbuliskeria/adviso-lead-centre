// src/hooks/queries/useClients.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type ClientRow = Database['public']['Tables']['clients']['Row'];

// Fetch all clients with related data
const fetchClients = async (): Promise<ClientRow[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      account_manager:user_profiles!clients_account_manager_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url
      ),
      original_lead:leads!clients_original_lead_id_fkey (
        id,
        company_name,
        industry,
        lead_source
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching clients:', error);
    throw new Error(error.message);
  }

  return data || [];
};

// Fetch single client by ID
const fetchClient = async (id: string): Promise<ClientRow> => {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      account_manager:user_profiles!clients_account_manager_id_fkey (
        id,
        first_name,
        last_name,
        display_name,
        avatar_url,
        email
      ),
      original_lead:leads!clients_original_lead_id_fkey (
        id,
        company_name,
        industry,
        lead_source,
        created_at,
        lead_owner,
        priority
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching client:', error);
    throw new Error(error.message);
  }

  return data;
};

// Hook to fetch all clients
export const useClients = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENTS,
    queryFn: fetchClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to fetch single client
export const useClient = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENT(id),
    queryFn: () => fetchClient(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
