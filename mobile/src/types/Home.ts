export interface Home {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  isArmed: boolean;
  lastActivity: string;
  deviceCount: number;
  cameraCount: number;
  accessCount: number;
  securityLevel: 'low' | 'medium' | 'high';
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecuritySettings {
  homeId: string;
  armMode: 'away' | 'stay' | 'night' | 'off';
  motionDetection: boolean;
  doorSensors: boolean;
  windowSensors: boolean;
  cameraRecording: boolean;
  nightVision: boolean;
  alertsEnabled: boolean;
  silentMode: boolean;
  autoArm: boolean;
  autoArmTime: string; // HH:MM format
  emergencyContacts: string[];
  notificationSettings: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface Device {
  id: string;
  homeId: string;
  name: string;
  type: 'camera' | 'sensor' | 'doorbell' | 'lock' | 'alarm';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  isActive: boolean;
  lastSeen: string;
  batteryLevel?: number;
  signalStrength?: number;
}

export interface AccessEvent {
  id: string;
  homeId: string;
  deviceId: string;
  type: 'access' | 'denied' | 'motion' | 'alarm';
  timestamp: string;
  personName?: string;
  confidence?: number;
  imageUrl?: string;
  location: string;
  status: 'success' | 'failed' | 'pending';
}
