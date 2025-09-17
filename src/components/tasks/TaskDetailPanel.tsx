// src/components/tasks/TaskDetailPanel.tsx
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import SubtaskList from './SubtaskList';
import { useTaskForm } from '../../hooks/useTaskForm';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS, TASK_CATEGORY_OPTIONS } from '../../lib/constants';
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

interface TaskDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithRelations | null;
}

const TaskDetailPanel = ({ isOpen, onClose, task }: TaskDetailPanelProps) => {
  const { form, handleSubmit, isSubmitting, addSubtask, toggleSubtask, removeSubtask } = useTaskForm({
    task: task || undefined,
    onSuccess: () => {
      onClose();
    },
  });

  const { register, formState: { errors }, watch, setValue } = form;

  if (!isOpen || !task) {
    return null;
  }

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Task Details">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Title */}
        <div>
          <Label htmlFor="title" required>
            Task Title
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter task title..."
            error={errors.title?.message}
          />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">
            Description
          </Label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Enter task description..."
            rows={3}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
          />
        </div>

        {/* Row 1: Status and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">
              Status
            </Label>
            <Select
              id="status"
              {...register('status')}
            >
              {TASK_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">
              Priority
            </Label>
            <Select
              id="priority"
              {...register('priority')}
            >
              {TASK_PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Row 2: Category and Due Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">
              Category
            </Label>
            <Select
              id="category"
              {...register('category')}
            >
              <option value="">Select category...</option>
              {TASK_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="due_date">
              Due Date
            </Label>
            <Input
              id="due_date"
              type="date"
              {...register('due_date')}
            />
          </div>
        </div>

        {/* Estimated Hours */}
        <div>
          <Label htmlFor="estimated_hours">
            Estimated Hours
          </Label>
          <Input
            id="estimated_hours"
            type="number"
            min="0"
            step="0.5"
            {...register('estimated_hours', { valueAsNumber: true })}
            placeholder="0"
          />
        </div>

        {/* Subtasks */}
        <div>
          <Label>Subtasks</Label>
          <SubtaskList
            watch={watch}
            setValue={setValue}
            addSubtask={addSubtask}
            toggleSubtask={toggleSubtask}
            removeSubtask={removeSubtask}
          />
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">
            Notes
          </Label>
          <textarea
            id="notes"
            {...register('notes')}
            placeholder="Additional notes..."
            rows={3}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </SidePanel>
  );
};

export default TaskDetailPanel;
