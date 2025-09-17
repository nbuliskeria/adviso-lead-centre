import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
}

/**
 * ConfirmationModal component for user confirmations
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to call when modal should close
 * @param onConfirm - Function to call when user confirms
 * @param title - Modal title
 * @param description - Description text to display
 * @param confirmText - Text for confirm button (default: "Confirm")
 * @param cancelText - Text for cancel button (default: "Cancel")
 * @param variant - Style variant for confirm button (default: "destructive")
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
