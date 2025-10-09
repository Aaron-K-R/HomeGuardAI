import { API_CONFIG } from '../../config/api';

export interface HomeInvitationRequest {
  email: string;
  role?: 'ADMIN' | 'USER';
  expiresAt?: string; // ISO date string
  message?: string;
}

export interface HomeInvitationResponse {
  id: string;
  homeId: string;
  homeName: string;
  homeAddress: string;
  invitedByUserId: string;
  invitedByName: string;
  invitedByEmail: string;
  email: string;
  invitationToken: string;
  expiresAt: string;
  isAccepted: boolean;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
  message?: string;
}

class HomeInvitationService {
  private baseUrl = API_CONFIG.SPRING_API_BASE_URL;
  private endpoint = API_CONFIG.ENDPOINTS.HOME_INVITATIONS;

  /**
   * Create an invitation for a user to join a home
   */
  async createInvitation(homeId: string, invitedByUserId: string, invitation: HomeInvitationRequest): Promise<HomeInvitationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/homes/${homeId}/invite?invitedByUserId=${invitedByUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invitation),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating home invitation:', error);
      throw error;
    }
  }

  /**
   * Get invitation by token
   */
  async getInvitationByToken(token: string): Promise<HomeInvitationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/token/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invitation by token:', error);
      throw error;
    }
  }

  /**
   * Accept an invitation
   */
  async acceptInvitation(token: string, userId: string): Promise<HomeInvitationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/token/${token}/accept?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  /**
   * Get all invitations for a home
   */
  async getInvitationsByHomeId(homeId: string): Promise<HomeInvitationResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/homes/${homeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invitations by home ID:', error);
      throw error;
    }
  }

  /**
   * Get invitations by email
   */
  async getInvitationsByEmail(email: string): Promise<HomeInvitationResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/email/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching invitations by email:', error);
      throw error;
    }
  }

  /**
   * Cancel an invitation
   */
  async cancelInvitation(invitationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error canceling invitation:', error);
      throw error;
    }
  }
}

export const homeInvitationService = new HomeInvitationService();
