// src/components/leads/ConversionModal.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Calendar, Building2, DollarSign, User, FileText } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Label } from '../ui/Label';
import { useToast } from '../../hooks/useToast';
import { useUsersForSelect } from '../../hooks/queries';
import { conversionSchema, type ConversionFormData } from '../../lib/schemas';
import { SUBSCRIPTION_PACKAGE_OPTIONS } from '../../lib/constants';
import type { Database } from '../../lib/database.types';

type LeadRow = Database['public']['Tables']['leads']['Row'];

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadRow | null;
  onConvert: (leadId: string, conversionDetails: ConversionFormData) => void;
  isLoading?: boolean;
}

export default function ConversionModal({
  isOpen,
  onClose,
  lead,
  onConvert,
  isLoading = false,
}: ConversionModalProps) {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { data: users = [] } = useUsersForSelect();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ConversionFormData>({
    resolver: zodResolver(conversionSchema),
    defaultValues: {
      accountManagerId: lead?.lead_owner_id || '',
      subscriptionPackage: lead?.subscription_package || '',
      monthlyValue: lead?.potential_mrr || undefined,
      contractStartDate: new Date().toISOString().split('T')[0],
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: ConversionFormData) => {
    if (!lead?.id) {
      addToast('No lead selected for conversion', 'error');
      return;
    }

    try {
      await onConvert(lead.id, data);
      addToast(`Successfully converted ${lead.company_name} to client!`, 'success');
      handleClose();
      
      // Navigate to client space after successful conversion
      setTimeout(() => {
        navigate('/client-space', { 
          state: { 
            message: `${lead.company_name} has been successfully converted to a client!`,
            newConversion: true 
          } 
        });
      }, 1000);
    } catch (error) {
      console.error('Conversion error:', error);
      addToast('Failed to convert lead to client. Please try again.', 'error');
    }
  };

  const monthlyValue = watch('monthlyValue');

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-[var(--color-success)]/10 rounded-lg">
            <Building2 className="w-6 h-6 text-[var(--color-success)]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
              Convert Lead to Client
            </h2>
            <p className="text-[var(--color-text-muted)]">
              Convert <span className="font-medium text-[var(--color-text-primary)]">
                {lead?.company_name}
              </span> from a lead to an active client
            </p>
          </div>
        </div>

        {/* Lead Summary */}
        <div className="bg-[var(--color-background-secondary)] rounded-lg p-4 mb-6">
          <h3 className="font-medium text-[var(--color-text-primary)] mb-3">Lead Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[var(--color-text-muted)]">Company:</span>
              <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                {lead?.company_name}
              </span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)]">Industry:</span>
              <span className="ml-2 text-[var(--color-text-primary)]">
                {lead?.industry}
              </span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)]">Lead Owner:</span>
              <span className="ml-2 text-[var(--color-text-primary)]">
                {lead?.lead_owner}
              </span>
            </div>
            <div>
              <span className="text-[var(--color-text-muted)]">Potential MRR:</span>
              <span className="ml-2 text-[var(--color-text-primary)] font-medium">
                {lead?.potential_mrr ? `$${lead.potential_mrr.toLocaleString()}/mo` : 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        {/* Conversion Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Manager */}
          <div>
            <Label htmlFor="accountManagerId" required>
              <User className="w-4 h-4" />
              Account Manager
            </Label>
            <Select
              id="accountManagerId"
              {...register('accountManagerId')}
              error={errors.accountManagerId?.message}
            >
              <option value="">Select account manager...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.display_name || `${user.first_name} ${user.last_name}`.trim()}
                </option>
              ))}
            </Select>
          </div>

          {/* Business Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="businessIdNumber">
                <FileText className="w-4 h-4" />
                Business ID Number
              </Label>
              <Input
                id="businessIdNumber"
                type="text"
                placeholder="Enter business registration number"
                {...register('businessIdNumber')}
                error={errors.businessIdNumber?.message}
              />
            </div>

            <div>
              <Label htmlFor="subscriptionPackage">
                Subscription Package
              </Label>
              <Select
                id="subscriptionPackage"
                {...register('subscriptionPackage')}
                error={errors.subscriptionPackage?.message}
              >
                <option value="">Select package...</option>
                {SUBSCRIPTION_PACKAGE_OPTIONS.map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyValue">
                <DollarSign className="w-4 h-4" />
                Monthly Value
              </Label>
              <Input
                id="monthlyValue"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register('monthlyValue', { valueAsNumber: true })}
                error={errors.monthlyValue?.message}
              />
              {monthlyValue && (
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Annual value: ${(monthlyValue * 12).toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contractStartDate">
                <Calendar className="w-4 h-4" />
                Contract Start Date
              </Label>
              <Input
                id="contractStartDate"
                type="date"
                {...register('contractStartDate')}
                error={errors.contractStartDate?.message}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contractEndDate">
              <Calendar className="w-4 h-4" />
              Contract End Date (Optional)
            </Label>
            <Input
              id="contractEndDate"
              type="date"
              {...register('contractEndDate')}
              error={errors.contractEndDate?.message}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">
              <FileText className="w-4 h-4" />
              Conversion Notes (Optional)
            </Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add any notes about the conversion..."
              {...register('notes')}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md 
                       bg-[var(--color-background)] text-[var(--color-text-primary)]
                       placeholder:text-[var(--color-text-muted)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] 
                       focus:border-transparent resize-none"
            />
            {errors.notes && (
              <p className="text-sm text-[var(--color-destructive)] mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!isValid || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Converting...
                </div>
              ) : (
                'Convert to Client'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
