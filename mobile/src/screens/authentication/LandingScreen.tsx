// ============================================================================
// MODULE: LandingScreen Component
// PURPOSE: First screen users see when opening the app - displays app branding,
//          key features, and navigation options to sign in or create account
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

// --------------Type Definitions--------------
// PURPOSE: Define the props interface for type safety
interface LandingScreenProps {
  navigation: any; // Navigation object from React Navigation to move between screens
}

// --------------Component: LandingScreen--------------
// PURPOSE: Main landing page component that serves as the entry point to the app
const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  // Get theme context to determine if dark mode is enabled
  const { isDark } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
      {/* Status bar styling - changes color based on theme */}
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* --------------Main Content Container--------------
          PURPOSE: Centers all content vertically and provides padding */}
      <View className="flex-1 justify-center items-center px-6">
        
        {/* --------------App Logo/Icon--------------
            PURPOSE: Displays the HomeGuard AI shield icon */}
        <View className={`w-24 h-24 rounded-full ${isDark ? 'bg-primary-600' : 'bg-primary-500'} items-center justify-center mb-8`}>
          <Ionicons 
            name="shield-checkmark" 
            size={48} 
            color="white" 
          />
        </View>

        {/* --------------App Title--------------
            PURPOSE: Displays the app name "HomeGuard AI" */}
        <Text className={`text-4xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          HomeGuard AI
        </Text>
        
        {/* --------------App Subtitle--------------
            PURPOSE: Provides a brief description of what the app does */}
        <Text className={`text-lg text-center mb-12 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          Smart home security powered by AI
        </Text>

        {/* --------------Feature List--------------
            PURPOSE: Highlights key features of the app to attract users */}
        <View className="w-full mb-12">
          {/* Feature 1: Live Camera Monitoring */}
          <View className="flex-row items-center mb-4">
            <Ionicons 
              name="camera" 
              size={24} 
              color={isDark ? '#3b82f6' : '#2563eb'} 
            />
            <Text className={`ml-3 text-base ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
              Live camera monitoring
            </Text>
          </View>
          
          {/* Feature 2: Facial Recognition */}
          <View className="flex-row items-center mb-4">
            <Ionicons 
              name="finger-print" 
              size={24} 
              color={isDark ? '#3b82f6' : '#2563eb'} 
            />
            <Text className={`ml-3 text-base ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
              Facial recognition access
            </Text>
          </View>
          
          {/* Feature 3: Real-time Alerts */}
          <View className="flex-row items-center mb-4">
            <Ionicons 
              name="notifications" 
              size={24} 
              color={isDark ? '#3b82f6' : '#2563eb'} 
            />
            <Text className={`ml-3 text-base ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
              Real-time alerts
            </Text>
          </View>
        </View>

        {/* --------------Action Buttons--------------
            PURPOSE: Provides navigation to sign in or create account screens */}
        <View className="w-full">
          {/* Sign In Button - navigates to Login screen */}
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Create Account Button - navigates to SignUp screen */}
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl border-2 mt-6 ${isDark ? 'border-primary-600' : 'border-primary-500'}`}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text className={`text-lg font-semibold text-center ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --------------Footer with Terms of Service--------------
          PURPOSE: Displays legal disclaimer and link to terms of service */}
      <View className="pb-6 px-6">
        <View className="flex-row flex-wrap justify-center items-center">
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            By continuing, you agree to our{' '}
          </Text>
          {/* Terms of Service link - navigates to TermsOfService screen */}
          <TouchableOpacity onPress={() => navigation.navigate('TermsOfService')}>
            <Text className={`text-sm font-semibold underline ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              Terms of Service
            </Text>
          </TouchableOpacity>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {' '}and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LandingScreen;
