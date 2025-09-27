import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface MainAppScreenProps {
  navigation: any;
}

const MainAppScreen: React.FC<MainAppScreenProps> = ({ navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useUser();

  const handleLogout = async () => {
    const response = await signOut();
    if (response.success) {
      navigation.navigate('Landing');
    } else {
      Alert.alert('Logout Error', response.error || 'Failed to logout');
    }
  };


  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          HomeGuard AI
        </Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={24} 
            color={isDark ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center items-center px-6">
        <View className={`w-24 h-24 rounded-full ${isDark ? 'bg-primary-600' : 'bg-primary-500'} items-center justify-center mb-8`}>
          <Ionicons name="shield-checkmark" size={48} color="white" />
        </View>
        
        <Text className={`text-3xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Welcome to HomeGuard AI
        </Text>
        
        <Text className={`text-lg text-center mb-8 ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
          Your smart home security system is ready to protect your home.
        </Text>

        {user && (
          <Text className={`text-base text-center mb-6 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Welcome, {user.firstName}!
          </Text>
        )}

        <View className="w-full space-y-4">
          <TouchableOpacity
            className={`py-4 px-8 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
            onPress={() => {
              // TODO: Navigate to dashboard or main features
            }}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Get Started
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            className={`py-4 px-8 rounded-xl border-2 ${isDark ? 'border-red-600' : 'border-red-500'}`}
            onPress={handleLogout}
          >
            <Text className={`text-lg font-semibold text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainAppScreen;
