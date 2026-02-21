import { apiRequest } from '@/lib/api';
import type { LoginResponse } from '@/lib/auth';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  registrationType?: string;
  schoolCode?: string;
  studentId?: string;
  registrationToken?: string;
}

class AuthService {
  // Login - tries super admin first, then tenant admin
  async login(email: string, password: string): Promise<LoginResponse> {
    const credentials: LoginRequest = { email, password };

    try {
      // Try super admin login first
      return await apiRequest<LoginResponse>('/auth/super/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (superAdminError: any) {
      // If super admin fails with 401/403, try tenant admin
      if (superAdminError.status === 401 || superAdminError.status === 403) {
        try {
          return await apiRequest<LoginResponse>('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
          });
        } catch (tenantAdminError: any) {
          throw new Error('Invalid email or password');
        }
      }
      throw superAdminError;
    }
  }

  // Super Admin Login (explicit)
  async superAdminLogin(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/super/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Tenant Admin Login (explicit)
  async tenantAdminLogin(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Register new tenant admin
  async register(data: RegisterRequest): Promise<any> {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Validate invitation token
  async validateInvitation(token: string): Promise<any> {
    return apiRequest('/invitations/validate', {
      method: 'POST',
      body: JSON.stringify({ invitationToken: token }),
    });
  }

  // Complete onboarding
  async completeOnboarding(data: any): Promise<any> {
    return apiRequest('/invitations/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const authService = new AuthService();
