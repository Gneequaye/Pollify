import { SuccessScreen } from './SuccessScreen';
import { Shield } from 'lucide-react';

interface LoginSuccessProps {
  firstName?: string;
}

export function LoginSuccess({ firstName }: LoginSuccessProps) {
  const userName = firstName ? ` ${firstName}` : '';

  return (
    <SuccessScreen
      title={`Welcome Back${userName}! 👋`}
      message="You've successfully signed in as admin"
      description="Redirecting you to your admin dashboard..."
      actionText="Go to Dashboard"
      actionLink="/dashboard"
      showConfetti={false}
      icon={<Shield className="w-12 h-12 text-green-600 dark:text-green-500" />}
    />
  );
}
