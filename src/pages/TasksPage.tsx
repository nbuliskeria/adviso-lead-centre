// src/pages/TasksPage.tsx
import { useState, useMemo } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { isPast, isToday, startOfDay } from 'date-fns';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { Select } from '../components/ui/Select';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import TaskList from '../components/tasks/TaskList';
import TaskItem from '../components/tasks/TaskItem';
import TaskFormModal from '../components/tasks/TaskFormModal';
import TaskDetailPanel from '../components/tasks/TaskDetailPanel';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { useTasks } from '../hooks/queries/useTasks';
import { useUpdateTask } from '../hooks/queries/useTaskMutations';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS, TASK_CATEGORY_OPTIONS } from '../lib/constants';
import type { Database } from '../lib/database.types';

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

function TasksPage() {
  // Data fetching
  const { data: tasks = [], isLoading, error } = useTasks();
  const updateTaskMutation = useUpdateTask();

  // Local state
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null);

  // Filter and group tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description?.toLowerCase().includes(searchLower);
        const matchesCompany = task.lead?.company_name.toLowerCase().includes(searchLower) || 
                              task.client?.company_name.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesDescription && !matchesCompany) {
          return false;
        }
      }

      // Status filter
      if (statusFilter && task.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter && task.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter && task.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter]);

  // Group tasks by urgency for list view
  const groupedTasks = useMemo(() => {
    const now = startOfDay(new Date());
    
    const overdueTasks = filteredTasks.filter(task => 
      task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date))
    );
    
    const dueTodayTasks = filteredTasks.filter(task => 
      task.due_date && isToday(new Date(task.due_date))
    );
    
    const upcomingTasks = filteredTasks.filter(task => 
      !task.due_date || (!isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date)))
    );

    return {
      overdue: overdueTasks,
      dueToday: dueTodayTasks,
      upcoming: upcomingTasks,
    };
  }, [filteredTasks]);

  // Kanban columns
  const kanbanColumns = useMemo(() => {
    return TASK_STATUS_OPTIONS.map((status) => ({
      id: status.value,
      title: status.label,
      color: status.color,
      items: filteredTasks
        .filter(task => task.status === status.value)
        .map(task => (
          <div
            key={task.id}
            onClick={() => handleTaskClick(task)}
            className="cursor-pointer"
          >
            <TaskItem task={task} onClick={() => handleTaskClick(task)} />
          </div>
        )),
    }));
  }, [filteredTasks]);

  // Event handlers
  const handleTaskClick = (task: TaskWithRelations) => {
    setSelectedTask(task);
    setIsDetailPanelOpen(true);
  };

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedTask(null);
  };

  const handleMoveTask = (taskId: string, newStatus: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskMutation.mutate({
        id: taskId,
        updates: { status: newStatus as any },
      });
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Tasks</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Manage and track all your tasks and assignments.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--color-text-muted)]">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Tasks</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Manage and track all your tasks and assignments.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-[var(--color-text-muted)]">Failed to load tasks. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Tasks</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage and track all your tasks and assignments.
          </p>
        </div>
        
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={handleClearSearch}
            placeholder="Search tasks..."
            className="w-full sm:w-64"
          />

          {/* Filters */}
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-32"
            >
              <option value="">All Status</option>
              {TASK_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-32"
            >
              <option value="">All Priority</option>
              {TASK_PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-32"
            >
              <option value="">All Categories</option>
              {TASK_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* View Toggle */}
        <SegmentedControl
          value={viewMode}
          onChange={(value) => setViewMode(value as 'list' | 'kanban')}
          options={[
            { value: 'list', label: 'List', icon: <Filter className="h-4 w-4" /> },
            { value: 'kanban', label: 'Board', icon: <Search className="h-4 w-4" /> },
          ]}
        />
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {viewMode === 'list' ? (
          <div className="space-y-8">
            <TaskList
              title="Overdue"
              tasks={groupedTasks.overdue}
              onTaskClick={handleTaskClick}
              emptyMessage="No overdue tasks"
            />
            <TaskList
              title="Due Today"
              tasks={groupedTasks.dueToday}
              onTaskClick={handleTaskClick}
              emptyMessage="No tasks due today"
            />
            <TaskList
              title="Upcoming"
              tasks={groupedTasks.upcoming}
              onTaskClick={handleTaskClick}
              emptyMessage="No upcoming tasks"
            />
          </div>
        ) : (
          <KanbanBoard
            columns={kanbanColumns}
            onMoveItem={handleMoveTask}
          />
        )}
      </div>

      {/* Modals */}
      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TaskDetailPanel
        isOpen={isDetailPanelOpen}
        onClose={handleCloseDetailPanel}
        task={selectedTask}
      />
    </div>
  );
}

export default TasksPage;
