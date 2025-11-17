// Environment variables - these will be read from .env file by Expo
const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co';
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const EXPO_PUBLIC_SPRING_API_BASE_URL = process.env.EXPO_PUBLIC_SPRING_API_BASE_URL || 'http://localhost:8080/api/v1';
const EXPO_PUBLIC_ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';

// Validate required environment variables
if (!EXPO_PUBLIC_SUPABASE_URL) {
  console.warn('EXPO_PUBLIC_SUPABASE_URL not found, using placeholder values');
}
if (!EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('EXPO_PUBLIC_SUPABASE_ANON_KEY not found, using placeholder values');
}
if (!EXPO_PUBLIC_SPRING_API_BASE_URL) {
  console.warn('EXPO_PUBLIC_SPRING_API_BASE_URL not found, using default values');
}
if (!EXPO_PUBLIC_ENVIRONMENT) {
  console.warn('EXPO_PUBLIC_ENVIRONMENT not found, using development');
}

// API Configuration
export const API_CONFIG = {
  // Spring Boot Backend
  SPRING_API_BASE_URL: EXPO_PUBLIC_SPRING_API_BASE_URL,
  
  // Supabase Configuration
  SUPABASE_URL: EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: EXPO_PUBLIC_SUPABASE_ANON_KEY,
  
  // API Endpoints
  ENDPOINTS: {
    USERS: '/users',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    },
    HOMES: '/homes',
    DEVICES: '/devices',
    ACCESS_LOGS: '/access-logs',
    ACCESS_PERMISSIONS: '/access-permissions',
    FACE_PROFILES: '/face-profiles',
    RFID_CARDS: '/rfid-cards',
    APP_SETTINGS: '/app-settings',
    SECURITY_SETTINGS: '/security-settings',
    HOME_INVITATIONS: '/home-invitations',
    PERSONS: '/persons',
  },
  
  // Request timeouts
  TIMEOUT: 10000, // 10 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Environment-specific configurations
export const getApiConfig = () => {
  const isDevelopment = EXPO_PUBLIC_ENVIRONMENT === 'development';
  
  return {
    ...API_CONFIG,
    SPRING_API_BASE_URL: isDevelopment 
      ? EXPO_PUBLIC_SPRING_API_BASE_URL
      : 'https://your-production-api.com/api', // Update with your production API URL
  };
};
