// src/components/leads/LeadCard.tsx
import { useMemo } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Building2, DollarSign, Calendar, AlertCircle, CheckSquare } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Avatar from '../ui/Avatar';
import { cn } from '../../lib/utils';

// Type based on our database schema
type LeadType = {
  id: string;
  company_name: string;
  industry: string;
  lead_owner: string;
  status: string | null;
  lead_source: string | null;
  priority: string | null;
  potential_mrr: number | null;
  last_activity_at: string | null;
  created_at: string | null;
  lead_owner_profile?: {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
};

interface LeadCardProps {
  lead: LeadType;
  onClick: () => void;
  isDragging?: boolean;
}

const LeadCard = ({ lead, onClick, isDragging = false }: LeadCardProps) => {
  // Format potential value
  const formattedValue = useMemo(() => {
    if (!lead.potential_mrr) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(lead.potential_mrr);
  }, [lead.potential_mrr]);

  // Get display name for lead owner
  const ownerDisplayName = useMemo(() => {
    if (lead.lead_owner_profile?.display_name) {
      return lead.lead_owner_profile.display_name;
    }
    if (lead.lead_owner_profile?.first_name && lead.lead_owner_profile?.last_name) {
      return `${lead.lead_owner_profile.first_name} ${lead.lead_owner_profile.last_name}`;
    }
    return lead.lead_owner || 'Unassigned';
  }, [lead.lead_owner_profile, lead.lead_owner]);

  // Check if last activity is overdue (for demo purposes, using last_activity_at)
  const isOverdue = useMemo(() => {
    if (!lead.last_activity_at) return false;
    return isPast(new Date(lead.last_activity_at)) && !isToday(new Date(lead.last_activity_at));
  }, [lead.last_activity_at]);

  // Format last activity date
  const formattedDate = useMemo(() => {
    if (!lead.last_activity_at) return null;
    const date = new Date(lead.last_activity_at);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM d');
  }, [lead.last_activity_at]);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:scale-[1.02]',
        'border border-[var(--color-card-border)]',
        isDragging && 'opacity-50 rotate-2 scale-105',
        'dark:glow-accent'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with Company Name and Priority */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
              {lead.company_name}
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3" />
              {lead.industry}
            </p>
          </div>
          
          {lead.priority && (
            <div className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              lead.priority === 'Critical' && 'bg-[var(--color-destructive-light)] text-[var(--color-destructive)]',
              lead.priority === 'High' && 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
              lead.priority === 'Medium' && 'bg-[var(--color-info-light)] text-[var(--color-info)]',
              lead.priority === 'Low' && 'bg-[var(--color-background-tertiary)] text-[var(--color-text-muted)]'
            )}>
              {lead.priority}
            </div>
          )}
        </div>

        {/* Potential Value */}
        {formattedValue && (
          <div className="flex items-center gap-2 text-[var(--color-success)]">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">{formattedValue}/mo</span>
          </div>
        )}

        {/* Lead Source */}
        {lead.lead_source && (
          <div className="text-xs text-[var(--color-text-secondary)]">
            Source: {lead.lead_source}
          </div>
        )}

        {/* Footer with Owner and Last Activity */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-light)]">
          {/* Owner Avatar */}
          <div className="flex items-center gap-2">
            <Avatar
              name={ownerDisplayName}
              src={lead.lead_owner_profile?.avatar_url || undefined}
              size="sm"
            />
            <span className="text-xs text-[var(--color-text-secondary)] truncate max-w-[80px]">
              {ownerDisplayName}
            </span>
          </div>

          {/* Last Activity or Task Count */}
          <div className="flex items-center gap-2">
            {formattedDate && (
              <div className={cn(
                'flex items-center gap-1 text-xs',
                isOverdue ? 'text-[var(--color-destructive)]' : 'text-[var(--color-text-muted)]'
              )}>
                {isOverdue && <AlertCircle className="h-3 w-3" />}
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
            )}
            
            {/* Mock task count - in real app this would come from related data */}
            <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <CheckSquare className="h-3 w-3" />
              <span>0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadCard;
export type { LeadType };
