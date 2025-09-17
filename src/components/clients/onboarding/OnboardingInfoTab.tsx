// src/components/clients/onboarding/OnboardingInfoTab.tsx
import { CheckCircle, Rocket } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useClientForm } from '../../../hooks/useClientForm';
import { useToast } from '../../../hooks/useToast';
import CompanyIdCard from './CompanyIdCard';
import CredentialsCard from './CredentialsCard';
import UserEmailsCard from './UserEmailsCard';
import BankDetailsCard from './BankDetailsCard';

interface OnboardingInfoTabProps {
  clientId?: string;
  initialData?: any; // TODO: Type this properly when client types are available
}

const OnboardingInfoTab = ({ clientId, initialData }: OnboardingInfoTabProps) => {
  const { addToast } = useToast();
  
  const {
    form,
    formState,
    register,
    control,
    handleSubmit,
    userEmailsArray,
    bankDetailsArray,
    addUserEmail,
    removeUserEmail,
    addBankAccount,
    removeBankAccount,
    onSubmit,
    completeOnboarding,
    isUpdating,
  } = useClientForm({
    clientId,
    defaultValues: initialData,
  });

  const handleProvisionClientSpace = async () => {
    try {
      // Simulate provisioning process
      addToast('Provisioning client space...', 'info');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete onboarding
      await completeOnboarding();
      
      addToast('Client space provisioned successfully!', 'success');
    } catch (error) {
      console.error('Error provisioning client space:', error);
      addToast('Failed to provision client space', 'error');
    }
  };

  const isFormValid = formState.isValid;
  const isOnboardingCompleted = form.watch('onboarding_completed');

  return (
    <div className="space-y-6">
      {/* Onboarding Status */}
      {isOnboardingCompleted && (
        <div className="flex items-center gap-2 p-4 bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
          <span className="font-medium text-[var(--color-success)]">
            Onboarding completed successfully
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Identification */}
        <CompanyIdCard
          control={control}
          register={register}
          errors={formState.errors}
        />

        {/* RS.GE Credentials */}
        <CredentialsCard
          control={control}
          register={register}
          errors={formState.errors}
        />

        {/* User Email Addresses */}
        <UserEmailsCard
          control={control}
          register={register}
          errors={formState.errors}
          userEmailsArray={userEmailsArray}
          addUserEmail={addUserEmail}
          removeUserEmail={removeUserEmail}
        />

        {/* Bank Account Details */}
        <BankDetailsCard
          control={control}
          register={register}
          errors={formState.errors}
          bankDetailsArray={bankDetailsArray}
          addBankAccount={addBankAccount}
          removeBankAccount={removeBankAccount}
        />

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[var(--color-border)]">
          {/* Save Progress Button */}
          <Button
            type="submit"
            variant="outline"
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Save Progress'
            )}
          </Button>

          {/* Provision Client Space Button */}
          <Button
            type="button"
            onClick={handleProvisionClientSpace}
            disabled={!isFormValid || isOnboardingCompleted || isUpdating}
            className="flex items-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            {isOnboardingCompleted ? 'Client Space Provisioned' : 'Provision Client Space'}
          </Button>
        </div>

        {/* Form Validation Status */}
        {!isFormValid && (
          <div className="text-sm text-[var(--color-text-muted)]">
            <p>Complete all required fields to provision the client space.</p>
            {formState.errors && Object.keys(formState.errors).length > 0 && (
              <p className="text-[var(--color-destructive)] mt-1">
                Please fix the validation errors above.
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingInfoTab;
