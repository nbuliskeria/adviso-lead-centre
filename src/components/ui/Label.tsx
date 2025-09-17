// src/components/ui/Label.tsx
import { forwardRef } from 'react';
import type { LabelHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium text-[var(--color-text-primary)]',
          'leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-[var(--color-destructive)]" aria-label="required">
            *
          </span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Label };
