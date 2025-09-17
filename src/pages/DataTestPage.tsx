// src/pages/DataTestPage.tsx
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLeads, useUsers, useTasks } from '../hooks/queries';
import { useCreateLead } from '../hooks/queries/useUpdateLead';
import { useToast } from '../hooks/useToast';

function DataTestPage() {
  const { addToast } = useToast();
  
  // Test data fetching hooks
  const { data: leads, isLoading: leadsLoading, error: leadsError } = useLeads();
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks();
  
  // Test mutation hook
  const createLeadMutation = useCreateLead();

  const handleCreateTestLead = () => {
    const testLead = {
      company_name: 'Test Company ' + Date.now(),
      industry: 'Technology',
      lead_owner: 'Test Owner',
      // Remove optional fields that might have constraints
      // status: 'New' as const,
      // lead_source: 'Website' as const,
      // priority: 'Low' as const,
      potential_mrr: 1000,
    };

    createLeadMutation.mutate(testLead, {
      onSuccess: () => {
        addToast('Test lead created successfully!', 'success');
      },
      onError: (error) => {
        addToast(`Error creating lead: ${error.message}`, 'error');
      },
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Data Access Layer Test
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg">
          Testing React Query integration with Supabase
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Leads Data
              <span className="text-sm font-normal text-[var(--color-text-muted)]">
                {leadsLoading ? 'Loading...' : `${leads?.length || 0} items`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leadsLoading && (
              <div className="text-[var(--color-text-secondary)]">Loading leads...</div>
            )}
            {leadsError && (
              <div className="text-[var(--color-destructive)]">
                Error: {leadsError.message}
              </div>
            )}
            {leads && (
              <div className="space-y-2">
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Recent leads:
                </div>
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="p-2 bg-[var(--color-background-tertiary)] rounded text-xs">
                    <div className="font-medium">{lead.company_name}</div>
                    <div className="text-[var(--color-text-muted)]">
                      {lead.status} • {lead.industry}
                    </div>
                  </div>
                ))}
                <Button 
                  onClick={handleCreateTestLead}
                  disabled={createLeadMutation.isPending}
                  size="sm"
                  className="w-full mt-3"
                >
                  {createLeadMutation.isPending ? 'Creating...' : 'Create Test Lead'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Users Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Users Data
              <span className="text-sm font-normal text-[var(--color-text-muted)]">
                {usersLoading ? 'Loading...' : `${users?.length || 0} items`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading && (
              <div className="text-[var(--color-text-secondary)]">Loading users...</div>
            )}
            {usersError && (
              <div className="text-[var(--color-destructive)]">
                Error: {usersError.message}
              </div>
            )}
            {users && (
              <div className="space-y-2">
                <div className="text-sm text-[var(--color-text-secondary)]">
                  User profiles:
                </div>
                {users.slice(0, 3).map((user) => (
                  <div key={user.id} className="p-2 bg-[var(--color-background-tertiary)] rounded text-xs">
                    <div className="font-medium">
                      {user.display_name || `${user.first_name} ${user.last_name}`.trim()}
                    </div>
                    <div className="text-[var(--color-text-muted)]">
                      {user.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Tasks Data
              <span className="text-sm font-normal text-[var(--color-text-muted)]">
                {tasksLoading ? 'Loading...' : `${tasks?.length || 0} items`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading && (
              <div className="text-[var(--color-text-secondary)]">Loading tasks...</div>
            )}
            {tasksError && (
              <div className="text-[var(--color-destructive)]">
                Error: {tasksError.message}
              </div>
            )}
            {tasks && (
              <div className="space-y-2">
                <div className="text-sm text-[var(--color-text-secondary)]">
                  Recent tasks:
                </div>
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="p-2 bg-[var(--color-background-tertiary)] rounded text-xs">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-[var(--color-text-muted)]">
                      {task.status} • {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Query Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>React Query Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-[var(--color-text-primary)]">Leads Query</div>
              <div className="text-[var(--color-text-secondary)]">
                Status: {leadsLoading ? 'Loading' : leadsError ? 'Error' : 'Success'}
              </div>
              <div className="text-[var(--color-text-muted)]">
                Count: {leads?.length || 0}
              </div>
            </div>
            <div>
              <div className="font-medium text-[var(--color-text-primary)]">Users Query</div>
              <div className="text-[var(--color-text-secondary)]">
                Status: {usersLoading ? 'Loading' : usersError ? 'Error' : 'Success'}
              </div>
              <div className="text-[var(--color-text-muted)]">
                Count: {users?.length || 0}
              </div>
            </div>
            <div>
              <div className="font-medium text-[var(--color-text-primary)]">Tasks Query</div>
              <div className="text-[var(--color-text-secondary)]">
                Status: {tasksLoading ? 'Loading' : tasksError ? 'Error' : 'Success'}
              </div>
              <div className="text-[var(--color-text-muted)]">
                Count: {tasks?.length || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataTestPage;
