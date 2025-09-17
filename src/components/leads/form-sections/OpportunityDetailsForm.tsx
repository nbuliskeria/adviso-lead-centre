// src/components/leads/form-sections/OpportunityDetailsForm.tsx
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { LEAD_STATUS_OPTIONS, LEAD_PRIORITY_OPTIONS, SUBSCRIPTION_PACKAGE_OPTIONS } from '../../../lib/constants';
import type { LeadFormData } from '../../../lib/schemas';

interface OpportunityDetailsFormProps {
  register: UseFormRegister<LeadFormData>;
  control: Control<LeadFormData>;
  errors: FieldErrors<LeadFormData>;
}

const OpportunityDetailsForm = ({ register, control, errors }: OpportunityDetailsFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Opportunity Details
        </h3>
        <div className="space-y-4">
          {/* Lead Owner */}
          <div>
            <Label htmlFor="lead_owner" required>
              Lead Owner
            </Label>
            <Input
              id="lead_owner"
              {...register('lead_owner')}
              error={!!errors.lead_owner}
              placeholder="Enter lead owner name"
              className="mt-1"
            />
            {errors.lead_owner && (
              <p className="mt-1 text-sm text-[var(--color-destructive)]">
                {errors.lead_owner.message}
              </p>
            )}
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">
                Status
              </Label>
              <Select
                id="status"
                {...register('status')}
                className="mt-1"
              >
                <option value="">Select status</option>
                {LEAD_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value || ''}>
                    {status.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">
                Priority
              </Label>
              <Select
                id="priority"
                {...register('priority')}
                className="mt-1"
              >
                <option value="">Select priority</option>
                {LEAD_PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority.value} value={priority.value || ''}>
                    {priority.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Potential MRR */}
          <div>
            <Label htmlFor="potential_mrr">
              Potential Monthly Recurring Revenue
            </Label>
            <Controller
              name="potential_mrr"
              control={control}
              render={({ field }) => (
                <Input
                  id="potential_mrr"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="mt-1"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? null : parseFloat(value));
                  }}
                  error={!!errors.potential_mrr}
                />
              )}
            />
            {errors.potential_mrr && (
              <p className="mt-1 text-sm text-[var(--color-destructive)]">
                {errors.potential_mrr.message}
              </p>
            )}
          </div>

          {/* Subscription Package */}
          <div>
            <Label htmlFor="subscription_package">
              Subscription Package
            </Label>
            <Select
              id="subscription_package"
              {...register('subscription_package')}
              className="mt-1"
            >
              <option value="">Select package</option>
              {SUBSCRIPTION_PACKAGE_OPTIONS.map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailsForm;
