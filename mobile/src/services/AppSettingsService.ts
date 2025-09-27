import { AppSettings, AppSettingsRequest, AppSettingsUpdate } from '../types/AppSettings';
import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.SPRING_API_BASE_URL;

class AppSettingsService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // Add authentication header if needed
      // 'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Create app settings for a user
  async createAppSettings(userId: string, settings: AppSettingsRequest): Promise<AppSettings> {
    return this.makeRequest<AppSettings>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/user/${userId}`, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Get app settings by ID
  async getAppSettingsById(id: string): Promise<AppSettings> {
    return this.makeRequest<AppSettings>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/${id}`);
  }

  // Get app settings by user ID
  async getAppSettingsByUserId(userId: string): Promise<AppSettings> {
    return this.makeRequest<AppSettings>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/user/${userId}`);
  }

  // Get all app settings
  async getAllAppSettings(): Promise<AppSettings[]> {
    return this.makeRequest<AppSettings[]>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}`);
  }

  // Get app settings by theme
  async getAppSettingsByTheme(theme: string): Promise<AppSettings[]> {
    return this.makeRequest<AppSettings[]>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/theme/${theme}`);
  }

  // Get app settings by language
  async getAppSettingsByLanguage(language: string): Promise<AppSettings[]> {
    return this.makeRequest<AppSettings[]>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/language/${language}`);
  }

  // Get app settings with push notifications enabled
  async getAppSettingsWithPushNotifications(): Promise<AppSettings[]> {
    return this.makeRequest<AppSettings[]>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/push-notifications`);
  }

  // Get app settings with biometric login enabled
  async getAppSettingsWithBiometricLogin(): Promise<AppSettings[]> {
    return this.makeRequest<AppSettings[]>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/biometric-login`);
  }

  // Get app settings with WiFi-only data usage
  async getAppSettingsWithWifiOnly(): Promise<AppSettings[]> {
    return this.makeRequest<AppSettings[]>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/wifi-only`);
  }

  // Update app settings by ID
  async updateAppSettings(id: string, settings: AppSettingsUpdate): Promise<AppSettings> {
    return this.makeRequest<AppSettings>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Update app settings by user ID
  async updateAppSettingsByUserId(userId: string, settings: AppSettingsUpdate): Promise<AppSettings> {
    return this.makeRequest<AppSettings>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Delete app settings by ID
  async deleteAppSettings(id: string): Promise<void> {
    return this.makeRequest<void>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Delete app settings by user ID
  async deleteAppSettingsByUserId(userId: string): Promise<void> {
    return this.makeRequest<void>(`${API_CONFIG.ENDPOINTS.APP_SETTINGS}/user/${userId}`, {
      method: 'DELETE',
    });
  }

  // Helper method to get default settings
  getDefaultSettings(userId: string): AppSettings {
    return {
      userId,
      theme: 'auto',
      language: 'en',
      notificationsEnabled: true,
      pushNotificationsEnabled: true,
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false,
      biometricLoginEnabled: false,
      twoFactorEnabled: false,
      autoLockTimeout: 5,
      dataUsageWifiOnly: true,
      locationTrackingEnabled: true,
    };
  }

  // Helper method to validate settings
  validateSettings(settings: AppSettingsUpdate): string[] {
    const errors: string[] = [];

    if (settings.theme && !['light', 'dark', 'auto'].includes(settings.theme)) {
      errors.push('Theme must be light, dark, or auto');
    }

    if (settings.language && !['en', 'es', 'fr'].includes(settings.language)) {
      errors.push('Language must be en, es, or fr');
    }

    if (settings.autoLockTimeout && (settings.autoLockTimeout < 1 || settings.autoLockTimeout > 60)) {
      errors.push('Auto lock timeout must be between 1 and 60 minutes');
    }

    return errors;
  }
}

export const appSettingsService = new AppSettingsService();
export default appSettingsService;
