import { apiRequest } from '@/lib/api';

export interface SendInvitationRequest {
  universityName: string;
  universityEmail: string;
}

export interface InvitationResponse {
  invitationId: string;
  invitationToken: string;
  universityName: string;
  universityEmail: string;
  invitationStatus: string;
  expiresAt: string;
  createdAt: string;
}

export const invitationService = {
  // Send invitation (Epic 1, Story 1.1)
  async sendInvitation(data: SendInvitationRequest): Promise<InvitationResponse> {
    return apiRequest('/super-admin/invitations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all invitations
  async getAllInvitations(): Promise<InvitationResponse[]> {
    return apiRequest('/super-admin/invitations', {
      method: 'GET',
    });
  },

  // Resend invitation
  async resendInvitation(invitationId: string): Promise<InvitationResponse> {
    return apiRequest(`/super-admin/invitations/${invitationId}/resend`, {
      method: 'POST',
    });
  },

  // Cancel invitation
  async cancelInvitation(invitationId: string): Promise<void> {
    return apiRequest(`/super-admin/invitations/${invitationId}/cancel`, {
      method: 'DELETE',
    });
  },
};
