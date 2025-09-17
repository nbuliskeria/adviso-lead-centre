import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, LayoutGrid, Table2 } from 'lucide-react';
import { useLeads, useUpdateLead } from '../hooks/queries';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../lib/constants';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/Select';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import KanbanBoard from '../components/kanban/KanbanBoard';
import LeadCard from '../components/leads/LeadCard';
import LeadsTable from '../components/leads/LeadsTable';
import OpportunityCanvas from '../components/leads/OpportunityCanvas';
import ConversionModal from '../components/leads/ConversionModal';
import { useConversionWorkflow } from '../hooks/useConversionWorkflow';
import type { LeadType } from '../components/leads/LeadCard';
import type { KanbanColumn } from '../components/kanban/KanbanBoard';

type ViewMode = 'kanban' | 'table';

function LeadsPage() {
  // Data fetching and mutations
  const { data: leads = [], isLoading, error } = useLeads();
  const { mutate: updateLead } = useUpdateLead();

  // Local state for UI controls
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  
  // Opportunity Canvas state (Phase 6)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const isCanvasOpen = selectedLeadId !== null;

  // Navigation state handling for dashboard drill-down
  const location = useLocation();

  useEffect(() => {
    // Handle navigation state from dashboard charts
    if (location.state?.statusFilter) {
      setStatusFilter(location.state.statusFilter);
    }
    if (location.state?.sourceFilter) {
      setSourceFilter(location.state.sourceFilter);
    }
    // Clear the state so it doesn't re-apply on back navigation
    if (location.state?.statusFilter || location.state?.sourceFilter) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Lead-to-Client Conversion workflow (Phase 7)
  const {
    isConversionModalOpen,
    selectedLead,
    openConversionModal,
    closeConversionModal,
    handleConversion,
    isConverting,
  } = useConversionWorkflow();

  // Helper function to get status colors
  const getStatusColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
      blue: '#3B82F6',
      green: '#10B981',
      yellow: '#F59E0B',
      orange: '#F97316',
      emerald: '#059669',
      red: '#EF4444',
      gray: '#6B7280',
    };
    return colorMap[colorName] || colorMap.gray;
  };

  // Client-side filtering with useMemo for performance
  const filteredLeads = useMemo(() => {
    return leads.filter((lead: LeadType) => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          lead.company_name.toLowerCase().includes(searchLower) ||
          lead.industry.toLowerCase().includes(searchLower) ||
          lead.lead_owner.toLowerCase().includes(searchLower) ||
          (lead.lead_owner_profile?.display_name?.toLowerCase().includes(searchLower)) ||
          (lead.lead_owner_profile?.first_name?.toLowerCase().includes(searchLower)) ||
          (lead.lead_owner_profile?.last_name?.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter && lead.status !== statusFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter && lead.lead_source !== sourceFilter) {
        return false;
      }

      return true;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  // Kanban columns generation
  const kanbanColumns: KanbanColumn[] = useMemo(() => {
    return LEAD_STATUS_OPTIONS.map((status) => {
      const columnLeads = filteredLeads.filter((lead: LeadType) => 
        (lead.status || 'New Lead') === status.value
      );
      
      return {
        id: status.value as string, // Type assertion since we know status.value is string
        title: status.label,
        color: getStatusColor(status.color),
        items: columnLeads.map((lead: LeadType) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => handleSelectLead(lead.id)}
            onConvert={openConversionModal}
          />
        )),
      };
    });
  }, [filteredLeads]);

  // Event handlers
  const handleMoveLead = (leadId: string, newStatus: string) => {
    updateLead({ id: leadId, updates: { status: newStatus } });
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
  };

  const handleCloseCanvas = () => {
    setSelectedLeadId(null);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleCreateLead = () => {
    setSelectedLeadId('new');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Lead Database</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Manage and track all your leads in one place.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
            <p className="text-[var(--color-text-secondary)]">Loading leads...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Lead Database</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Manage and track all your leads in one place.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-[var(--color-destructive)] mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
              Error Loading Leads
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              {error.message || 'Failed to load leads. Please try again.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Lead Database</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage and track all your leads in one place.
          </p>
        </div>
        
        <Button onClick={handleCreateLead} className="gap-2">
          <Plus className="h-4 w-4" />
          Log Opportunity
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="w-full sm:w-80">
            <SearchInput
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={handleClearSearch}
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {LEAD_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value || ''}>
                  {status.label}
                </option>
              ))}
            </Select>
            
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">All Sources</option>
              {LEAD_SOURCE_OPTIONS.map((source) => (
                <option key={source.value} value={source.value || ''}>
                  {source.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <SegmentedControl
          options={[
            { value: 'kanban', label: 'Board', icon: <LayoutGrid className="h-4 w-4" /> },
            { value: 'table', label: 'Table', icon: <Table2 className="h-4 w-4" /> },
          ]}
          value={viewMode}
          onChange={(value) => setViewMode(value as ViewMode)}
        />
      </div>

      {/* Results Summary */}
      <div className="text-sm text-[var(--color-text-muted)]">
        Showing {filteredLeads.length} of {leads.length} leads
      </div>

      {/* Main Content */}
      <div className="min-h-[600px]">
        {viewMode === 'kanban' ? (
          <KanbanBoard
            columns={kanbanColumns}
            onMoveItem={handleMoveLead}
          />
        ) : (
          <LeadsTable
            leads={filteredLeads}
            onSelectLead={handleSelectLead}
            onConvert={openConversionModal}
          />
        )}
      </div>

      {/* Opportunity Canvas */}
      <OpportunityCanvas
        leadId={selectedLeadId}
        onClose={handleCloseCanvas}
      />

      {/* Lead-to-Client Conversion Modal */}
      <ConversionModal
        isOpen={isConversionModalOpen}
        onClose={closeConversionModal}
        lead={selectedLead}
        onConvert={handleConversion}
        isLoading={isConverting}
      />
    </div>
  );
}

export default LeadsPage;
