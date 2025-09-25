import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Import screen components
import HomeScreen from './src/screens/HomeScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import SettingsScreen from './src/screens/SettingsScreen';

/**
 * HomeGuard AI Mobile Application - Main App Component
 * 
 * This is the root component of the HomeGuard AI mobile application built with React Native and Expo.
 * It sets up the main navigation structure using React Navigation with a bottom tab navigator,
 * providing easy access to the three main sections of the app: Home, Security, and Settings.
 * 
 * App Architecture:
 * - Navigation: Bottom tab navigation for easy access to main features
 * - Screens: Three main screens (Home, Security, Settings) with specific functionality
 * - Icons: Ionicons for consistent iconography throughout the app
 * - Status Bar: Automatic status bar styling based on system preferences
 * 
 * Navigation Structure:
 * - Home Tab: Main dashboard with system status and quick actions
 * - Security Tab: Live security monitoring, cameras, and alerts
 * - Settings Tab: User preferences, system configuration, and account management
 * 
 * Key Features:
 * - Cross-platform compatibility (iOS and Android)
 * - Responsive design with consistent styling
 * - Intuitive navigation with visual feedback
 * - Real-time security monitoring capabilities
 * - User preference management
 * - Emergency alert system integration
 * 
 * Technology Stack:
 * - React Native: Cross-platform mobile development
 * - Expo: Development platform and build tools
 * - React Navigation: Navigation library for React Native
 * - Ionicons: Icon library for consistent UI elements
 * - TypeScript: Type-safe JavaScript development
 * 
 * Future Enhancements:
 * - Authentication flow integration
 * - Real-time data synchronization with backend API
 * - Push notification handling
 * - Offline mode support
 * - Dark mode theme support
 * - Accessibility improvements
 */

// Create the bottom tab navigator instance
const Tab = createBottomTabNavigator();

/**
 * Main App Component - Root component of the HomeGuard AI mobile application
 * 
 * This component renders the main navigation structure and handles the overall app layout.
 * It uses React Navigation's bottom tab navigator to provide easy access to the three
 * main sections of the security app.
 * 
 * @returns JSX.Element - The main app component with navigation structure
 */
export default function App() {
  return (
    <NavigationContainer>
      {/* Status bar with automatic styling based on system preferences */}
      <StatusBar style="auto" />
      
      {/* Bottom tab navigator with custom icon configuration */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // Custom tab bar icon function that returns different icons for focused/unfocused states
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            // Determine which icon to show based on the current route
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Security') {
              iconName = focused ? 'shield' : 'shield-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              // Fallback icon for unknown routes
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          // Active tab color (iOS blue)
          tabBarActiveTintColor: '#007AFF',
          // Inactive tab color (gray)
          tabBarInactiveTintColor: 'gray',
        })}
      >
        {/* Home Tab - Main dashboard and system overview */}
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'HomeGuard AI' }}
        />
        
        {/* Security Tab - Live monitoring and security status */}
        <Tab.Screen 
          name="Security" 
          component={SecurityScreen}
          options={{ title: 'Security Status' }}
        />
        
        {/* Settings Tab - User preferences and system configuration */}
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}