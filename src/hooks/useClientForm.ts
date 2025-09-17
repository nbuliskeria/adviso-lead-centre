// src/hooks/useClientForm.ts
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from './useToast';
// import { useUpdateClient } from './queries';

// Zod schema for client onboarding form
const userEmailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const bankDetailsSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  iban: z.string().min(15, 'IBAN must be at least 15 characters').max(34, 'IBAN cannot exceed 34 characters'),
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
});

const clientOnboardingSchema = z.object({
  // Basic client info
  company_name: z.string().min(1, 'Company name is required'),
  business_id_number: z.string().optional(),
  
  // RS.GE Credentials
  rs_username: z.string().optional(),
  rs_password: z.string().optional(),
  
  // Dynamic arrays - these should not be optional with defaults in the schema
  user_emails: z.array(userEmailSchema).default([]),
  bank_details: z.array(bankDetailsSchema).default([]),
  
  // Onboarding status
  onboarding_completed: z.boolean().default(false),
});

export type ClientOnboardingFormData = z.infer<typeof clientOnboardingSchema>;

interface UseClientFormProps {
  clientId?: string;
  defaultValues?: Partial<ClientOnboardingFormData>;
}

export const useClientForm = ({ defaultValues }: UseClientFormProps = {}) => {
  const { addToast } = useToast();
  // TODO: Uncomment when client hooks are available
  // const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();

  const form = useForm<ClientOnboardingFormData>({
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
      const updatedData = {
        ...currentData,
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
