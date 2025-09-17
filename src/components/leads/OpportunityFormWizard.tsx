// src/components/leads/OpportunityFormWizard.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useOpportunityForm } from '../../hooks/useOpportunityForm';
import CompanyProfileForm from './form-sections/CompanyProfileForm';
import OpportunityDetailsForm from './form-sections/OpportunityDetailsForm';

interface OpportunityFormWizardProps {
  onClose: () => void;
}

const STEPS = [
  {
    id: 'company',
    title: 'Company Profile',
    description: 'Basic company information',
  },
  {
    id: 'opportunity',
    title: 'Opportunity Details',
    description: 'Lead ownership and potential value',
  },
];

const OpportunityFormWizard = ({ onClose }: OpportunityFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const { form, onSubmit, isSubmitting } = useOpportunityForm({
    mode: 'create',
    onSuccess: () => {
      // Form will handle closing via onClose prop
    },
    onClose,
  });

  const { register, control, formState: { errors }, trigger } = form;

  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = async () => {
    // Validate current step fields
    let fieldsToValidate: (keyof typeof errors)[] = [];
    
    if (currentStep === 0) {
      fieldsToValidate = ['company_name', 'industry'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['lead_owner'];
    }

    const isValid = await trigger(fieldsToValidate as never);
    
    if (isValid && !isLastStep) {
      setCurrentStep(currentStep + 1);
    } else if (isValid && isLastStep) {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CompanyProfileForm
            register={register}
            control={control}
            errors={errors}
          />
        );
      case 1:
        return (
          <OpportunityDetailsForm
            register={register}
            control={control}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200
                    ${index < currentStep
                      ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
                      : index === currentStep
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-background-secondary)] border-[var(--color-border)] text-[var(--color-text-muted)]'
                    }
                  `}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    index <= currentStep 
                      ? 'text-[var(--color-text-primary)]' 
                      : 'text-[var(--color-text-muted)]'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`
                  w-16 h-0.5 mx-4 transition-all duration-200
                  ${index < currentStep 
                    ? 'bg-[var(--color-success)]' 
                    : 'bg-[var(--color-border)]'
                  }
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)]">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-text-muted)]">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            
            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Creating...
                </>
              ) : isLastStep ? (
                <>
                  <Check className="h-4 w-4" />
                  Create Lead
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityFormWizard;
