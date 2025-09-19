// src/components/tasks/TaskFormModal.tsx
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { useTaskForm } from '../../hooks/useTaskForm';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS, TASK_CATEGORY_OPTIONS } from '../../lib/constants';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
  clientId?: string;
}

const TaskFormModal = ({ isOpen, onClose, leadId, clientId }: TaskFormModalProps) => {
  const { form, handleSubmit, isSubmitting } = useTaskForm({
    onSuccess: () => {
      onClose();
    },
  });

  const { register, formState: { errors } } = form;

  // Set default lead/client ID if provided
  if (leadId && !form.getValues('lead_id')) {
    form.setValue('lead_id', leadId);
  }
  if (clientId && !form.getValues('client_id')) {
    form.setValue('client_id', clientId);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <Label htmlFor="title" required>
            Task Title
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter task title..."
            error={!!errors.title?.message}
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

        {/* Notes */}
        <div>
          <Label htmlFor="notes">
            Notes
          </Label>
          <textarea
            id="notes"
            {...register('notes')}
            placeholder="Additional notes..."
            rows={2}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md bg-[var(--color-background)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
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
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;
