import { Menu, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { profile } = useAuth();

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || 'User';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          
          {/* Mobile logo */}
          <h1 className="text-xl font-bold text-gray-900 lg:hidden">
            Adviso
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Theme toggle placeholder */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Sun className="h-5 w-5 text-gray-600" />
          </button>

          {/* User avatar - mobile only */}
          <div className="lg:hidden">
            <Avatar 
              name={getDisplayName()} 
              src={profile?.avatar_url || undefined}
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
