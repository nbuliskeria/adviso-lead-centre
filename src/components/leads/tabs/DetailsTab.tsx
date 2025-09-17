// src/components/leads/tabs/DetailsTab.tsx
import { Save, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useOpportunityForm } from '../../../hooks/useOpportunityForm';
import CompanyProfileForm from '../form-sections/CompanyProfileForm';
import OpportunityDetailsForm from '../form-sections/OpportunityDetailsForm';
import type { Database } from '../../../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

interface DetailsTabProps {
  lead: LeadRow;
  leadId: string;
  onClose: () => void;
}

const DetailsTab = ({ lead, leadId, onClose }: DetailsTabProps) => {
  const { form, onSubmit, isSubmitting, autosaveStatus, isDirty } = useOpportunityForm({
    mode: 'edit',
    leadId,
    initialData: lead,
    onClose,
  });

  const { register, control, formState: { errors } } = form;

  const renderAutosaveStatus = () => {
    if (!autosaveStatus) return null;

    const { status, message } = autosaveStatus;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        {status === 'saving' && (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-primary)]" />
            <span className="text-[var(--color-text-secondary)]">{message}</span>
          </>
        )}
        {status === 'saved' && (
          <>
            <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />
            <span className="text-[var(--color-success)]">{message}</span>
          </>
        )}
        {status === 'pending' && (
          <>
            <Clock className="h-4 w-4 text-[var(--color-warning)]" />
            <span className="text-[var(--color-warning)]">{message}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Autosave Status Bar */}
      <div className="px-6 py-3 border-b border-[var(--color-border-light)] bg-[var(--color-background-tertiary)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {renderAutosaveStatus()}
          </div>
          
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3" />
                  Save Now
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={onSubmit} className="space-y-8">
          <CompanyProfileForm
            register={register}
            control={control}
            errors={errors}
          />
          
          <div className="border-t border-[var(--color-border-light)] pt-6">
            <OpportunityDetailsForm
              register={register}
              control={control}
              errors={errors}
            />
          </div>

          {/* Additional Lead Fields */}
          <div className="border-t border-[var(--color-border-light)] pt-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Created At
                </label>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {lead.created_at ? new Date(lead.created_at).toLocaleString() : 'Not available'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Last Updated
                </label>
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {lead.updated_at ? new Date(lead.updated_at).toLocaleString() : 'Not available'}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailsTab;
