import { Menu, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Avatar from '../ui/Avatar';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { profile } = useAuth();
  const { theme, setTheme } = useTheme();

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || 'User';
  };

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Sun;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <header className="bg-[var(--color-background)] border-b border-[var(--color-border)] px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-[var(--color-background-secondary)] lg:hidden"
          >
            <Menu className="h-5 w-5 text-[var(--color-text-secondary)]" />
          </button>
          
          {/* Mobile logo */}
          <h1 className="text-xl font-bold text-[var(--color-primary)] lg:hidden">
            Adviso
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors"
            title={`Current theme: ${theme}. Click to cycle.`}
          >
            <ThemeIcon className="h-5 w-5 text-[var(--color-text-secondary)]" />
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3">
            <Avatar 
              name={getDisplayName()} 
              src={profile?.avatar_url || undefined}
              size="sm"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {getDisplayName()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
