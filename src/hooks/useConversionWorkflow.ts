// src/hooks/useConversionWorkflow.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';
import { useConvertLeadToClient } from './queries';
import type { ConversionFormData } from '../lib/schemas';
import type { Database } from '../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

export const useConversionWorkflow = () => {
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const { mutate: convertLead, isPending: isConverting } = useConvertLeadToClient();

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
      console.log('Converting lead:', leadId, 'with details:', conversionDetails);
      await convertLead({ leadId, conversionDetails });
      
      // Store the converted client in localStorage for mock functionality
      const newClient = {
        id: `client-${Date.now()}`,
        company_name: selectedLead?.company_name || 'Unknown Company',
        industry: selectedLead?.industry || 'Unknown Industry',
        status: 'Active',
        account_manager_id: conversionDetails.accountManagerId,
        subscription_package: conversionDetails.subscriptionPackage,
        monthly_value: conversionDetails.monthlyValue,
        contract_start_date: conversionDetails.contractStartDate,
        contract_end_date: conversionDetails.contractEndDate,
        business_id_number: conversionDetails.businessIdNumber,
        notes: conversionDetails.notes,
        converted_from_lead_id: leadId,
        converted_at: new Date().toISOString(),
        health: 'Good',
        onboarding_completed: false,
        // Copy relevant lead data
        potential_mrr: selectedLead?.potential_mrr,
        lead_source: selectedLead?.lead_source,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Get existing clients from localStorage
      const existingClients = JSON.parse(localStorage.getItem('convertedClients') || '[]');
      existingClients.push(newClient);
      localStorage.setItem('convertedClients', JSON.stringify(existingClients));
      
      addToast('Lead converted to client successfully!', 'success');
      closeConversionModal();
      
      // Navigate to client space after successful conversion
      setTimeout(() => {
        navigate('/client-space', {
          state: { 
            message: `${selectedLead?.company_name || 'Lead'} has been successfully converted to a client!`,
            newClientId: newClient.id
          }
        });
      }, 500); // Small delay to ensure modal closes first
    } catch (error) {
      console.error('Conversion failed:', error);
      addToast('Failed to convert lead. Please try again.', 'error');
      // Don't re-throw the error to prevent unhandled promise rejection
    }
  };

  return {
    isConversionModalOpen,
    selectedLead,
    openConversionModal,
    closeConversionModal,
    handleConversion,
    isConverting
  };
};
