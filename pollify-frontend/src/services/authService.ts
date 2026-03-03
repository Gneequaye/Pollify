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
  /**
   * Unified login — backend auto-detects SUPER_ADMIN or TENANT_ADMIN.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /** Explicit super admin login */
  async superAdminLogin(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/super/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /** Explicit tenant admin login */
  async tenantAdminLogin(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

export const authService = new AuthService();
