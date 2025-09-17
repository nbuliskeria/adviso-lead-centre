/* eslint-disable react-refresh/only-export-components */
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-ring-offset)] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] shadow-sm hover:shadow-md',
        destructive: 'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:bg-[var(--color-destructive-hover)] shadow-sm hover:shadow-md',
        outline: 'border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] active:bg-[var(--color-border)]',
        secondary: 'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-[var(--color-secondary-hover)] active:bg-[var(--color-border)]',
        ghost: 'text-[var(--color-text-primary)] hover:bg-[var(--color-background-secondary)] active:bg-[var(--color-border)]',
        accent: 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent-hover)] shadow-sm hover:shadow-md',
        success: 'bg-[var(--color-success)] text-[var(--color-success-foreground)] hover:bg-[var(--color-success-hover)] shadow-sm hover:shadow-md',
        warning: 'bg-[var(--color-warning)] text-[var(--color-warning-foreground)] hover:bg-[var(--color-warning-hover)] shadow-sm hover:shadow-md',
        info: 'bg-[var(--color-info)] text-[var(--color-info-foreground)] hover:bg-[var(--color-info-hover)] shadow-sm hover:shadow-md',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * Button component with multiple variants and sizes
 * @param variant - Button style variant (default, destructive, outline, secondary, ghost)
 * @param size - Button size (default, sm, lg, icon)
 * @param className - Additional CSS classes
 * @param children - Button content
 * @param asChild - Render as child component (for composition)
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
