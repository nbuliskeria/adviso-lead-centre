// src/components/clients/onboarding/CredentialsCard.tsx
import { Key } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { PasswordInput } from '../../ui/PasswordInput';
import { Label } from '../../ui/Label';
import type { Control, FieldErrors } from 'react-hook-form';
// import type { ClientOnboardingFormData } from '../../../lib/schemas'; // TODO: Use when needed

interface CredentialsCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
}

const CredentialsCard = ({ register, errors }: CredentialsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-[var(--color-primary)]" />
          RS.GE Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <Label htmlFor="rs_username">
              RS.GE Username
            </Label>
            <Input
              id="rs_username"
              placeholder="Enter RS.GE username"
              {...register('rs_username')}
              error={errors.rs_username?.message}
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="rs_password">
              RS.GE Password
            </Label>
            <PasswordInput
              id="rs_password"
              placeholder="Enter RS.GE password"
              {...register('rs_password')}
              error={errors.rs_password?.message}
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-md">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-[var(--color-warning)] flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold flex items-center justify-center w-full h-full">!</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-[var(--color-warning)] mb-1">Security Notice</p>
              <p className="text-[var(--color-text-muted)]">
                These credentials are stored for integration purposes. In production, use Supabase Vault for secure credential management.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CredentialsCard;
