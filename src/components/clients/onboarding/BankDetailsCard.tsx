// src/components/clients/onboarding/BankDetailsCard.tsx
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { PasswordInput } from '../../ui/PasswordInput';
import { Label } from '../../ui/Label';
import type { Control, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
// import type { ClientOnboardingFormData } from '../../../lib/schemas'; // TODO: Use when needed

interface BankDetailsCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bankDetailsArray: UseFieldArrayReturn<any, 'bank_details'>;
  addBankDetail: () => void;
  removeBankDetail: (index: number) => void;
}

const BankDetailsCard = ({ 
  register, 
  bankDetailsArray,
  addBankDetail,
  removeBankDetail 
}: BankDetailsCardProps) => {
  const { fields } = bankDetailsArray;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[var(--color-primary)]" />
          Bank Account Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bank Accounts List */}
        {fields.length > 0 && (
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-background-secondary)]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-[var(--color-text-primary)]">
                    Bank Account {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBankDetail(index)}
                    className="text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Remove bank account</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Name */}
                  <div>
                    <Label htmlFor={`bank_details.${index}.bankName`} required>
                      Bank Name
                    </Label>
                    <Input
                      id={`bank_details.${index}.bankName`}
                      placeholder="e.g., Bank of Georgia"
                      {...register(`bank_details.${index}.bankName`)}
                      error={false}
                    />
                  </div>

                  {/* IBAN */}
                  <div>
                    <Label htmlFor={`bank_details.${index}.iban`} required>
                      IBAN
                    </Label>
                    <Input
                      id={`bank_details.${index}.iban`}
                      placeholder="GE29NB0000000101904917"
                      {...register(`bank_details.${index}.iban`)}
                      error={false}
                    />
                  </div>

                  {/* Client ID */}
                  <div>
                    <Label htmlFor={`bank_details.${index}.clientId`} required>
                      Client ID
                    </Label>
                    <Input
                      id={`bank_details.${index}.clientId`}
                      placeholder="Enter client ID"
                      {...register(`bank_details.${index}.clientId`)}
                      error={false}
                    />
                  </div>

                  {/* Client Secret */}
                  <div>
                    <Label htmlFor={`bank_details.${index}.clientSecret`} required>
                      Client Secret
                    </Label>
                    <PasswordInput
                      id={`bank_details.${index}.clientSecret`}
                      placeholder="Enter client secret"
                      {...register(`bank_details.${index}.clientSecret`)}
                      error={false}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-8 text-[var(--color-text-muted)]">
            <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No bank accounts added yet</p>
            <p className="text-xs mt-1">Click "Add Bank Account" to get started</p>
          </div>
        )}

        {/* Add Bank Account Button */}
        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={addBankDetail}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Bank Account
          </Button>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-[var(--color-text-muted)]">
          Add bank account details for payment processing and financial integrations.
        </div>
      </CardContent>
    </Card>
  );
};

export default BankDetailsCard;
