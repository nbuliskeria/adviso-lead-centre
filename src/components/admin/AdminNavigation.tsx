// src/components/admin/AdminNavigation.tsx
// import { useState } from 'react'; // TODO: Use when implementing navigation state
import { 
  Users, 
  Settings, 
  FileText, 
  Activity, 
  Download, 
  BarChart3,
  Shield,
  Database
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const adminTabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    description: 'System statistics and health'
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    description: 'Manage users and permissions'
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    icon: Shield,
    description: 'Configure user roles'
  },
  {
    id: 'templates',
    label: 'Task Templates',
    icon: FileText,
    description: 'Manage onboarding playbooks'
  },
  {
    id: 'configuration',
    label: 'System Config',
    icon: Settings,
    description: 'Lead sources, statuses, priorities'
  },
  {
    id: 'activity',
    label: 'Activity Logs',
    icon: Activity,
    description: 'Audit trail and system logs'
  },
  {
    id: 'export',
    label: 'Data Export',
    icon: Download,
    description: 'Export system data'
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    description: 'Database management tools'
  }
];

const AdminNavigation = ({ activeTab, onTabChange }: AdminNavigationProps) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center p-4 rounded-lg transition-all duration-200',
                'hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2',
                isActive && 'bg-[var(--color-primary)] text-white shadow-lg'
              )}
            >
              <Icon className={cn(
                'h-6 w-6 mb-2',
                isActive ? 'text-white' : 'text-[var(--color-text-secondary)]'
              )} />
              <span className={cn(
                'text-sm font-medium text-center',
                isActive ? 'text-white' : 'text-[var(--color-text-primary)]'
              )}>
                {tab.label}
              </span>
              <span className={cn(
                'text-xs text-center mt-1 leading-tight',
                isActive ? 'text-white/80' : 'text-[var(--color-text-muted)]'
              )}>
                {tab.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavigation;
