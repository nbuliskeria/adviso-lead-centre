// src/components/ui/CopyableField.tsx
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';
import { useToast } from '../../hooks/useToast';
import { cn } from '../../lib/utils';

export interface CopyableFieldProps {
  value: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

const CopyableField = ({ value, label, placeholder = 'No value', className }: CopyableFieldProps) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      addToast('Copied to clipboard', 'success');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={cn(
            'flex h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background-secondary)]',
            'px-3 py-2 text-sm text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-muted)]',
            'focus-within:ring-2 focus-within:ring-[var(--color-ring)] focus-within:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          <span className="flex-1 truncate">
            {value || placeholder}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 hover:bg-[var(--color-background-tertiary)]"
            onClick={copyToClipboard}
            disabled={!value}
          >
            {copied ? (
              <Check className="h-3 w-3 text-[var(--color-success)]" />
            ) : (
              <Copy className="h-3 w-3 text-[var(--color-text-muted)]" />
            )}
            <span className="sr-only">
              {copied ? 'Copied' : 'Copy to clipboard'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { CopyableField };
