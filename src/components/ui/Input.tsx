// src/components/ui/Input.tsx
import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'error'> {
  error?: boolean | string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-[var(--color-text-muted)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          
          // Theme styles
          'bg-[var(--color-input)] border-[var(--color-input-border)]',
          'text-[var(--color-text-primary)]',
          'focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-[var(--color-ring-offset)]',
          
          // Modern styling with glassmorphism in dark mode
          'dark:backdrop-blur-sm',
          
          // Error state
          !!error && 'border-[var(--color-destructive)] focus-visible:ring-[var(--color-destructive)]',
          
          // Hover effects
          'hover:border-[var(--color-border-strong)] hover:shadow-sm',
          
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
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
