import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join your school community and participate in elections."
      imageType="register"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
