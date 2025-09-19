import { useState } from 'react';
import { useAdminAccess } from '../hooks/useAdminAccess';
import AdminNavigation from '../components/admin/AdminNavigation';
import SystemOverview from '../components/admin/SystemOverview';
import UserManagement from '../components/admin/UserManagement';
import SystemConfiguration from '../components/admin/SystemConfiguration';
import DataExport from '../components/admin/DataExport';
import ActivityLogs from '../components/admin/ActivityLogs';
import { Card, CardContent } from '../components/ui/Card';
import { Shield, AlertTriangle } from 'lucide-react';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { hasAdminPanelAccess, loading, role } = useAdminAccess();

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // Access denied
  if (!hasAdminPanelAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin Panel</h1>
          <p className="text-[var(--color-text-secondary)]">
            System administration and configuration settings.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                Access Denied
              </h3>
              <p className="text-[var(--color-text-secondary)] mb-4">
                You don't have permission to access the Admin Panel.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                <Shield className="h-4 w-4" />
                Current Role: {role || 'Unknown'}
              </div>
              <p className="text-sm text-[var(--color-text-muted)] mt-4">
                Contact your administrator to request admin access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <SystemOverview />;
      case 'users':
        return <UserManagement />;
      case 'roles':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Role & Permission Management</h3>
              <p className="text-[var(--color-text-secondary)]">Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'templates':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Task Template Management</h3>
              <p className="text-[var(--color-text-secondary)]">Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'configuration':
        return <SystemConfiguration />;
      case 'activity':
        return <ActivityLogs />;
      case 'export':
        return <DataExport />;
      case 'database':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Database Management</h3>
              <p className="text-[var(--color-text-secondary)]">Coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        return <SystemOverview />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin Panel</h1>
        <p className="text-[var(--color-text-secondary)]">
          System administration and configuration settings.
        </p>
      </div>

      <AdminNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="min-h-[400px]">
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default AdminPage;
