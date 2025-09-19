// src/components/admin/SystemOverview.tsx
import { useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  Building2, 
  CheckSquare, 
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';
import { useUsers } from '../../hooks/queries/useUsers';
import { useLeads } from '../../hooks/queries/useLeads';
import { useTasks } from '../../hooks/queries/useTasks';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import StatCard from '../dashboard/StatCard';
import { format, subDays, isAfter } from 'date-fns';

const SystemOverview = () => {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const systemStats = useMemo(() => {
    if (!users || !leads || !tasks) return null;

    const now = new Date();
    const last30Days = subDays(now, 30);
    const last7Days = subDays(now, 7);

    // User Statistics
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.is_active).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const managerUsers = users.filter(u => u.role === 'manager').length;
    const recentUsers = users.filter(u => u.created_at && isAfter(new Date(u.created_at), last30Days)).length;

    // Lead Statistics
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.status !== 'Closed Won' && l.status !== 'Closed Lost').length;
    const recentLeads = leads.filter(l => l.created_at && isAfter(new Date(l.created_at), last7Days)).length;
    const convertedLeads = leads.filter(l => l.status === 'Closed Won').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Task Statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const overdueTasks = tasks.filter(t => {
      if (!t.due_date) return false;
      return isAfter(now, new Date(t.due_date)) && t.status !== 'completed';
    }).length;
    const recentTasks = tasks.filter(t => t.created_at && isAfter(new Date(t.created_at), last7Days)).length;

    // System Health
    const systemHealth = {
      userActivity: activeUsers / totalUsers,
      taskCompletion: totalTasks > 0 ? completedTasks / totalTasks : 1,
      leadConversion: conversionRate / 100,
      overdueRatio: totalTasks > 0 ? overdueTasks / totalTasks : 0,
    };

    const overallHealth = (
      systemHealth.userActivity * 0.3 +
      systemHealth.taskCompletion * 0.3 +
      systemHealth.leadConversion * 0.2 +
      (1 - systemHealth.overdueRatio) * 0.2
    ) * 100;

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
        managers: managerUsers,
        recent: recentUsers,
      },
      leads: {
        total: totalLeads,
        active: activeLeads,
        recent: recentLeads,
        converted: convertedLeads,
        conversionRate,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        recent: recentTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      },
      health: {
        overall: overallHealth,
        details: systemHealth,
      },
    };
  }, [users, leads, tasks]);

  const isLoading = usersLoading || leadsLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!systemStats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-[var(--color-text-muted)]">
            Unable to load system statistics
          </div>
        </CardContent>
      </Card>
    );
  }

  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">System Overview</h2>
        <p className="text-[var(--color-text-secondary)]">
          Real-time system statistics and health monitoring
        </p>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${getHealthColor(systemStats.health.overall)}`}>
                {systemStats.health.overall.toFixed(1)}%
              </div>
              <div className="text-[var(--color-text-secondary)]">
                Overall Health - {getHealthStatus(systemStats.health.overall)}
              </div>
            </div>
            <div className="text-right space-y-1 text-sm">
              <div>User Activity: {(systemStats.health.details.userActivity * 100).toFixed(1)}%</div>
              <div>Task Completion: {(systemStats.health.details.taskCompletion * 100).toFixed(1)}%</div>
              <div>Lead Conversion: {(systemStats.health.details.leadConversion * 100).toFixed(1)}%</div>
              <div>Overdue Tasks: {(systemStats.health.details.overdueRatio * 100).toFixed(1)}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Stats */}
        <StatCard
          title="Total Users"
          value={systemStats.users.total}
          change={systemStats.users.recent}
          icon={<Users className="h-6 w-6" />}
        />

        <StatCard
          title="Active Users"
          value={systemStats.users.active}
          change={((systemStats.users.active / systemStats.users.total) * 100)}
          icon={<UserCheck className="h-6 w-6" />}
        />

        <StatCard
          title="Total Leads"
          value={systemStats.leads.total}
          change={systemStats.leads.recent}
          icon={<Building2 className="h-6 w-6" />}
        />

        <StatCard
          title="Conversion Rate"
          value={`${systemStats.leads.conversionRate.toFixed(1)}%`}
          change={systemStats.leads.converted}
          icon={<TrendingUp className="h-6 w-6" />}
        />

        <StatCard
          title="Total Tasks"
          value={systemStats.tasks.total}
          change={systemStats.tasks.recent}
          icon={<CheckSquare className="h-6 w-6" />}
        />

        <StatCard
          title="Task Completion"
          value={`${systemStats.tasks.completionRate.toFixed(1)}%`}
          change={systemStats.tasks.completed}
          icon={<CheckSquare className="h-6 w-6" />}
        />

        <StatCard
          title="Overdue Tasks"
          value={systemStats.tasks.overdue}
          change={((systemStats.tasks.overdue / systemStats.tasks.total) * 100)}
          icon={<Calendar className="h-6 w-6" />}
        />

        <StatCard
          title="Active Leads"
          value={systemStats.leads.active}
          change={((systemStats.leads.active / systemStats.leads.total) * 100)}
          icon={<Building2 className="h-6 w-6" />}
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>User Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Administrators</span>
                <span className="font-semibold">{systemStats.users.admins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Managers</span>
                <span className="font-semibold">{systemStats.users.managers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Regular Users</span>
                <span className="font-semibold">
                  {systemStats.users.total - systemStats.users.admins - systemStats.users.managers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Inactive Users</span>
                <span className="font-semibold text-red-600">
                  {systemStats.users.total - systemStats.users.active}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Active Leads</span>
                <span className="font-semibold text-blue-600">{systemStats.leads.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Converted</span>
                <span className="font-semibold text-green-600">{systemStats.leads.converted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Lost</span>
                <span className="font-semibold text-red-600">
                  {leads?.filter(l => l.status === 'Closed Lost').length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">This Week</span>
                <span className="font-semibold">{systemStats.leads.recent}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Status */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Completed</span>
                <span className="font-semibold text-green-600">{systemStats.tasks.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">In Progress</span>
                <span className="font-semibold text-blue-600">
                  {tasks?.filter(t => t.status === 'in_progress').length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {tasks?.filter(t => t.status === 'pending').length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Overdue</span>
                <span className="font-semibold text-red-600">{systemStats.tasks.overdue}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-[var(--color-text-muted)]">
        Last updated: {format(new Date(), 'PPpp')}
      </div>
    </div>
  );
};

export default SystemOverview;
