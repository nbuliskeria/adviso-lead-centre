// src/components/clients/onboarding/UserEmailsCard.tsx
import { Mail, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Label } from '../../ui/Label';
import type { Control, FieldErrors, UseFieldArrayReturn } from 'react-hook-form';
// import type { ClientOnboardingFormData } from '../../../lib/schemas'; // TODO: Use when needed

interface UserEmailsCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: FieldErrors<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userEmailsArray: UseFieldArrayReturn<any, 'user_emails'>;
  addUserEmail: () => void;
  removeUserEmail: (index: number) => void;
}

const UserEmailsCard = ({ 
  register, 
  userEmailsArray,
  addUserEmail,
  removeUserEmail 
}: UserEmailsCardProps) => {
  const { fields } = userEmailsArray;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-[var(--color-primary)]" />
          User Email Addresses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email List */}
        {fields.length > 0 && (
          <div className="space-y-3">
            <Label>Email Addresses</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="user@example.com"
                    {...register(`user_emails.${index}.email`)}
                    error={false}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeUserEmail(index)}
                  className="mt-0 text-[var(--color-destructive)] hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Remove email</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-8 text-[var(--color-text-muted)]">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No email addresses added yet</p>
            <p className="text-xs mt-1">Click "Add Email" to get started</p>
          </div>
        )}

        {/* Add Email Button */}
        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={addUserEmail}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Email
          </Button>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-[var(--color-text-muted)]">
          Add email addresses for users who will have access to the client space.
        </div>
      </CardContent>
    </Card>
  );
};

export default UserEmailsCard;
