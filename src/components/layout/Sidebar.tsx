import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CheckSquare, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  TestTube
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalStorage } from '../../hooks/use-local-storage';
import Avatar from '../ui/Avatar';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lead Database', href: '/lead-database', icon: Users },
  { name: 'Client Space', href: '/client-space', icon: Building2 },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Admin Panel', href: '/admin-panel', icon: Settings },
  { name: 'Test Components', href: '/test-components', icon: TestTube },
  { name: 'Test Data', href: '/test-data', icon: TestTube },
];

export function Sidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useLocalStorage('sidebar-collapsed', false);

  const toggleSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || 'User';
  };

  return (
    <div className={cn(
      'flex flex-col h-full bg-[var(--color-background)] border-r border-[var(--color-border)] transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <h1 className={cn(
          'text-xl font-bold text-[var(--color-primary)] transition-opacity duration-300',
          isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
        )}>
          Adviso
        </h1>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors cursor-pointer z-10 relative"
          type="button"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{ minWidth: '32px', minHeight: '32px' }}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)]" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-[var(--color-text-secondary)]" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[var(--adviso-brand-200)] text-[var(--color-primary)] border border-[var(--adviso-brand-300)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)]',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="mt-auto p-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3 p-2 mb-2">
          <Avatar 
            name={getDisplayName()} 
            src={profile?.avatar_url || undefined}
            size="sm"
          />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="font-medium text-sm text-[var(--color-text-primary)] truncate">
                {getDisplayName()}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">
                {profile?.email}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={signOut}
          className={cn(
            'flex items-center gap-3 w-full p-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] transition-colors',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
