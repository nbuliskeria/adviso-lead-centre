// src/components/ui/SegmentedControl.tsx
import { cn } from '../../lib/utils';

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SegmentedControl = ({ 
  options, 
  value, 
  onChange, 
  className,
  size = 'md' 
}: SegmentedControlProps) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const buttonSizeClasses = {
    sm: 'px-3 py-1',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-lg p-1 transition-all duration-200',
        'bg-[var(--color-background-tertiary)] border border-[var(--color-border-light)]',
        'dark:backdrop-blur-sm',
        sizeClasses[size],
        className
      )}
      style={{
        boxShadow: 'var(--color-input-shadow)',
      } as React.CSSProperties}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'relative flex items-center justify-center gap-2 font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-1',
              'focus:ring-offset-[var(--color-background-tertiary)]',
              buttonSizeClasses[size],
              
              // Border radius
              isFirst && 'rounded-l-md',
              isLast && 'rounded-r-md',
              !isFirst && !isLast && 'rounded-none',
              
              // Selected state
              isSelected ? [
                'bg-[var(--color-card)] text-[var(--color-text-primary)]',
                'border border-[var(--color-border)] shadow-sm',
                'dark:bg-[var(--color-card)] dark:border-[var(--color-border-accent)]',
              ] : [
                'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                'hover:bg-[var(--color-background-secondary)]',
              ]
            )}
            style={isSelected ? {
              boxShadow: 'var(--color-card-shadow)',
            } as React.CSSProperties : undefined}
          >
            {option.icon && (
              <span className="flex-shrink-0">
                {option.icon}
              </span>
            )}
            <span className="whitespace-nowrap">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export { SegmentedControl };
