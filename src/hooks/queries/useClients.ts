// src/hooks/queries/useClients.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../lib/constants';
import { useToast } from '../useToast';

// Mock client type since clients table doesn't exist yet
interface MockClient {
  id: string;
  company_name: string;
  business_id_number: string | null;
  account_manager_id: string | null;
  client_status: string;
  subscription_package: string | null;
  monthly_value: number | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  account_manager?: {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

export const useClients = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENTS,
    queryFn: async (): Promise<MockClient[]> => {
      // TODO: Implement when clients table is created
      console.warn('Clients not implemented yet - returning mock data');
      
      // Return empty array for now
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.CLIENT(id),
    queryFn: async (): Promise<MockClient> => {
      // TODO: Implement when clients table is created
      console.warn('Client fetch not implemented yet - returning mock data');
      
      return {
        id: id,
        company_name: 'Mock Client',
        business_id_number: '123456789',
        account_manager_id: 'mock-user-1',
        client_status: 'Active',
        subscription_package: 'Professional',
        monthly_value: 1000,
        contract_start_date: new Date().toISOString(),
        contract_end_date: null,
        onboarding_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        account_manager: {
          id: 'mock-user-1',
          first_name: 'John',
          last_name: 'Doe',
          display_name: 'John Doe',
          avatar_url: null,
        }
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MockClient> }) => {
      // TODO: Implement when clients table is created
      console.log('Updating client:', { id, updates });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { id, ...updates };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENT(data.id) });
      
      addToast('Client updated successfully', 'success');
    },
    onError: (error: unknown) => {
      console.error('Error updating client:', error);
      addToast('Failed to update client. Please try again.', 'error');
    },
  });
};
