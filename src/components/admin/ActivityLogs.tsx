// src/components/admin/ActivityLogs.tsx
import { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  // Filter, // TODO: Use for activity filtering 
  // Calendar, // TODO: Use for date filtering
  User,
  Database,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { format, subDays, isAfter } from 'date-fns';

// Interface for activity log structure - used for type checking mock data
interface ActivityLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  action: string;
  resource_type: 'lead' | 'client' | 'task' | 'user' | 'system';
  resource_id?: string;
  resource_name?: string;
  details: string;
  ip_address?: string;
  user_agent?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

const ActivityLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [selectedResource, setSelectedResource] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [dateRange, setDateRange] = useState('7');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock activity logs data - in production this would come from an API
  const mockActivityLogs = useMemo((): ActivityLog[] => [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      user_id: 'user1',
      user_name: 'John Doe',
      action: 'CREATE',
      resource_type: 'lead',
      resource_id: 'lead123',
      resource_name: 'Acme Corp',
      details: 'Created new lead for Acme Corp with $50,000 potential value',
      ip_address: '192.168.1.100',
      severity: 'success',
      metadata: { value: 50000, source: 'Website' }
    },
    {
      id: '2',
      timestamp: subDays(new Date(), 1).toISOString(),
      user_id: 'user2',
      user_name: 'Jane Smith',
      action: 'UPDATE',
      resource_type: 'client',
      resource_id: 'client456',
      resource_name: 'TechStart Inc',
      details: 'Updated client status from Onboarding to Active',
      ip_address: '192.168.1.101',
      severity: 'info',
      metadata: { old_status: 'Onboarding', new_status: 'Active' }
    },
    {
      id: '3',
      timestamp: subDays(new Date(), 2).toISOString(),
      user_id: 'system',
      user_name: 'System',
      action: 'AUTO_TASK_CREATION',
      resource_type: 'task',
      resource_id: 'task789',
      resource_name: 'Client Onboarding Checklist',
      details: 'Automatically created onboarding tasks for new client',
      severity: 'info',
      metadata: { template_id: 'template1', tasks_created: 9 }
    },
    {
      id: '4',
      timestamp: subDays(new Date(), 3).toISOString(),
      user_id: 'user1',
      user_name: 'John Doe',
      action: 'LOGIN_FAILED',
      resource_type: 'system',
      details: 'Failed login attempt - invalid password',
      ip_address: '192.168.1.100',
      severity: 'warning',
      metadata: { reason: 'invalid_password', attempts: 3 }
    },
    {
      id: '5',
      timestamp: subDays(new Date(), 4).toISOString(),
      user_id: 'admin',
      user_name: 'Admin User',
      action: 'DELETE',
      resource_type: 'user',
      resource_id: 'user999',
      resource_name: 'Old User Account',
      details: 'Deactivated user account due to inactivity',
      ip_address: '192.168.1.1',
      severity: 'warning',
      metadata: { reason: 'inactivity', last_login: '2024-01-01' }
    },
    {
      id: '6',
      timestamp: subDays(new Date(), 5).toISOString(),
      user_id: 'system',
      user_name: 'System',
      action: 'BACKUP_COMPLETED',
      resource_type: 'system',
      details: 'Daily database backup completed successfully',
      severity: 'success',
      metadata: { backup_size: '2.5GB', duration: '15min' }
    }
  ], []);

  const filteredLogs = useMemo(() => {
    let filtered = mockActivityLogs;

    // Filter by date range
    if (dateRange !== 'all') {
      const cutoffDate = subDays(new Date(), parseInt(dateRange));
      filtered = filtered.filter(log => isAfter(new Date(log.timestamp), cutoffDate));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by user
    if (selectedUser !== 'all') {
      filtered = filtered.filter(log => log.user_id === selectedUser);
    }

    // Filter by resource type
    if (selectedResource !== 'all') {
      filtered = filtered.filter(log => log.resource_type === selectedResource);
    }

    // Filter by severity
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity === selectedSeverity);
    }

    return filtered;
  }, [mockActivityLogs, searchTerm, selectedUser, selectedResource, selectedSeverity, dateRange]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'error':
        return XCircle;
      default:
        return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-300';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'lead':
        return Database;
      case 'client':
        return User;
      case 'task':
        return CheckCircle;
      case 'user':
        return User;
      default:
        return Database;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const uniqueUsers = Array.from(new Set(mockActivityLogs.map(log => log.user_id)))
    .map(userId => {
      const log = mockActivityLogs.find(l => l.user_id === userId);
      return { id: userId, name: log?.user_name || userId };
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Activity Logs</h2>
          <p className="text-[var(--color-text-secondary)]">
            System audit trail and user activity monitoring
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
              />
            </div>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
            >
              <option value="1">Last 24 Hours</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>

            {/* User Filter */}
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>

            {/* Resource Type Filter */}
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
            >
              <option value="all">All Resources</option>
              <option value="lead">Leads</option>
              <option value="client">Clients</option>
              <option value="task">Tasks</option>
              <option value="user">Users</option>
              <option value="system">System</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-[var(--color-background)]"
            >
              <option value="all">All Severities</option>
              <option value="success">Success</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Total Activities</p>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {filteredLogs.length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-[var(--color-primary)]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Success</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredLogs.filter(log => log.severity === 'success').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredLogs.filter(log => log.severity === 'warning').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-secondary)]">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredLogs.filter(log => log.severity === 'error').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--color-border)]">
            {filteredLogs.map((log) => {
              const SeverityIcon = getSeverityIcon(log.severity);
              const ResourceIcon = getResourceIcon(log.resource_type);
              
              return (
                <div key={log.id} className="p-6 hover:bg-[var(--color-surface-hover)] transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Severity Icon */}
                    <div className={`p-2 rounded-full ${getSeverityColor(log.severity)}`}>
                      <SeverityIcon className="h-4 w-4" />
                    </div>

                    {/* Activity Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <ResourceIcon className="h-4 w-4 text-[var(--color-text-secondary)]" />
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-[var(--color-text-muted)]">•</span>
                        <span className="text-sm text-[var(--color-text-secondary)] capitalize">
                          {log.resource_type}
                        </span>
                        {log.resource_name && (
                          <>
                            <span className="text-sm text-[var(--color-text-muted)]">•</span>
                            <span className="text-sm font-medium text-[var(--color-text-primary)]">
                              {log.resource_name}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-[var(--color-text-primary)] mb-2">
                        {log.details}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                        </div>
                        {log.ip_address && (
                          <div className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {log.ip_address}
                          </div>
                        )}
                      </div>

                      {/* Metadata */}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-3 p-3 bg-[var(--color-surface)] rounded border">
                          <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                            Additional Details:
                          </div>
                          <div className="space-y-1">
                            {Object.entries(log.metadata).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <span className="text-[var(--color-text-muted)] capitalize">
                                  {key.replace(/_/g, ' ')}:
                                </span>
                                <span className="text-[var(--color-text-primary)] font-mono">
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-[var(--color-text-muted)]">
                No activity logs found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                Activity Log Retention
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Activity logs are retained for 90 days. For longer retention or detailed audit reports, 
                use the Data Export feature to download complete activity logs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLogs;
