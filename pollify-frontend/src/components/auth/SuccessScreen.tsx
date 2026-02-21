import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SuccessScreenProps {
  title: string;
  message: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  secondaryActionText?: string;
  secondaryActionLink?: string;
  icon?: React.ReactNode;
  showConfetti?: boolean;
}

export function SuccessScreen({
  title,
  message,
  description,
  actionText = 'Continue',
  actionLink = '/dashboard',
  secondaryActionText,
  secondaryActionLink,
  icon,
  showConfetti = true,
}: SuccessScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
      {/* Animated Success Icon */}
      <div className="relative">
        {showConfetti && (
          <>
            {/* Confetti particles */}
            <div className="absolute -inset-12 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-confetti"
                  style={{
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5],
                    animationDelay: `${i * 0.1}s`,
                    transform: `rotate(${i * 45}deg) translateY(-40px)`,
                  }}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Main Icon */}
        <div className="relative z-10 w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-scale-in">
          {icon || <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />}
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-3 max-w-md">
        <h2 className="text-2xl font-bold text-foreground animate-fade-in-up">
          {title}
        </h2>
        <p className="text-base text-foreground/90 animate-fade-in-up animation-delay-100">
          {message}
        </p>
        {description && (
          <p className="text-sm text-muted-foreground animate-fade-in-up animation-delay-200">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm animate-fade-in-up animation-delay-300">
        <Button
          onClick={() => navigate(actionLink)}
          className="flex-1"
          size="lg"
        >
          {actionText}
        </Button>
        
        {secondaryActionText && secondaryActionLink && (
          <Button
            onClick={() => navigate(secondaryActionLink)}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            {secondaryActionText}
          </Button>
        )}
      </div>
    </div>
  );
}
