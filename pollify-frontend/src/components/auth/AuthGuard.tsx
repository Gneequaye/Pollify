import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, getDashboardRoute } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'VOTER';
}

/**
 * Wraps a dashboard and redirects to /login if not authenticated.
 * Also redirects to the correct dashboard if the user's role doesn't match.
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (requiredRole) {
      const user = getCurrentUser();
      if (user && user.role !== requiredRole) {
        // Wrong dashboard for this role — redirect to their correct one
        navigate(getDashboardRoute(user.role), { replace: true });
      }
    }
  }, [navigate, requiredRole]);

  if (!isAuthenticated()) return null;

  return <>{children}</>;
}
