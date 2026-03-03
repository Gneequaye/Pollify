// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Automatically injects the JWT token from sessionStorage into every request.
function applyRequestInterceptor(options: RequestInit): RequestInit {
  const token = sessionStorage.getItem('pollify_auth_token');
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  return {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  };
}

// ─── Response Interceptor ──────────────────────────────────────────────────────
// Handles 401 by clearing the session and redirecting to login.
function applyResponseInterceptor(response: Response): void {
  if (response.status === 401) {
    console.warn('[API] 401 Unauthorized – clearing session and redirecting to login');
    sessionStorage.removeItem('pollify_auth_token');
    sessionStorage.removeItem('pollify_user');
    window.location.href = '/login';
  }
}

// ─── Core Request Function ─────────────────────────────────────────────────────
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = applyRequestInterceptor(options);

  try {
    const response = await fetch(url, config);

    // Run response interceptor (handles 401 redirect)
    applyResponseInterceptor(response);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new ApiError(
        error.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        error
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as unknown as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 0);
  }
}
