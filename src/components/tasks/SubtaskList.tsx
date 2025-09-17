// src/components/tasks/SubtaskList.tsx
import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import type { TaskFormData, SubtaskData } from '../../lib/schemas';

interface SubtaskListProps {
  watch: UseFormWatch<TaskFormData>;
  setValue: UseFormSetValue<TaskFormData>;
  addSubtask: (title: string) => void;
  toggleSubtask: (subtaskId: string) => void;
  removeSubtask: (subtaskId: string) => void;
}

const SubtaskList = ({ watch, setValue, addSubtask, toggleSubtask, removeSubtask }: SubtaskListProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const subtasks = watch('subtasks') || [];

  // Calculate progress
  const completedCount = subtasks.filter(subtask => subtask.completed).length;
  const totalCount = subtasks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      addSubtask(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-text-muted)]">Progress</span>
            <span className="text-[var(--color-text-muted)]">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-[var(--color-background-secondary)] rounded-full h-2">
            <div
              className="bg-[var(--color-primary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtask List */}
      {subtasks.length > 0 && (
        <div className="space-y-2">
          {subtasks.map((subtask: SubtaskData) => (
            <div
              key={subtask.id}
              className={cn(
                'flex items-center gap-3 p-3 border border-[var(--color-border)] rounded-md',
                'bg-[var(--color-background)] hover:bg-[var(--color-background-secondary)] transition-colors',
                subtask.completed && 'opacity-75'
              )}
            >
              {/* Checkbox */}
              <button
                type="button"
                onClick={() => toggleSubtask(subtask.id)}
                className={cn(
                  'flex items-center justify-center w-5 h-5 border-2 rounded transition-all',
                  subtask.completed
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                )}
              >
                {subtask.completed && <Check className="w-3 h-3" />}
              </button>

              {/* Title */}
              <span
                className={cn(
                  'flex-1 text-sm',
                  subtask.completed
                    ? 'line-through text-[var(--color-text-muted)]'
                    : 'text-[var(--color-text-primary)]'
                )}
              >
                {subtask.title}
              </span>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removeSubtask(subtask.id)}
                className="p-1 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                title="Delete subtask"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {subtasks.length === 0 && (
        <div className="text-center py-6 text-[var(--color-text-muted)] text-sm">
          No subtasks yet. Add one below to break down this task.
        </div>
      )}

      {/* Add New Subtask */}
      <div className="flex gap-2">
        <Input
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a subtask..."
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddSubtask}
          disabled={!newSubtaskTitle.trim()}
          className="flex items-center gap-1 px-3"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default SubtaskList;
