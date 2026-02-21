import { apiRequest } from '@/lib/api';

export interface CreateTenantRequest {
  universityName: string;
  universityEmail: string;
  schoolType: 'DOMAIN_SCHOOL' | 'CODE_SCHOOL';
  schoolCode?: string | null;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPassword: string;
}

export interface TenantResponse {
  tenantId: string;
  tenantUuid: string;
  universityName: string;
  universityEmail: string;
  schoolType: 'DOMAIN_SCHOOL' | 'CODE_SCHOOL';
  schoolCode?: string;
  databaseSchema: string;
  tenantStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  onboardingCompleted: boolean;
  createdAt: string;
  onboardedAt?: string;
}

export interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  pendingTenants: number;
  suspendedTenants: number;
}

export const tenantService = {
  // Create a new tenant
  createTenant: async (data: CreateTenantRequest): Promise<TenantResponse> => {
    return apiRequest<TenantResponse>('/super-admin/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all tenants
  getAllTenants: async (): Promise<TenantResponse[]> => {
    return apiRequest<TenantResponse[]>('/super-admin/tenants');
  },

  // Get tenant by ID
  getTenantById: async (tenantId: string): Promise<TenantResponse> => {
    return apiRequest<TenantResponse>(`/super-admin/tenants/${tenantId}`);
  },

  // Get tenant statistics
  getTenantStats: async (): Promise<TenantStats> => {
    return apiRequest<TenantStats>('/super-admin/tenants/stats');
  },
};
