// src/components/leads/OpportunityCanvas.tsx
import { useLead } from '../../hooks/queries/useLeads';
import { SidePanel } from '../ui/SidePanel';
import OpportunityFormWizard from './OpportunityFormWizard';
import OpportunityEditTabs from './OpportunityEditTabs';

interface OpportunityCanvasProps {
  leadId: string | null;
  onClose: () => void;
}

const OpportunityCanvas = ({ leadId, onClose }: OpportunityCanvasProps) => {
  const isOpen = leadId !== null;
  const isCreateMode = leadId === 'new';
  const isEditMode = leadId !== null && leadId !== 'new';
  
  // Fetch lead data for edit mode
  const { data: lead, isLoading, error } = useLead(isEditMode ? leadId : '');

  // Determine panel title
  const getTitle = () => {
    if (isCreateMode) return 'Create New Lead';
    if (isEditMode && lead) return `Edit ${lead.company_name}`;
    return 'Lead Details';
  };

  // Loading state for edit mode
  if (isEditMode && isLoading) {
    return (
      <SidePanel isOpen={isOpen} onClose={onClose} title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
            <p className="text-[var(--color-text-secondary)]">Loading lead details...</p>
          </div>
        </div>
      </SidePanel>
    );
  }

  // Error state for edit mode
  if (isEditMode && error) {
    return (
      <SidePanel isOpen={isOpen} onClose={onClose} title="Error">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-[var(--color-destructive)] mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
              Error Loading Lead
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-4">
              {error.message || 'Failed to load lead details. Please try again.'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </SidePanel>
    );
  }

  return (
    <SidePanel 
      isOpen={isOpen} 
      onClose={onClose} 
      title={getTitle()}
      width="xl"
    >
      {isCreateMode && (
        <OpportunityFormWizard onClose={onClose} />
      )}
      
      {isEditMode && lead && (
        <OpportunityEditTabs 
          lead={lead} 
          leadId={leadId}
          onClose={onClose} 
        />
      )}
    </SidePanel>
  );
};

export default OpportunityCanvas;
