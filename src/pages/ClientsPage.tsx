import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Users, Filter } from 'lucide-react';
// import { useClients } from '../hooks/queries'; // TODO: Uncomment when database is ready
import { CLIENT_STATUS_OPTIONS, SUBSCRIPTION_PACKAGE_OPTIONS } from '../lib/constants';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/Select';
import ClientsTable from '../components/clients/ClientsTable';
import ClientDetailPanel from '../components/clients/ClientDetailPanel';
import { useToast } from '../hooks/useToast';

function ClientsPage() {
  const location = useLocation();
  const { addToast } = useToast();
  
  // TODO: Uncomment when database tables are created
  // const { data: clients = [], isLoading, error } = useClients();
  
  // Mock data for development
  const clients: any[] = [];
  const isLoading = false;
  const error = null;

  // Local state for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  
  // Client detail panel state
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Handle navigation state (from lead conversion)
  useEffect(() => {
    if (location.state?.message) {
      addToast(location.state.message, 'success');
      
      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title);
    }
    
    if (location.state?.newClientId) {
      setSelectedClientId(location.state.newClientId);
      setIsDetailPanelOpen(true);
    }
  }, [location.state, addToast]);

  // Filter clients based on search and filters
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = !searchTerm || 
        client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.account_manager?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.business_id_number?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || client.client_status === statusFilter;
      const matchesPackage = !packageFilter || client.subscription_package === packageFilter;

      return matchesSearch && matchesStatus && matchesPackage;
    });
  }, [clients, searchTerm, statusFilter, packageFilter]);

  // Event handlers
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setIsDetailPanelOpen(true);
  };

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedClientId(null);
  };

  const handleAddClient = () => {
    addToast('Direct client creation will be available in a future update. Convert leads to create clients.', 'info');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-[var(--color-destructive)] mb-4">
            Failed to load clients: {error.message}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Client Space</h1>
          <p className="text-[var(--color-text-muted)]">
            Manage your active clients and their onboarding journey.
          </p>
        </div>
        <Button onClick={handleAddClient} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <SearchInput
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="min-w-[160px]">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Statuses</option>
              {CLIENT_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="min-w-[160px]">
            <Select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="w-full"
            >
              <option value="">All Packages</option>
              {SUBSCRIPTION_PACKAGE_OPTIONS.map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
        <Users className="w-4 h-4" />
        <span>
          Showing {filteredClients.length} of {clients.length} clients
        </span>
        {(searchTerm || statusFilter || packageFilter) && (
          <span className="flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Filtered
          </span>
        )}
      </div>

      {/* Clients Table */}
      <div className="bg-[var(--color-background)] rounded-lg border border-[var(--color-border)] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[var(--color-background-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[var(--color-text-muted)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                Failed to load clients
              </h3>
              <p className="text-[var(--color-text-muted)]">
                Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-[var(--color-background-secondary)] rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
              {clients.length === 0 ? 'No clients yet' : 'No clients found'}
            </h3>
            <p className="text-[var(--color-text-muted)] mb-4 max-w-sm">
              {clients.length === 0 
                ? 'Convert won leads to clients to start building your client base.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {clients.length === 0 && (
              <Button variant="outline" onClick={() => window.location.href = '/lead-database'}>
                Go to Lead Database
              </Button>
            )}
          </div>
        ) : (
          <ClientsTable
            clients={filteredClients}
            onSelectClient={handleSelectClient}
          />
        )}
      </div>

      {/* Client Detail Panel */}
      <ClientDetailPanel
        isOpen={isDetailPanelOpen}
        clientId={selectedClientId}
        onClose={handleCloseDetailPanel}
      />
    </div>
  );
}

export default ClientsPage;
