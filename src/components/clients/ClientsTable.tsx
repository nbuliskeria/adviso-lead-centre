// src/components/clients/ClientsTable.tsx
import { Calendar, DollarSign, User, Building2, Package } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { CLIENT_STATUS_OPTIONS } from '../../lib/constants';

// Temporary type until database types are available
interface ClientRow {
  id: string;
  company_name: string;
  status?: string; // Changed from client_status to match our mock data
  subscription_package?: string;
  monthly_value?: number;
  contract_start_date?: string;
  business_id_number?: string;
  industry?: string; // Added directly to client
  lead_source?: string; // Added directly to client
  account_manager_id?: string;
  account_manager?: {
    id: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  created_at: string;
  converted_at?: string;
  onboarding_completed?: boolean;
  health?: string;
}

interface ClientsTableProps {
  clients: ClientRow[];
  onSelectClient: (clientId: string) => void;
}

export default function ClientsTable({ clients, onSelectClient }: ClientsTableProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left py-3 px-4 font-medium text-[var(--color-text-muted)] text-sm">
                Client
              </th>
              <th className="text-left py-3 px-4 font-medium text-[var(--color-text-muted)] text-sm">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-[var(--color-text-muted)] text-sm">
                Account Manager
              </th>
              <th className="text-left py-3 px-4 font-medium text-[var(--color-text-muted)] text-sm">
                Package
              </th>
              <th className="text-left py-3 px-4 font-medium text-[var(--color-text-muted)] text-sm">
                Monthly Value
              </th>
              <th className="text-left py-3 px-4 font-medium text-[var(--color-text-muted)] text-sm">
                Start Date
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-background-secondary)] cursor-pointer transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-text-primary)]">
                        {client.company_name}
                      </div>
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {client.industry || 'Unknown Industry'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status || 'Active')}`}>
                    {CLIENT_STATUS_OPTIONS.find(opt => opt.value === client.status)?.label || client.status || 'Active'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
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
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {client.subscription_package || 'Not specified'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      {client.monthly_value ? `${formatCurrency(client.monthly_value)}/mo` : 'Not set'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {client.contract_start_date ? formatDate(client.contract_start_date) : formatDate(client.created_at)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 p-4">
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg p-4 cursor-pointer hover:bg-[var(--color-background-secondary)] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <div className="font-medium text-[var(--color-text-primary)]">
                    {client.company_name}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)]">
                    {client.industry || 'Unknown Industry'}
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status || 'Active')}`}>
                {CLIENT_STATUS_OPTIONS.find(opt => opt.value === client.status)?.label || client.status || 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text-primary)] truncate">
                  {client.account_manager?.display_name || 
                   `${client.account_manager?.first_name || ''} ${client.account_manager?.last_name || ''}`.trim() ||
                   'Unassigned'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text-primary)]">
                  {client.monthly_value ? `${formatCurrency(client.monthly_value)}/mo` : 'Not set'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text-primary)] truncate">
                  {client.subscription_package || 'Not specified'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
                <span className="text-[var(--color-text-primary)]">
                  {client.contract_start_date ? formatDate(client.contract_start_date) : formatDate(client.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
