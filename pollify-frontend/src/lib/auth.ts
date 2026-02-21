// Authentication Types
export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string | null;
  universityName: string;
}

// Session Storage Keys (use sessionStorage instead of localStorage)
const TOKEN_KEY = 'pollify_auth_token';
const USER_KEY = 'pollify_user';

// Token Management
export function getAuthToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

// User Management
export function getCurrentUser(): LoginResponse | null {
  const userJson = sessionStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: LoginResponse): void {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeCurrentUser(): void {
  sessionStorage.removeItem(USER_KEY);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Logout
export function logout(): void {
  removeAuthToken();
  removeCurrentUser();
}

// Get Authorization Header
export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Get dashboard route based on user role
export function getDashboardRoute(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/dashboard/admin';
    case 'TENANT_ADMIN':
      return '/dashboard/tenant';
    case 'VOTER':
      return '/dashboard/voter';
    default:
      return '/login';
  }
}

// Get dashboard route for current user
export function getCurrentUserDashboard(): string {
  const user = getCurrentUser();
  if (!user) return '/login';
  return getDashboardRoute(user.role);
}