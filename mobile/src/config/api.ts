// ============================================================================
// MODULE: API Configuration
// PURPOSE: Centralized configuration for API endpoints, base URLs, and connection
//          settings for both Supabase and Spring Boot backend services
// ============================================================================

// --------------Environment Variables--------------
// PURPOSE: Read environment variables from .env file or use default values
const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co';
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const EXPO_PUBLIC_SPRING_API_BASE_URL = process.env.EXPO_PUBLIC_SPRING_API_BASE_URL || 'http://localhost:8080/api/v1';
const EXPO_PUBLIC_ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';

// --------------Environment Variable Validation--------------
// PURPOSE: Warn if required environment variables are missing
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

// --------------API Configuration Object--------------
// PURPOSE: Export centralized API configuration for use throughout the app
export const API_CONFIG = {
  // --------------Spring Boot Backend URL--------------
  // PURPOSE: Base URL for Spring Boot REST API endpoints
  SPRING_API_BASE_URL: EXPO_PUBLIC_SPRING_API_BASE_URL,
  
  // --------------Supabase Configuration--------------
  // PURPOSE: Supabase project URL and anonymous key for authentication
  SUPABASE_URL: EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: EXPO_PUBLIC_SUPABASE_ANON_KEY,
  
  // --------------API Endpoints--------------
  // PURPOSE: Define all API endpoint paths used throughout the application
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
  
  // --------------Request Timeout--------------
  // PURPOSE: Maximum time to wait for API response (10 seconds)
  TIMEOUT: 10000, // 10 seconds
  
  // --------------Retry Configuration--------------
  // PURPOSE: Number of retry attempts and delay between retries for failed requests
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// --------------Environment-Specific Configuration--------------
// PURPOSE: Return API configuration based on current environment (development/production)
export const getApiConfig = () => {
  const isDevelopment = EXPO_PUBLIC_ENVIRONMENT === 'development';
  
  return {
    ...API_CONFIG,
    // Use different API URL for production vs development
    SPRING_API_BASE_URL: isDevelopment 
      ? EXPO_PUBLIC_SPRING_API_BASE_URL
      : 'https://your-production-api.com/api', // Update with your production API URL
  };
};
