// src/hooks/useClientForm.ts
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod'; // TODO: Use when needed
import { useToast } from './useToast';
// import { useUpdateClient } from './queries';

// Use the centralized schema from lib/schemas.ts
import { clientOnboardingSchema, type ClientOnboardingFormData } from '../lib/schemas';

interface UseClientFormProps {
  clientId?: string;
  defaultValues?: Partial<ClientOnboardingFormData>;
}

export const useClientForm = ({ defaultValues }: UseClientFormProps = {}) => {
  const { addToast } = useToast();
  // TODO: Uncomment when client hooks are available
  // const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();

  const form = useForm({
    resolver: zodResolver(clientOnboardingSchema),
    defaultValues: {
      company_name: '',
      business_id_number: '',
      rs_username: '',
      rs_password: '',
      user_emails: [],
      bank_details: [],
      onboarding_completed: false,
      ...defaultValues,
    },
    mode: 'onChange', // Validate on every change for real-time feedback
  });

  // useFieldArray for dynamic user emails
  const userEmailsArray = useFieldArray({
    control: form.control,
    name: 'user_emails',
  });

  // useFieldArray for dynamic bank details
  const bankDetailsArray = useFieldArray({
    control: form.control,
    name: 'bank_details',
  });

  const addUserEmail = () => {
    userEmailsArray.append({ email: '' });
  };

  const removeUserEmail = (index: number) => {
    userEmailsArray.remove(index);
  };

  const addBankAccount = () => {
    bankDetailsArray.append({
      bankName: '',
      iban: '',
      clientId: '',
      clientSecret: '',
    });
  };

  const removeBankAccount = (index: number) => {
    bankDetailsArray.remove(index);
  };

  const onSubmit = async (data: ClientOnboardingFormData) => {
    try {
      console.log('Submitting client form data:', data);
      
      // TODO: Uncomment when client hooks are available
      // if (clientId) {
      //   await updateClient({ clientId, data });
      //   addToast('Client information updated successfully', 'success');
      // }

      // For now, just show success
      addToast('Client onboarding information saved successfully', 'success');
    } catch (error) {
      console.error('Error saving client information:', error);
      addToast('Failed to save client information', 'error');
    }
  };

  const completeOnboarding = async () => {
    try {
      const currentData = form.getValues();
      const updatedData: ClientOnboardingFormData = {
        ...currentData,
        user_emails: currentData.user_emails || [],
        bank_details: currentData.bank_details || [],
        onboarding_completed: true,
      };

      await onSubmit(updatedData);
      form.setValue('onboarding_completed', true);
      addToast('Client onboarding completed successfully!', 'success');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      addToast('Failed to complete onboarding', 'error');
    }
  };

  return {
    form,
    formState: form.formState,
    register: form.register,
    control: form.control,
    handleSubmit: form.handleSubmit,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    reset: form.reset,
    
    // Field arrays
    userEmailsArray,
    bankDetailsArray,
    addUserEmail,
    removeUserEmail,
    addBankAccount,
    removeBankAccount,
    
    // Actions
    onSubmit,
    completeOnboarding,
    isUpdating: false, // TODO: Replace with actual loading state
  };
};
