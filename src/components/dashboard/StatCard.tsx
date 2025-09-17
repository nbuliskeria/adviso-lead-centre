// src/components/dashboard/StatCard.tsx
import { Card, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, change, icon, className }: StatCardProps) => {
  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    const formattedChange = Math.abs(change).toFixed(1);
    
    return {
      isPositive,
      text: `${isPositive ? '+' : '-'}${formattedChange}%`,
      color: isPositive 
        ? 'text-[var(--color-success)]' 
        : 'text-[var(--color-destructive)]'
    };
  };

  const changeData = change !== undefined ? formatChange(change) : null;

  return (
    <Card className={cn(
      'group hover:scale-[1.02] transition-all duration-300 float-animation dark:glow-info',
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">
              {value}
            </p>
            {changeData && (
              <div className={cn(
                'flex items-center space-x-1 text-sm font-medium',
                changeData.color
              )}>
                {changeData.isPositive ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{changeData.text}</span>
                <span className="text-[var(--color-text-muted)]">vs last period</span>
              </div>
            )}
          </div>
          <div className={cn(
            'h-12 w-12 rounded-lg flex items-center justify-center',
            'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)]',
            'text-white shadow-lg group-hover:shadow-xl transition-shadow'
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
