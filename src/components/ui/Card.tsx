import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/**
 * Card component for content display
 */
const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] text-[var(--color-text-primary)] transition-all duration-300',
        'hover:bg-[var(--color-card-hover)] hover:border-[var(--color-border-accent)]',
        'glass-card glass-card-hover',
        'dark:backdrop-blur-xl dark:bg-[var(--color-card)]',
        className
      )}
      style={{
        boxShadow: 'var(--color-card-shadow)',
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--color-card-shadow-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--color-card-shadow)';
      }}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * CardHeader component for card headers
 */
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle component for card titles
 */
const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight text-[var(--color-text-primary)]', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component for card descriptions
 */
const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--color-text-secondary)]', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

/**
 * CardContent component for main card content
 */
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

/**
 * CardFooter component for card footers
 */
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
