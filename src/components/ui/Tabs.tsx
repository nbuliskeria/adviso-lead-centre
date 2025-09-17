// src/components/ui/Tabs.tsx
import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

// Context for tab state management
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
};

// Main Tabs component
export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs = ({ 
  value: controlledValue, 
  defaultValue, 
  onValueChange, 
  children, 
  className 
}: TabsProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList component
export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList = ({ children, className }: TabsListProps) => {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg p-1',
        'bg-[var(--color-background-tertiary)] border border-[var(--color-border-light)]',
        'dark:backdrop-blur-sm',
        className
      )}
      style={{
        boxShadow: 'var(--color-input-shadow)',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// TabsTrigger component
export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const TabsTrigger = ({ value, children, className, disabled }: TabsTriggerProps) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={`tabpanel-${value}`}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5',
        'text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        'disabled:pointer-events-none disabled:opacity-50',
        isSelected ? [
          'bg-[var(--color-card)] text-[var(--color-text-primary)]',
          'border border-[var(--color-border)] shadow-sm',
          'dark:bg-[var(--color-card)] dark:border-[var(--color-border-accent)]',
        ] : [
          'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
          'hover:bg-[var(--color-background-secondary)]',
        ],
        className
      )}
      style={isSelected ? {
        boxShadow: 'var(--color-card-shadow)',
      } as React.CSSProperties : undefined}
    >
      {children}
    </button>
  );
};

// TabsContent component
export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const { value: selectedValue } = useTabsContext();
  
  if (selectedValue !== value) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={cn(
        'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
        className
      )}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
