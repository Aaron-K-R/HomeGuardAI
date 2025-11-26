// ============================================================================
// MODULE: UserContext
// PURPOSE: React Context that manages user authentication state and provides
//          authentication methods (sign in, sign up, sign out) to all components
// ============================================================================

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AuthService, { User, AuthResponse } from '../services/authentication/AuthService';
import { appSettingsService } from '../services/settings/AppSettingsService';
import { useTheme } from './ThemeContext';

// --------------Type Definitions--------------
// PURPOSE: Define the interface for UserContext to provide type safety
interface UserContextType {
  user: User | null; // Current logged-in user or null if not authenticated
  isLoading: boolean; // Loading state during authentication operations
  isAuthenticated: boolean; // Boolean indicating if user is logged in
  signIn: (email: string, password: string) => Promise<AuthResponse>; // Sign in method
  signUp: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    emergencyContact?: string;
  }) => Promise<AuthResponse>; // Sign up method
  signOut: () => Promise<AuthResponse>; // Sign out method
  resetPassword: (email: string) => Promise<AuthResponse>; // Password reset method
  updateProfile: (updates: Partial<User>) => Promise<AuthResponse>; // Update user profile
  fetchUserTheme: (userId: string) => Promise<string | null>; // Fetch user's theme preference
}

// --------------Context Creation--------------
// PURPOSE: Create the React Context with undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// --------------Provider Props Interface--------------
// PURPOSE: Define props for UserProvider component
interface UserProviderProps {
  children: ReactNode; // Child components that will have access to UserContext
}

// --------------UserProvider Component--------------
// PURPOSE: Provider component that wraps the app and provides user authentication state
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // --------------State Management--------------
  // PURPOSE: Manage user state and loading state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // --------------Service Initialization--------------
  // PURPOSE: Get singleton instance of AuthService and ThemeContext
  const authService = AuthService.getInstance();
  const { setThemeFromUserSettings } = useTheme();

  // --------------Authentication Initialization--------------
  // PURPOSE: Initialize authentication state when app starts and listen for auth changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.initializeAuth();
        if (response.success && response.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // --------------Auth State Listener--------------
    // PURPOSE: Listen to authentication state changes from Supabase
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsLoading(false);
    });

    // Cleanup: Unsubscribe from auth state changes when component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, [authService]);

  // --------------Fetch User Theme--------------
  // PURPOSE: Retrieve user's theme preference from app settings
  const fetchUserTheme = async (userId: string): Promise<string | null> => {
    try {
      const settings = await appSettingsService.getAppSettingsByUserId(userId);
      return settings.theme;
    } catch (error) {
      console.error('Failed to fetch user theme:', error);
      return null;
    }
  };

  // --------------Sign In Method--------------
  // PURPOSE: Authenticate user with email and password, then apply their theme
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signIn({ email, password });
      if (response.success && response.user) {
        setUser(response.user);
        
        // --------------Apply User Theme--------------
        // PURPOSE: Fetch and apply user's saved theme preference after login
        try {
          const userTheme = await fetchUserTheme(response.user.id);
          if (userTheme) {
            setThemeFromUserSettings(userTheme);
          }
        } catch (error) {
          console.error('Failed to apply user theme:', error);
        }
      }
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign in',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // --------------Sign Up Method--------------
  // PURPOSE: Register a new user account with provided information
  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    emergencyContact?: string;
  }): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signUp(data);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign up',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // --------------Sign Out Method--------------
  // PURPOSE: Log out the current user and clear user state
  const signOut = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signOut();
      
      if (response.success) {
        setUser(null);
      }
      return response;
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during sign out',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // --------------Reset Password Method--------------
  // PURPOSE: Send password reset email to user
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during password reset',
      };
    }
  };

  // --------------Update Profile Method--------------
  // PURPOSE: Update user profile information
  const updateProfile = async (updates: Partial<User>): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.updateProfile(updates);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during profile update',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // --------------Context Value--------------
  // PURPOSE: Bundle all context values and methods into a single object
  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    fetchUserTheme,
  };

  // --------------Context Provider--------------
  // PURPOSE: Provide the context value to all child components
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// --------------useUser Hook--------------
// PURPOSE: Custom hook to access UserContext in components
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
