import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface DashboardScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, signOut } = useUser();
  const [isArmed, setIsArmed] = useState(true);
  const [cameraStatus, setCameraStatus] = useState('online');

  const handleLogout = async () => {
    const response = await signOut();
    if (response.success) {
      // Navigation handled automatically by AppNavigator
    } else {
      Alert.alert('Logout Error', response.error || 'Failed to logout');
    }
  };

  const toggleArmed = () => {
    setIsArmed(!isArmed);
    Alert.alert(
      isArmed ? 'System Disarmed' : 'System Armed',
      isArmed 
        ? 'Your security system has been disarmed' 
        : 'Your security system is now armed and monitoring'
    );
  };

  const SecurityStatusCard = ({ title, status, icon, color, onPress }: any) => (
    <TouchableOpacity
      className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
        isDark ? 'border-neutral-700' : 'border-neutral-200'
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${color}`}>
            <Ionicons name={icon} size={24} color="white" />
          </View>
          <View>
            <Text className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {title}
            </Text>
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {status}
            </Text>
          </View>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDark ? '#a3a3a3' : '#737373'} 
        />
      </View>
    </TouchableOpacity>
  );

  const QuickActionButton = ({ title, icon, color, onPress }: any) => (
    <TouchableOpacity
      className={`flex-1 p-4 rounded-xl mx-1 ${color}`}
      onPress={onPress}
    >
      <View className="items-center">
        <Ionicons name={icon} size={32} color="white" />
        <Text className="text-white font-semibold text-sm mt-2 text-center">
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <View>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            HomeGuard AI
          </Text>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Welcome back, {user?.firstName || 'User'}
          </Text>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons 
              name="log-out-outline" 
              size={24} 
              color={isDark ? '#ef4444' : '#ef4444'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* System Status */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            System Status
          </Text>
          
          <SecurityStatusCard
            title="Security System"
            status={isArmed ? "Armed" : "Disarmed"}
            icon="shield-checkmark"
            color={isArmed ? "bg-success" : "bg-error"}
            onPress={toggleArmed}
          />
          
          <SecurityStatusCard
            title="Camera System"
            status={cameraStatus === 'online' ? "Online" : "Offline"}
            icon="videocam"
            color={cameraStatus === 'online' ? "bg-primary-500" : "bg-error"}
            onPress={() => setCameraStatus(cameraStatus === 'online' ? 'offline' : 'online')}
          />
          
          <SecurityStatusCard
            title="Motion Detection"
            status="Active"
            icon="eye"
            color="bg-warning"
            onPress={() => Alert.alert('Motion Detection', 'Motion detection is currently active')}
          />
        </View>

        {/* Live Camera Feed */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Live Camera Feed
          </Text>
          
          <View className={`rounded-xl overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
            isDark ? 'border-neutral-700' : 'border-neutral-200'
          }`}>
            <View className="aspect-video bg-neutral-800 items-center justify-center">
              <Ionicons name="videocam" size={48} color="#a3a3a3" />
              <Text className={`text-sm mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Camera feed will appear here
              </Text>
            </View>
            <View className="p-4">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Front Door Camera
              </Text>
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Last updated: 2 minutes ago
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Quick Actions
          </Text>
          
          <View className="flex-row mb-4">
            <QuickActionButton
              title="Arm System"
              icon="shield-checkmark"
              color={isArmed ? "bg-error" : "bg-success"}
              onPress={toggleArmed}
            />
            <QuickActionButton
              title="View Cameras"
              icon="videocam"
              color="bg-primary-500"
              onPress={() => Alert.alert('Cameras', 'Camera view coming soon')}
            />
          </View>
          
          <View className="flex-row">
            <QuickActionButton
              title="Access Log"
              icon="list"
              color="bg-info"
              onPress={() => Alert.alert('Access Log', 'Access log coming soon')}
            />
            <QuickActionButton
              title="Settings"
              icon="settings"
              color="bg-neutral-600"
              onPress={() => Alert.alert('Settings', 'Settings coming soon')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Recent Activity
          </Text>
          
          <View className={`rounded-xl p-4 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
            isDark ? 'border-neutral-700' : 'border-neutral-200'
          }`}>
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-success items-center justify-center mr-3">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  System Armed
                </Text>
                <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  2 hours ago
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-3">
              <View className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center mr-3">
                <Ionicons name="person" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  John Doe accessed front door
                </Text>
                <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  4 hours ago
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-warning items-center justify-center mr-3">
                <Ionicons name="warning" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Motion detected in backyard
                </Text>
                <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  6 hours ago
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Security Stats */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Security Stats
          </Text>
          
          <View className="flex-row justify-between">
            <View className={`flex-1 p-4 rounded-xl mr-2 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
              isDark ? 'border-neutral-700' : 'border-neutral-200'
            }`}>
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                24
              </Text>
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Hours Protected
              </Text>
            </View>
            
            <View className={`flex-1 p-4 rounded-xl ml-2 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
              isDark ? 'border-neutral-700' : 'border-neutral-200'
            }`}>
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                3
              </Text>
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Access Events
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;
