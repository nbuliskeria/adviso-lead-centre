// src/components/dashboard/DashboardHeader.tsx
import { Select } from '../ui/Select';
import { useAuth } from '../../hooks/useAuth';

interface DashboardHeaderProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

const DashboardHeader = ({ dateRange, onDateRangeChange }: DashboardHeaderProps) => {
  const { profile } = useAuth();

  const getDisplayName = () => {
    if (profile?.display_name) return profile.display_name;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.first_name || 'User';
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Dashboard
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg">
          Welcome back, {getDisplayName()}! Here's your business overview.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">
            Time Period:
          </label>
          <Select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-32"
          >
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="180d">Last 6 months</option>
            <option value="365d">Last year</option>
            <option value="all">All time</option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
