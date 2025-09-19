// src/components/clients/onboarding/CompanyIdCard.tsx
import { useState } from 'react';
import { Building2, Download, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import { CopyableField } from '../../ui/CopyableField';
import { useToast } from '../../../hooks/useToast';
import type { Control, FieldErrors } from 'react-hook-form';
// import type { ClientOnboardingFormData } from '../../../lib/schemas'; // TODO: Use when needed

interface CompanyIdCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

interface MockCompanyData {
  companyName: string;
  registrationNumber: string;
  taxNumber: string;
  legalAddress: string;
  status: string;
}

const CompanyIdCard = ({ register, errors }: CompanyIdCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<MockCompanyData | null>(null);
  const { addToast } = useToast();

  const handleFetchFromRSGE = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data that would come from RS.GE API
      const mockData: MockCompanyData = {
        companyName: 'Adviso Technologies LLC',
        registrationNumber: '206123456',
        taxNumber: '123456789',
        legalAddress: '123 Rustaveli Avenue, Tbilisi, Georgia',
        status: 'Active',
      };
      
      setFetchedData(mockData);
      addToast('Company information fetched successfully from RS.GE', 'success');
    } catch {
      addToast('Failed to fetch company information', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
          Company Identification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Business ID Number Input */}
        <div>
          <Label htmlFor="business_id_number" required>
            Business Identification Number
          </Label>
          <Input
            id="business_id_number"
            placeholder="Enter business ID number"
            {...register('business_id_number')}
            error={errors.business_id_number?.message}
          />
        </div>

        {/* Fetch Button */}
        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={handleFetchFromRSGE}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Fetch from RS.GE
              </>
            )}
          </Button>
        </div>

        {/* Fetched Data Display */}
        {fetchedData && (
          <div className="mt-6 p-4 bg-[var(--color-background-secondary)] rounded-lg border border-[var(--color-border)]">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-[var(--color-success)]" />
              <span className="text-sm font-medium text-[var(--color-success)]">
                Data fetched successfully
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CopyableField
                label="Company Name"
                value={fetchedData.companyName}
              />
              <CopyableField
                label="Registration Number"
                value={fetchedData.registrationNumber}
              />
              <CopyableField
                label="Tax Number"
                value={fetchedData.taxNumber}
              />
              <CopyableField
                label="Status"
                value={fetchedData.status}
              />
            </div>
            
            <div className="mt-4">
              <CopyableField
                label="Legal Address"
                value={fetchedData.legalAddress}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyIdCard;
