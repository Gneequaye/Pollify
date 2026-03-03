import { apiRequest } from '@/lib/api';

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface SendInvitationRequest {
  universityName?: string;
  universityEmail?: string;
  invitationCode?: string;
  expiryDays?: number;
}

// ─── Response DTOs ───────────────────────────────────────────────────────────

export interface InvitationResponse {
  invitationToken: string;
  universityName: string;
  universityEmail: string;
  invitationCode: string;
  invitationUrl: string;
  expiresAt: string;
  message: string;
}

export interface ValidateInvitationResponse {
  valid: boolean;
  universityName: string | null;
  universityEmail: string | null;
  invitationCode: string | null;
  message: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const invitationService = {
  /** POST /api/super-admin/invitations — send invitation email to a school */
  async sendInvitation(data: SendInvitationRequest): Promise<InvitationResponse> {
    return apiRequest('/super-admin/invitations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** GET /api/super-admin/invitations — list all invitations */
  async getAllInvitations(): Promise<InvitationResponse[]> {
    return apiRequest('/super-admin/invitations', {
      method: 'GET',
    });
  },

  /** GET /api/public/invitations/validate?token=xxx — verify a token from the email link */
  async validateToken(token: string): Promise<ValidateInvitationResponse> {
    return apiRequest(`/public/invitations/validate?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });
  },
};
