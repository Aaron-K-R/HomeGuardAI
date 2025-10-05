import { API_CONFIG } from '../config/api';

export interface SecuritySettingsRequest {
  motionDetectionEnabled: boolean;
  doorSensorEnabled: boolean;
  windowSensorEnabled: boolean;
  cameraRecordingEnabled: boolean;
  nightVisionEnabled: boolean;
  alarmSensitivityLevel: number;
  autoArmTime?: string;
  autoDisarmTime?: string;
  emergencyContactsNotified: boolean;
  policeNotificationEnabled: boolean;
}

export interface SecuritySettingsResponse {
  id: string;
  homeId: string;
  homeName: string;
  homeAddress: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  motionDetectionEnabled: boolean;
  doorSensorEnabled: boolean;
  windowSensorEnabled: boolean;
  cameraRecordingEnabled: boolean;
  nightVisionEnabled: boolean;
  alarmSensitivityLevel: number;
  autoArmTime?: string;
  autoDisarmTime?: string;
  emergencyContactsNotified: boolean;
  policeNotificationEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  hasAutoArming: boolean;
  hasCustomAlert: boolean;
  securityLevel: 'basic' | 'standard' | 'premium';
}

class SecuritySettingsService {
  private baseUrl = API_CONFIG.SPRING_API_BASE_URL;
  private endpoint = API_CONFIG.ENDPOINTS.SECURITY_SETTINGS;

  /**
   * Create security settings for a home
   */
  async createSecuritySettings(homeId: string, settings: SecuritySettingsRequest): Promise<SecuritySettingsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/home/${homeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating security settings:', error);
      throw error;
    }
  }

  /**
   * Get security settings by ID
   */
  async getSecuritySettingsById(id: string): Promise<SecuritySettingsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
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
      console.error('Error fetching security settings by ID:', error);
      throw error;
    }
  }

  /**
   * Get security settings by home ID
   */
  async getSecuritySettingsByHomeId(homeId: string): Promise<SecuritySettingsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/home/${homeId}`, {
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
      console.error('Error fetching security settings by home ID:', error);
      throw error;
    }
  }

  /**
   * Get all security settings
   */
  async getAllSecuritySettings(): Promise<SecuritySettingsResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
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
      console.error('Error fetching all security settings:', error);
      throw error;
    }
  }

  /**
   * Update security settings by ID
   */
  async updateSecuritySettings(id: string, settings: Partial<SecuritySettingsRequest>): Promise<SecuritySettingsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  }

  /**
   * Update security settings by home ID
   */
  async updateSecuritySettingsByHomeId(homeId: string, settings: Partial<SecuritySettingsRequest>): Promise<SecuritySettingsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/home/${homeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating security settings by home ID:', error);
      throw error;
    }
  }

  /**
   * Delete security settings by ID
   */
  async deleteSecuritySettings(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${id}`, {
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
      console.error('Error deleting security settings:', error);
      throw error;
    }
  }

  /**
   * Delete security settings by home ID
   */
  async deleteSecuritySettingsByHomeId(homeId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/home/${homeId}`, {
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
      console.error('Error deleting security settings by home ID:', error);
      throw error;
    }
  }

  /**
   * Get security settings with motion detection enabled
   */
  async getSecuritySettingsWithMotionDetection(): Promise<SecuritySettingsResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/motion-detection`, {
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
      console.error('Error fetching security settings with motion detection:', error);
      throw error;
    }
  }

  /**
   * Get security settings with night vision enabled
   */
  async getSecuritySettingsWithNightVision(): Promise<SecuritySettingsResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/night-vision`, {
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
      console.error('Error fetching security settings with night vision:', error);
      throw error;
    }
  }

  /**
   * Get security settings with emergency contacts enabled
   */
  async getSecuritySettingsWithEmergencyContacts(): Promise<SecuritySettingsResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/emergency-contacts`, {
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
      console.error('Error fetching security settings with emergency contacts:', error);
      throw error;
    }
  }
}

export const securitySettingsService = new SecuritySettingsService();
