// src/components/tasks/TaskList.tsx
import TaskItem from './TaskItem';
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

interface TaskListProps {
  title: string;
  tasks: TaskWithRelations[];
  onTaskClick: (task: TaskWithRelations) => void;
  emptyMessage?: string;
}

const TaskList = ({ title, tasks, onTaskClick, emptyMessage }: TaskListProps) => {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {title}
        </h2>
        <span className="text-sm text-[var(--color-text-muted)] bg-[var(--color-background-secondary)] px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-[var(--color-text-muted)] text-sm">
            {emptyMessage || `No ${title.toLowerCase()} tasks`}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
