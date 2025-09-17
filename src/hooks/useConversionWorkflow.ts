// src/hooks/useConversionWorkflow.ts
import { useState } from 'react';
import { useToast } from './useToast';
// import { useConvertLeadToClient } from './queries';
import type { ConversionFormData } from '../lib/schemas';
import type { Database } from '../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

export const useConversionWorkflow = () => {
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const { addToast } = useToast();
  
  // TODO: Uncomment when database tables are created
  // const { mutate: convertLead, isPending: isConverting } = useConvertLeadToClient();

  const openConversionModal = (lead: LeadRow) => {
    // Check if lead can be converted
    if (lead.status === 'Won') {
      setSelectedLead(lead);
      setIsConversionModalOpen(true);
    } else {
      addToast('Only leads with "Won" status can be converted to clients', 'warning');
    }
  };

  const closeConversionModal = () => {
    setIsConversionModalOpen(false);
    setSelectedLead(null);
  };

  const handleConversion = async (leadId: string, conversionDetails: ConversionFormData) => {
    try {
      // TODO: Uncomment when database tables are created
      // await convertLead({ leadId, conversionDetails });
      
      // For now, just show a success message
      console.log('Converting lead:', { leadId, conversionDetails });
      addToast('Lead conversion initiated successfully!', 'success');
      
      closeConversionModal();
    } catch (error) {
      console.error('Conversion failed:', error);
      addToast('Failed to convert lead. Please try again.', 'error');
      throw error;
    }
  };

  return {
    isConversionModalOpen,
    selectedLead,
    openConversionModal,
    closeConversionModal,
    handleConversion,
    isConverting: false, // TODO: Replace with actual loading state
  };
};
