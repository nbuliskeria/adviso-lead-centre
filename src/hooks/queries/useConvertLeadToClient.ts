// src/hooks/queries/useConvertLeadToClient.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { QUERY_KEYS } from '../../lib/constants';

interface ConversionDetails {
  accountManagerId: string;
  businessIdNumber?: string;
  subscriptionPackage?: string;
  monthlyValue?: number;
  contractStartDate?: string;
  contractEndDate?: string;
  notes?: string;
}

interface ConversionRequest {
  leadId: string;
  conversionDetails: ConversionDetails;
}

interface ConversionResponse {
  success: boolean;
  client?: any;
  error?: string;
  message?: string;
}

const convertLead = async ({ leadId, conversionDetails }: ConversionRequest): Promise<any> => {
  console.log('Converting lead to client:', { leadId, conversionDetails });

  const { data, error } = await supabase.functions.invoke('convert-lead-to-client', {
    body: { leadId, conversionDetails },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(error.message || 'Failed to convert lead to client');
  }

  const response = data as ConversionResponse;
  
  if (!response.success) {
    throw new Error(response.error || 'Conversion failed');
  }

  return response.client;
};

export const useConvertLeadToClient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: convertLead,
    onSuccess: (newClient) => {
      // Invalidate and refetch both leads and clients after conversion
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CLIENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVITIES });
      
      // Optionally set the new client in the cache
      if (newClient?.id) {
        queryClient.setQueryData(QUERY_KEYS.CLIENT(newClient.id), newClient);
      }
      
      console.log('Lead conversion successful:', newClient);
    },
    onError: (error) => {
      console.error('Lead conversion failed:', error);
    },
  });
};
