// src/components/leads/LeadsTable.tsx
// import { useMemo } from 'react'; // Removed as not currently used
import { format } from 'date-fns';
import { Building2, DollarSign, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { cn } from '../../lib/utils';
import type { LeadType } from './LeadCard';

interface LeadsTableProps {
  leads: LeadType[];
  onSelectLead: (leadId: string) => void;
  onConvert?: (lead: any) => void; // TODO: Fix type when database is connected
  className?: string;
}

const LeadsTable = ({ leads, onSelectLead, onConvert, className }: LeadsTableProps) => {
  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getOwnerDisplayName = (lead: LeadType) => {
    if (lead.lead_owner_profile?.display_name) {
      return lead.lead_owner_profile.display_name;
    }
    if (lead.lead_owner_profile?.first_name && lead.lead_owner_profile?.last_name) {
      return `${lead.lead_owner_profile.first_name} ${lead.lead_owner_profile.last_name}`;
    }
    return lead.lead_owner || 'Unassigned';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Qualified': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Proposal': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Negotiation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Closed Won': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'Closed Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                Company
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                Priority
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                Value
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                Owner
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                Source
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                Created
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-primary)]">
                Actions
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className={cn(
                  'border-b border-[var(--color-border-light)] cursor-pointer transition-colors duration-200',
                  'hover:bg-[var(--color-background-tertiary)]'
                )}
              >
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">
                      {lead.company_name}
                    </div>
                    <div className="text-sm text-[var(--color-text-muted)] flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {lead.industry}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {lead.status && (
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(lead.status)
                    )}>
                      {lead.status}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {lead.priority && (
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getPriorityColor(lead.priority)
                    )}>
                      {lead.priority}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1 text-[var(--color-success)] font-medium">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(lead.potential_mrr)}
                    {lead.potential_mrr && <span className="text-xs text-[var(--color-text-muted)]">/mo</span>}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={getOwnerDisplayName(lead)}
                      src={lead.lead_owner_profile?.avatar_url || undefined}
                      size="sm"
                    />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {getOwnerDisplayName(lead)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {lead.lead_source || '-'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                    <Calendar className="h-3 w-3" />
                    {formatDate(lead.created_at)}
                  </div>
                </td>
                <td className="py-4 px-4">
                  {lead.status === 'Won' && onConvert && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onConvert(lead);
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary)]/90 transition-colors"
                    >
                      <ArrowRight className="h-3 w-3" />
                      Convert
                    </button>
                  )}
                </td>
                <td className="py-4 px-4">
                  <ExternalLink className="h-4 w-4 text-[var(--color-text-muted)]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onSelectLead(lead.id)}
            className={cn(
              'p-4 rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card)]',
              'cursor-pointer transition-all duration-200 hover:shadow-md',
              'dark:backdrop-blur-sm'
            )}
            style={{
              boxShadow: 'var(--color-card-shadow)',
            } as React.CSSProperties}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                  {lead.company_name}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {lead.industry}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-[var(--color-text-muted)] flex-shrink-0 ml-2" />
            </div>

            {/* Status and Priority */}
            <div className="flex items-center gap-2 mb-3">
              {lead.status && (
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(lead.status)
                )}>
                  {lead.status}
                </span>
              )}
              {lead.priority && (
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getPriorityColor(lead.priority)
                )}>
                  {lead.priority}
                </span>
              )}
            </div>

            {/* Value */}
            {lead.potential_mrr && (
              <div className="flex items-center gap-1 text-[var(--color-success)] font-medium mb-3">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(lead.potential_mrr)}
                <span className="text-xs text-[var(--color-text-muted)]">/mo</span>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border-light)]">
              <div className="flex items-center gap-2">
                <Avatar
                  name={getOwnerDisplayName(lead)}
                  src={lead.lead_owner_profile?.avatar_url || undefined}
                  size="sm"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {getOwnerDisplayName(lead)}
                </span>
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {lead.lead_source || 'No source'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {leads.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
            No leads found
          </h3>
          <p className="text-[var(--color-text-muted)]">
            Try adjusting your filters or create a new lead to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
