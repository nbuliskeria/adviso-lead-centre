// src/components/dashboard/TodaysAgenda.tsx
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { Clock, AlertTriangle, CheckSquare, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import type { Database } from '../../lib/database.types';

type TaskRow = Database['public']['Tables']['client_tasks']['Row'];

interface TodaysAgendaProps {
  tasks: TaskRow[];
  className?: string;
}

const TodaysAgenda = ({ tasks, className }: TodaysAgendaProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const { overdueTasks, todayTasks } = useMemo(() => {
    if (!profile?.id) return { overdueTasks: [], todayTasks: [] };

    const userTasks = tasks.filter(task => 
      task.assignee_id === profile.id && task.status !== 'Done'
    );

    const overdue: TaskRow[] = [];
    const today: TaskRow[] = [];

    userTasks.forEach(task => {
      if (task.due_date) {
        const dueDate = parseISO(task.due_date);
        if (isPast(dueDate) && !isToday(dueDate)) {
          overdue.push(task);
        } else if (isToday(dueDate)) {
          today.push(task);
        }
      }
    });

    return {
      overdueTasks: overdue.sort((a, b) => 
        new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
      ),
      todayTasks: today.sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
               (priorityOrder[b.priority as keyof typeof priorityOrder] || 3);
      })
    };
  }, [tasks, profile?.id]);

  const handleTaskClick = (taskId: string) => {
    navigate('/tasks', {
      state: { taskId }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-[var(--color-destructive)]';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-blue-500';
      case 'low': return 'text-[var(--color-text-muted)]';
      default: return 'text-[var(--color-text-muted)]';
    }
  };

  const TaskItem = ({ task, isOverdue }: { task: TaskRow; isOverdue?: boolean }) => (
    <div
      className={cn(
        'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors',
        'hover:bg-[var(--color-surface-hover)] border border-transparent hover:border-[var(--color-border)]',
        isOverdue && 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
      )}
      onClick={() => handleTaskClick(task.id)}
    >
      <div className={cn(
        'flex-shrink-0',
        isOverdue ? 'text-[var(--color-destructive)]' : 'text-[var(--color-text-muted)]'
      )}>
        {isOverdue ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <CheckSquare className="h-4 w-4" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          isOverdue ? 'text-[var(--color-destructive)]' : 'text-[var(--color-text-primary)]'
        )}>
          {task.title}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <span className={cn('text-xs', getPriorityColor(task.priority || 'medium'))}>
            {task.priority?.toUpperCase() || 'MEDIUM'}
          </span>
          {task.due_date && (
            <span className="text-xs text-[var(--color-text-muted)]">
              {format(parseISO(task.due_date), 'MMM d')}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const totalTasks = overdueTasks.length + todayTasks.length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
            <CardTitle className="text-lg font-semibold text-[var(--color-text-primary)]">
              Today's Agenda
            </CardTitle>
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">
            {totalTasks} tasks
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Your immediate priorities - click tasks to view details
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overdue Tasks */}
        {overdueTasks.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-[var(--color-destructive)]" />
              <h4 className="text-sm font-semibold text-[var(--color-destructive)]">
                Overdue ({overdueTasks.length})
              </h4>
            </div>
            <div className="space-y-2">
              {overdueTasks.slice(0, 3).map((task) => (
                <TaskItem key={task.id} task={task} isOverdue />
              ))}
              {overdueTasks.length > 3 && (
                <div className="text-xs text-[var(--color-text-muted)] text-center py-2">
                  +{overdueTasks.length - 3} more overdue tasks
                </div>
              )}
            </div>
          </div>
        )}

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-[var(--color-primary)]" />
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                Due Today ({todayTasks.length})
              </h4>
            </div>
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
              {todayTasks.length > 5 && (
                <div className="text-xs text-[var(--color-text-muted)] text-center py-2">
                  +{todayTasks.length - 5} more tasks due today
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalTasks === 0 && (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 text-[var(--color-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--color-text-secondary)]">
              No tasks due today. Great job staying on top of things!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysAgenda;
