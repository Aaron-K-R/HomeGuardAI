export interface AppSettings {
  id?: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  
  // UI/UX Settings
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'es' | 'fr';
  
  // Notification Settings
  notificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  
  // Security Settings
  biometricLoginEnabled: boolean;
  twoFactorEnabled: boolean;
  autoLockTimeout: number; // minutes
  
  // Performance Settings
  dataUsageWifiOnly: boolean;
  locationTrackingEnabled: boolean;
  
  createdAt?: string;
  updatedAt?: string;
  
  // Computed fields
  hasNotificationsEnabled?: boolean;
  hasLocationFeaturesEnabled?: boolean;
  accessibilityLevel?: 'basic' | 'enhanced' | 'full';
}

export interface AppSettingsRequest {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'en' | 'es' | 'fr';
  notificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  locationTrackingEnabled?: boolean;
  biometricLoginEnabled?: boolean;
  twoFactorEnabled?: boolean;
  autoLockTimeout?: number;
  dataUsageWifiOnly?: boolean;
}

export interface AppSettingsUpdate {
  theme?: 'light' | 'dark' | 'auto';
  language?: 'en' | 'es' | 'fr';
  notificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  smsNotificationsEnabled?: boolean;
  locationTrackingEnabled?: boolean;
  biometricLoginEnabled?: boolean;
  twoFactorEnabled?: boolean;
  autoLockTimeout?: number;
  dataUsageWifiOnly?: boolean;
}
