import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './types';

// Import screens
import HomeSelectionScreen from '../screens/HomeSelectionScreen';
import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import SecuritySettingsScreen from '../screens/SecuritySettingsScreen';
import AppSettingsScreen from '../screens/AppSettingsScreen';
import HomeListScreen from '../screens/HomeListScreen';
import MemberManagementScreen from '../screens/MemberManagementScreen';
import ManagePeopleScreen from '../screens/ManagePeopleScreen';
import RecentActivitiesScreen from '../screens/RecentActivitiesScreen';
import GlobalActivitiesScreen from '../screens/GlobalActivitiesScreen';
import DeviceManagementScreen from '../screens/DeviceManagementScreen';
import DeadboltControlScreen from '../screens/DeadboltControlScreen';
import FaceDetectionScreen from '../screens/FaceDetectionScreen';
import RFIDManagementScreen from '../screens/RFIDManagementScreen';
import AccessLogsScreen from '../screens/AccessLogsScreen';
// Import other main app screens as you create them
// import ProfileScreen from '../screens/ProfileScreen';
// import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeSelection"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen 
        name="HomeSelection" 
        component={HomeSelectionScreen}
        options={{
          gestureEnabled: false, // Prevent swipe back on home selection
        }}
      />
      <Stack.Screen 
        name="HomeDashboard" 
        component={HomeDashboardScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="SecuritySettings" 
        component={SecuritySettingsScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="AppSettings" 
        component={AppSettingsScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="HomeList" 
        component={HomeListScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="MemberManagement" 
        component={MemberManagementScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="ManagePeople" 
        component={ManagePeopleScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="RecentActivities" 
        component={RecentActivitiesScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="GlobalActivities" 
        component={GlobalActivitiesScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="DeviceManagement" 
        component={DeviceManagementScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="DeadboltControl" 
        component={DeadboltControlScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="FaceDetection" 
        component={FaceDetectionScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="RFIDManagement" 
        component={RFIDManagementScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="AccessLogs" 
        component={AccessLogsScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      {/* Add more main app screens here as you develop them */}
      {/* 
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          gestureEnabled: true,
        }}
      />
      */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
