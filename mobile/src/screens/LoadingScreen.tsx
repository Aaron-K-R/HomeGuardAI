import React from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo/Icon */}
        <View className={`w-24 h-24 rounded-full ${isDark ? 'bg-primary-600' : 'bg-primary-500'} items-center justify-center mb-8`}>
          <Ionicons 
            name="shield-checkmark" 
            size={48} 
            color="white" 
          />
        </View>

        {/* App Title */}
        <Text className={`text-3xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          HomeGuard AI
        </Text>
        
        {/* Loading Indicator */}
        <ActivityIndicator 
          size="large" 
          color={isDark ? '#3b82f6' : '#2563eb'} 
          className="mt-8"
        />
        
        <Text className={`text-base text-center mt-4 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          Loading...
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
