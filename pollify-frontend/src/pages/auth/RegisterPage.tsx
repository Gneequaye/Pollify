import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterFormMultiStep } from '@/components/auth/RegisterFormMultiStep';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create Admin Account"
      subtitle="Set up your admin account to manage your school's elections."
      imageType="register"
    >
      <RegisterFormMultiStep />
    </AuthLayout>
  );
}
