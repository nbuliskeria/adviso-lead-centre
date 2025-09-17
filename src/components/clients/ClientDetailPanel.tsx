// src/components/clients/ClientDetailPanel.tsx
import { useState } from 'react';
import { X, Building2, Calendar, DollarSign, Package } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Button } from '../ui/Button';
import Avatar from '../ui/Avatar';
// import { useClient, useTaskTemplates, useApplyTemplate } from '../../hooks/queries';
import { useToast } from '../../hooks/useToast';
import { CLIENT_STATUS_OPTIONS } from '../../lib/constants';
import OnboardingInfoTab from './onboarding/OnboardingInfoTab';

interface ClientDetailPanelProps {
  isOpen: boolean;
  clientId: string | null;
  onClose: () => void;
}

export default function ClientDetailPanel({ isOpen, clientId, onClose }: ClientDetailPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { addToast } = useToast();

  // TODO: Uncomment when database tables are created
  // const { data: client, isLoading: clientLoading } = useClient(clientId || '');
  // const { data: templates = [] } = useTaskTemplates();
  // const { mutate: applyTemplate, isPending: isApplyingTemplate } = useApplyTemplate();

  // Mock data for development
  const client = null;
  const clientLoading = false;
  const templates: any[] = [];
  const isApplyingTemplate = false;

  const handleApplyTemplate = (templateId: string) => {
    if (!clientId) return;

    // TODO: Uncomment when database tables are created
    // applyTemplate(
    //   { clientId, templateId, assigneeId: client?.account_manager_id },
    //   {
    //     onSuccess: () => {
    //       addToast('Onboarding template applied successfully!', 'success');
    //     },
    //     onError: (error) => {
    //       addToast(`Failed to apply template: ${error.message}`, 'error');
    //     },
    //   }
    // );

    // For now, just show a success message
    addToast('Onboarding template would be applied here!', 'info');
  };

  const getStatusColor = (status: string) => {
    const statusOption = CLIENT_STATUS_OPTIONS.find(opt => opt.value === status);
    const colorMap: Record<string, string> = {
      green: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colorMap[statusOption?.color || 'gray'];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isOpen || !clientId) {
    return null;
  }

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Client Details">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {client?.company_name || 'Client Details'}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {client?.original_lead?.industry || 'Loading...'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {clientLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
                <div className="w-5 h-5 border-2 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin" />
                Loading client details...
              </div>
            </div>
          ) : !client ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--color-background-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-[var(--color-text-muted)]" />
                </div>
                <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                  Client not found
                </h3>
                <p className="text-[var(--color-text-muted)]">
                  The requested client could not be loaded.
                </p>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <TabsList className="px-6 pt-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="p-6 space-y-6">
                  {/* Status and Key Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Status</label>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.client_status)}`}>
                            {CLIENT_STATUS_OPTIONS.find(opt => opt.value === client.client_status)?.label || client.client_status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Account Manager</label>
                        <div className="mt-1 flex items-center gap-2">
                          <Avatar
                            src={client.account_manager?.avatar_url}
                            name={client.account_manager?.display_name || 'Account Manager'}
                            size="sm"
                          />
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {client.account_manager?.display_name || 
                             `${client.account_manager?.first_name || ''} ${client.account_manager?.last_name || ''}`.trim() ||
                             'Unassigned'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Business ID</label>
                        <div className="mt-1">
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {client.business_id_number || 'Not provided'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Subscription Package</label>
                        <div className="mt-1 flex items-center gap-2">
                          <Package className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {client.subscription_package || 'Not specified'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Monthly Value</label>
                        <div className="mt-1 flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span className="text-sm font-medium text-[var(--color-text-primary)]">
                            {client.monthly_value ? `${formatCurrency(client.monthly_value)}/month` : 'Not set'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-[var(--color-text-muted)]">Contract Start</label>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                          <span className="text-sm text-[var(--color-text-primary)]">
                            {client.contract_start_date ? formatDate(client.contract_start_date) : 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Original Lead Info */}
                  {client.original_lead && (
                    <div className="bg-[var(--color-background-secondary)] rounded-lg p-4">
                      <h3 className="font-medium text-[var(--color-text-primary)] mb-3">Original Lead Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[var(--color-text-muted)]">Industry:</span>
                          <span className="ml-2 text-[var(--color-text-primary)]">
                            {client.original_lead.industry}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-muted)]">Source:</span>
                          <span className="ml-2 text-[var(--color-text-primary)]">
                            {client.original_lead.lead_source || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="onboarding" className="p-6">
                  <OnboardingInfoTab
                    clientId={clientId}
                    initialData={client}
                  />
                </TabsContent>

                <TabsContent value="timeline" className="p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[var(--color-background-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-[var(--color-text-muted)]" />
                    </div>
                    <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                      Timeline Coming Soon
                    </h3>
                    <p className="text-[var(--color-text-muted)]">
                      Client activity timeline will be available in a future update.
                    </p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </div>
    </SidePanel>
  );
}
