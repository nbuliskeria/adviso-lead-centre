import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Plus, Users, Building2, CheckSquare, DollarSign } from 'lucide-react';

function DashboardPage() {
  const { profile } = useAuth();
  const { addToast } = useToast();

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.first_name || 'User';
  };

  const handleQuickAction = (action: string) => {
    addToast(`${action} feature coming soon!`, 'info');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            Welcome back, {getDisplayName()}!
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Here's what's happening with your leads today.
          </p>
        </div>
        <Button 
          onClick={() => handleQuickAction('Add New Lead')}
          className="shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards using new Card component */}
        <Card className="group hover:scale-[1.02] transition-all duration-300 float-animation dark:glow-info">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Total Leads</h3>
                <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2">49</p>
                <p className="text-sm text-[var(--color-success)] mt-1 font-medium">+12% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-600/20 rounded-xl dark:glow-info">
                <Users className="h-8 w-8 text-[var(--color-info)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-[1.02] transition-all duration-300 float-animation dark:glow-success" style={{ animationDelay: '1s' } as React.CSSProperties}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Active Clients</h3>
                <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2">23</p>
                <p className="text-sm text-[var(--color-success)] mt-1 font-medium">+8% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/10 dark:to-green-600/20 rounded-xl dark:glow-success">
                <Building2 className="h-8 w-8 text-[var(--color-success)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-[1.02] transition-all duration-300 float-animation dark:glow-warning" style={{ animationDelay: '2s' } as React.CSSProperties}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Pending Tasks</h3>
                <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2">7</p>
                <p className="text-sm text-[var(--color-warning)] mt-1 font-medium">3 due today</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-500/10 dark:to-amber-600/20 rounded-xl dark:glow-warning">
                <CheckSquare className="h-8 w-8 text-[var(--color-warning)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:scale-[1.02] transition-all duration-300 float-animation dark:glow-accent" style={{ animationDelay: '3s' } as React.CSSProperties}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-2">$12,450</p>
                <p className="text-sm text-[var(--color-success)] mt-1 font-medium">+15% from last month</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/10 dark:to-purple-600/20 rounded-xl dark:glow-accent">
                <DollarSign className="h-8 w-8 text-[var(--color-primary)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[var(--color-background-tertiary)] to-[var(--color-background-secondary)] border-b border-[var(--color-border-light)]">
          <CardTitle className="text-xl font-semibold text-[var(--color-text-primary)]">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--color-border-light)]">
            <div className="flex items-center gap-4 p-6 hover:bg-[var(--color-background-tertiary)] transition-colors">
              <div className="w-3 h-3 bg-[var(--color-info)] rounded-full shadow-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  New lead added: TechCorp Solutions
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 hover:bg-[var(--color-background-tertiary)] transition-colors">
              <div className="w-3 h-3 bg-[var(--color-success)] rounded-full shadow-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Task completed: Follow up with ABC Corp
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 hover:bg-[var(--color-background-tertiary)] transition-colors">
              <div className="w-3 h-3 bg-[var(--color-warning)] rounded-full shadow-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  Meeting scheduled with StartupXYZ
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => handleQuickAction('Add Task')}>
              <CheckSquare className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button variant="outline" onClick={() => handleQuickAction('Schedule Meeting')}>
              <Users className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="outline" onClick={() => handleQuickAction('Generate Report')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" onClick={() => handleQuickAction('View Analytics')}>
              <Building2 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
