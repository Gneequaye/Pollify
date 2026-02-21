import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout
      title="Admin Sign In"
      subtitle="Welcome back! Sign in to access your admin dashboard."
      imageType="login"
    >
      <LoginForm />
    </AuthLayout>
  );
}
