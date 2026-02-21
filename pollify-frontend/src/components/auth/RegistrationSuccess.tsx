import { SuccessScreen } from './SuccessScreen';
import { Mail, CheckCircle2, Shield } from 'lucide-react';

interface RegistrationSuccessProps {
  email: string;
  hasOfficialEmail: boolean;
  firstName?: string;
}

export function RegistrationSuccess({ 
  email, 
  hasOfficialEmail, 
  firstName 
}: RegistrationSuccessProps) {
  const userName = firstName ? ` ${firstName}` : '';

  if (hasOfficialEmail) {
    // Official email - needs verification before accessing dashboard
    return (
      <SuccessScreen
        title={`Welcome to Pollify${userName}! 🎉`}
        message="Verify your email to access your admin dashboard"
        description={`We've sent a verification link to ${email}. Click the link to verify your school email and start managing elections.`}
        actionText="Go to Dashboard"
        actionLink="/dashboard"
        secondaryActionText="Back to Login"
        secondaryActionLink="/login"
        icon={<Mail className="w-12 h-12 text-blue-600 dark:text-blue-500" />}
        showConfetti={true}
      />
    );
  }

  // Personal email - account created, will set up school later in dashboard
  return (
    <SuccessScreen
      title={`Admin Account Created${userName}! 🎉`}
      message="Your account is ready! Access your dashboard"
      description={`Your admin account has been created with ${email}. You can now access your dashboard and set up your school's voting system.`}
      actionText="Go to Dashboard"
      actionLink="/dashboard"
      secondaryActionText="Back to Login"
      secondaryActionLink="/login"
      icon={<Shield className="w-12 h-12 text-green-600 dark:text-green-500" />}
      showConfetti={true}
    />
  );
}
