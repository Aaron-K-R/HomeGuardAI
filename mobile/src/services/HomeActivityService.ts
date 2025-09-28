import { API_CONFIG } from '../config/api';

export interface HomeActivity {
  id: string;
  homeId: string;
  userId?: string;
  personId?: string;
  deviceId?: string;
  activityType: string;
  priority: string;
  title: string;
  description?: string;
  location?: string;
  imagePath?: string;
  confidence?: number;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedByUserId?: string;
  additionalData?: string;
  activityTimestamp: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityCounts {
  unacknowledged: number;
  unresolved: number;
}

class HomeActivityService {
  private baseUrl = API_CONFIG.SPRING_API_BASE_URL;
  private endpoint = '/home-activities';

  /**
   * Get recent activities for a home
   */
  async getRecentActivities(homeId: string, hours: number = 24): Promise<HomeActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/homes/${homeId}/recent?hours=${hours}`, {
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
      throw error;
    }
  }

  /**
   * Get unacknowledged activities for a home
   */
  async getUnacknowledgedActivities(homeId: string): Promise<HomeActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/homes/${homeId}/unacknowledged`, {
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
      throw error;
    }
  }

  /**
   * Get critical activities for a home
   */
  async getCriticalActivities(homeId: string): Promise<HomeActivity[]> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/homes/${homeId}/critical`, {
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
      throw error;
    }
  }

  /**
   * Get activity counts for a home
   */
  async getActivityCounts(homeId: string): Promise<ActivityCounts> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/homes/${homeId}/counts`, {
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
      throw error;
    }
  }

  /**
   * Acknowledge an activity
   */
  async acknowledgeActivity(activityId: string, userId: string): Promise<HomeActivity> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${activityId}/acknowledge?userId=${userId}`, {
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
      throw error;
    }
  }

  /**
   * Resolve an activity
   */
  async resolveActivity(activityId: string, userId: string): Promise<HomeActivity> {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}/${activityId}/resolve?userId=${userId}`, {
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
      throw error;
    }
  }
}

export const homeActivityService = new HomeActivityService();
