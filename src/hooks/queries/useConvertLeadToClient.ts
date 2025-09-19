// src/hooks/queries/useConvertLeadToClient.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '../../lib/supabaseClient'; // TODO: Use when implementing actual conversion
import { QUERY_KEYS } from '../../lib/constants';

// TODO: Use when implementing actual conversion
// interface ConversionDetails {
//   accountManagerId: string;
//   businessIdNumber?: string;
//   subscriptionPackage?: string;
//   monthlyValue?: number;
//   contractStartDate?: string;
//   contractEndDate?: string;
//   notes?: string;
// }

// TODO: Use when implementing actual conversion
// interface ConversionRequest {
//   leadId: string;
//   conversionDetails: ConversionDetails;
// }

// TODO: Use when implementing actual conversion
// interface ConversionResponse {
//   success: boolean;
//   client?: any;
//   error?: string;
//   message?: string;
// }

// TODO: Use when implementing actual conversion
// const convertLead = async (leadId: string, conversionData: any): Promise<any> => {
//   console.log('Converting lead to client:', { leadId, conversionData });
//
//   const { data, error } = await supabase.functions.invoke('convert-lead-to-client', {
//     body: { leadId, conversionData },
//   });
//
//   if (error) {
//     console.error('Edge function error:', error);
//     throw new Error(error.message || 'Failed to convert lead to client');
//   }
//
//   const response = data as ConversionResponse;
//   
//   if (!response.success) {
//     throw new Error(response.error || 'Conversion failed');
//   }
//
//   return response.client;
// };

const mockClient = {
  id: 'mock-client-id',
  // Add other mock client properties as needed
};

export const useConvertLeadToClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (conversionData?: any) => {
      console.log('Converting lead with data:', conversionData);
      // Mock implementation - in production this would call the Edge Function
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { success: true, clientId: 'mock-client-id', client: mockClient } as any;
    },
    onSuccess: (newClient) => {
      try {
        // Invalidate and refetch both leads and clients after conversion
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES });
        
        // Optionally set the new client in the cache
        if (newClient?.id) {
          queryClient.setQueryData(QUERY_KEYS.CLIENT(newClient.id), newClient);
        }
        
        console.log('Lead conversion successful:', newClient);
      } catch (error) {
        console.warn('Query invalidation failed (expected without database):', error);
      }
    },
    onError: (error) => {
      console.error('Lead conversion failed:', error);
    },
  });
};
