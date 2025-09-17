// src/components/leads/form-sections/CompanyProfileForm.tsx
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { INDUSTRY_OPTIONS, LEAD_SOURCE_OPTIONS } from '../../../lib/constants';
import type { LeadFormData } from '../../../lib/schemas';

interface CompanyProfileFormProps {
  register: UseFormRegister<LeadFormData>;
  control: Control<LeadFormData>;
  errors: FieldErrors<LeadFormData>;
}

const CompanyProfileForm = ({ register, errors }: CompanyProfileFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Company Information
        </h3>
        <div className="space-y-4">
          {/* Company Name */}
          <div>
            <Label htmlFor="company_name" required>
              Company Name
            </Label>
            <Input
              id="company_name"
              {...register('company_name')}
              error={!!errors.company_name}
              placeholder="Enter company name"
              className="mt-1"
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-[var(--color-destructive)]">
                {errors.company_name.message}
              </p>
            )}
          </div>

          {/* Industry */}
          <div>
            <Label htmlFor="industry" required>
              Industry
            </Label>
            <Select
              id="industry"
              {...register('industry')}
              error={!!errors.industry}
              className="mt-1"
            >
              <option value="">Select an industry</option>
              {INDUSTRY_OPTIONS.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </Select>
            {errors.industry && (
              <p className="mt-1 text-sm text-[var(--color-destructive)]">
                {errors.industry.message}
              </p>
            )}
          </div>

          {/* Lead Source */}
          <div>
            <Label htmlFor="lead_source">
              Lead Source
            </Label>
            <Select
              id="lead_source"
              {...register('lead_source')}
              className="mt-1"
            >
              <option value="">Select a source</option>
              {LEAD_SOURCE_OPTIONS.map((source) => (
                <option key={source.value} value={source.value || ''}>
                  {source.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
