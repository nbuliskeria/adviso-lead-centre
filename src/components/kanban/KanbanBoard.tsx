// src/components/kanban/KanbanBoard.tsx
import React, { useState } from 'react';
import type { DragEvent } from 'react';
import { cn } from '../../lib/utils';

export interface KanbanColumn {
  id: string;
  title: string;
  items: React.ReactNode[];
  color?: string;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  onMoveItem: (itemId: string, newColumnId: string, oldColumnId: string) => void;
  className?: string;
}

const KanbanBoard = ({ columns, onMoveItem, className }: KanbanBoardProps) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedFromColumn, setDraggedFromColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, itemId: string, columnId: string) => {
    setDraggedItemId(itemId);
    setDraggedFromColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    // Only clear drag over if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.preventDefault();
    
    const itemId = e.dataTransfer.getData('text/plain');
    
    if (itemId && draggedFromColumn && draggedFromColumn !== columnId) {
      onMoveItem(itemId, columnId, draggedFromColumn);
    }
    
    // Reset drag state
    setDraggedItemId(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    // Reset all drag state
    setDraggedItemId(null);
    setDraggedFromColumn(null);
    setDragOverColumn(null);
  };

  return (
    <div className={cn('flex gap-6 overflow-x-auto pb-4', className)}>
      {columns.map((column) => {
        const isDropTarget = dragOverColumn === column.id;
        const isDragSource = draggedFromColumn === column.id;
        
        return (
          <div
            key={column.id}
            className={cn(
              'flex-shrink-0 w-80 bg-[var(--color-background-tertiary)] rounded-xl p-4',
              'border border-[var(--color-border-light)] transition-all duration-200',
              'dark:backdrop-blur-sm',
              isDropTarget && [
                'border-[var(--color-border-accent)] bg-[var(--color-background-accent)]',
                'shadow-lg dark:glow-accent'
              ],
              isDragSource && 'opacity-75'
            )}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            style={{
              boxShadow: isDropTarget ? 'var(--color-card-shadow-hover)' : 'var(--color-card-shadow)',
            } as React.CSSProperties}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {column.color && (
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                )}
                <h3 className="font-semibold text-[var(--color-text-primary)]">
                  {column.title}
                </h3>
              </div>
              <div className="text-sm text-[var(--color-text-muted)] bg-[var(--color-background-secondary)] px-2 py-1 rounded-full">
                {column.items.length}
              </div>
            </div>

            {/* Column Items */}
            <div className="space-y-3 min-h-[200px]">
              {column.items.map((item, index) => {
                // Extract the item ID from the React element props
                const itemElement = item as React.ReactElement;
                const itemId = (itemElement.props as { lead?: { id?: string } })?.lead?.id || `${column.id}-${index}`;
                const isDragging = draggedItemId === itemId;
                
                return (
                  <div
                    key={itemId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, itemId, column.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'transition-all duration-200 cursor-grab active:cursor-grabbing',
                      isDragging && 'opacity-50 rotate-2 scale-105'
                    )}
                  >
                    {/* Clone the item with isDragging prop if it's a LeadCard */}
                    {React.isValidElement(item) 
                      ? React.cloneElement(item, { isDragging } as { isDragging: boolean })
                      : item
                    }
                  </div>
                );
              })}
              
              {/* Empty state */}
              {column.items.length === 0 && (
                <div className={cn(
                  'flex items-center justify-center h-32 rounded-lg border-2 border-dashed',
                  'border-[var(--color-border)] text-[var(--color-text-muted)]',
                  isDropTarget && 'border-[var(--color-border-accent)] text-[var(--color-text-accent)]'
                )}>
                  <span className="text-sm">
                    {isDropTarget ? 'Drop here' : 'No items'}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
