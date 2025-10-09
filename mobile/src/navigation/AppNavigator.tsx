import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '../contexts/UserContext';
import { RootStackParamList } from './types';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/common/LoadingScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useUser();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable gestures for root navigator
      }}
    >
      {user ? (
        // User is authenticated, show main app
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        // User is not authenticated, show auth flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
