// src/components/ui/Select.tsx
import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            // Base styles
            'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'appearance-none cursor-pointer',
            
            // Theme styles
            'bg-[var(--color-input)] border-[var(--color-input-border)]',
            'text-[var(--color-text-primary)]',
            'focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-[var(--color-ring-offset)]',
            
            // Modern styling with glassmorphism in dark mode
            'dark:backdrop-blur-sm',
            
            // Error state
            error && 'border-[var(--color-destructive)] focus-visible:ring-[var(--color-destructive)]',
            
            // Hover effects
            'hover:border-[var(--color-border-strong)] hover:shadow-sm',
            
            // Padding for chevron icon
            'pr-10',
            
            className
          )}
          style={{
            boxShadow: 'var(--color-input-shadow)',
          } as React.CSSProperties}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = 'var(--color-input-shadow-focus)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'var(--color-input-shadow)';
          }}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        
        {/* Chevron Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
