// src/components/tasks/TaskItem.tsx
import { format, isPast, isToday } from 'date-fns';
import { Calendar, AlertCircle, Building2, User, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Database } from '../../lib/database.types';

type TaskRow = Database['public']['Tables']['client_tasks']['Row'];
type TaskWithRelations = TaskRow & {
  assignee_profile?: {
    id: string;
    first_name: string;
    last_name: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  lead?: {
    id: string;
    company_name: string;
  } | null;
  client?: {
    id: string;
    company_name: string;
  } | null;
};

interface TaskItemProps {
  task: TaskWithRelations;
  onClick: () => void;
  className?: string;
}

const TaskItem = ({ task, onClick, className }: TaskItemProps) => {
  // Format due date
  const formatDueDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isToday(date)) return 'Today';
      return format(date, 'MMM d');
    } catch {
      return null;
    }
  };

  // Check if task is overdue
  const isOverdue = task.due_date ? isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)) : false;

  // Get priority color
  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  // Get status color
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Blocked': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  // Get related entity name
  const getRelatedEntityName = () => {
    if (task.lead) return task.lead.company_name;
    if (task.client) return task.client.company_name;
    return null;
  };

  const relatedEntity = getRelatedEntityName();
  const formattedDueDate = formatDueDate(task.due_date);

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg',
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-[var(--color-border-accent)]',
        'dark:backdrop-blur-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[var(--color-text-primary)] truncate mb-1">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        
        {/* Priority Badge */}
        {task.priority && (
          <span className={cn(
            'px-2 py-1 text-xs font-medium rounded-full border ml-3 flex-shrink-0',
            getPriorityColor(task.priority)
          )}>
            {task.priority}
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* Status */}
          {task.status && (
            <span className={cn(
              'px-2 py-1 text-xs font-medium rounded border',
              getStatusColor(task.status)
            )}>
              {task.status}
            </span>
          )}

          {/* Related Entity */}
          {relatedEntity && (
            <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
              <Building2 className="h-3 w-3" />
              <span className="truncate max-w-32">{relatedEntity}</span>
            </div>
          )}

          {/* Estimated Hours */}
          {task.estimated_hours && (
            <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
              <Clock className="h-3 w-3" />
              <span>{task.estimated_hours}h</span>
            </div>
          )}
        </div>

        {/* Due Date */}
        {formattedDueDate && (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            isOverdue ? 'text-red-600 dark:text-red-400' : 'text-[var(--color-text-muted)]'
          )}>
            {isOverdue && <AlertCircle className="h-3 w-3" />}
            <Calendar className="h-3 w-3" />
            <span>{formattedDueDate}</span>
          </div>
        )}
      </div>

      {/* Assignee */}
      {task.assignee_profile && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--color-border)]">
          <User className="h-3 w-3 text-[var(--color-text-muted)]" />
          <span className="text-xs text-[var(--color-text-muted)]">
            {task.assignee_profile.display_name || 
             `${task.assignee_profile.first_name} ${task.assignee_profile.last_name}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
