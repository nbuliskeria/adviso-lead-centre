// src/components/ui/SidePanel.tsx
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const SidePanel = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  width = 'lg' 
}: SidePanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const widthClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
    xl: 'w-[40rem]',
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the panel
      setTimeout(() => {
        panelRef.current?.focus();
      }, 100);
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Trap focus within the panel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab' && panelRef.current) {
      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'fixed right-0 top-0 z-50 h-full flex flex-col',
          'bg-[var(--color-card)] border-l border-[var(--color-card-border)]',
          'shadow-2xl transform transition-transform duration-300 ease-in-out',
          'dark:backdrop-blur-xl',
          widthClasses[width],
          className
        )}
        style={{
          boxShadow: 'var(--color-card-shadow-hover)',
        } as React.CSSProperties}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-panel-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 
            id="side-panel-title"
            className="text-xl font-semibold text-[var(--color-text-primary)]"
          >
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export { SidePanel };
