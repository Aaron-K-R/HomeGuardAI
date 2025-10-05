import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { UserProvider } from './src/contexts/UserContext';
import AppNavigator from './src/navigation/AppNavigator';
import './global.css';

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
    <ThemeProvider>
      <UserProvider>
        <NavigationContainer>
          <StatusBar style="auto"/> 
          <AppNavigator />
        </NavigationContainer>
      </UserProvider>
    </ThemeProvider>
  );
}