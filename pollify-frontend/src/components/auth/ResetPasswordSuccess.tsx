import { SuccessScreen } from './SuccessScreen';
import { Mail, Key } from 'lucide-react';

interface ResetPasswordSuccessProps {
  email?: string;
  isEmailSent?: boolean;
}

export function ResetPasswordSuccess({ 
  email, 
  isEmailSent = true 
}: ResetPasswordSuccessProps) {
  if (isEmailSent) {
    // Password reset email sent
    return (
      <SuccessScreen
        title="Check Your Email 📧"
        message="Password reset link sent"
        description={email 
          ? `We've sent a password reset link to ${email}. Click the link to create a new password.`
          : "We've sent a password reset link to your email. Click the link to create a new password."
        }
        actionText="Back to Login"
        actionLink="/login"
        icon={<Mail className="w-12 h-12 text-blue-600 dark:text-blue-500" />}
        showConfetti={false}
      />
    );
  }

  // Password successfully reset
  return (
    <SuccessScreen
      title="Password Reset Complete! ✅"
      message="Your password has been successfully reset"
      description="You can now sign in with your new password."
      actionText="Go to Login"
      actionLink="/login"
      icon={<Key className="w-12 h-12 text-green-600 dark:text-green-500" />}
      showConfetti={true}
    />
  );
}
