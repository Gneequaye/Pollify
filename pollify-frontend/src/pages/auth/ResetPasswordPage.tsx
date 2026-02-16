import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      imageType="reset"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
