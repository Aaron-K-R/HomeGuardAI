import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Home, Device, AccessEvent } from '../types/Home';
import { homeActivityService, HomeActivity, ActivityCounts } from '../services/HomeActivityService';

interface HomeDashboardScreenProps {
  navigation: any;
  route: {
    params: {
      home: Home;
    };
  };
}

const { width } = Dimensions.get('window');

const HomeDashboardScreen: React.FC<HomeDashboardScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  
  // Early safety check - prevent any code execution if route params are not ready
  if (!route || !route.params) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const { home } = route.params;
  
  // Safety check for home object
  if (!home || !home.id) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Home Not Found
          </Text>
          <Text className={`text-sm text-center ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Please select a home first
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-4 px-6 py-3 bg-primary-600 rounded-xl"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const [isArmed, setIsArmed] = useState(home.isArmed);
  const [cameraStatus, setCameraStatus] = useState('online');
  
  // Activity states
  const [recentActivities, setRecentActivities] = useState<HomeActivity[]>([]);
  const [activityCounts, setActivityCounts] = useState<ActivityCounts>({ unacknowledged: 0, unresolved: 0 });
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Mock devices for this home
  const [devices] = useState<Device[]>([
    {
      id: '1',
      homeId: home.id,
      name: 'Front Door Camera',
      type: 'camera',
      status: 'online',
      location: 'Front Door',
      isActive: true,
      lastSeen: '2 minutes ago',
      batteryLevel: 85
    },
    {
      id: '2',
      homeId: home.id,
      name: 'Motion Sensor',
      type: 'sensor',
      status: 'online',
      location: 'Living Room',
      isActive: true,
      lastSeen: '1 minute ago',
      batteryLevel: 92
    },
    {
      id: '3',
      homeId: home.id,
      name: 'Door Lock',
      type: 'lock',
      status: 'online',
      location: 'Front Door',
      isActive: true,
      lastSeen: '5 minutes ago',
      signalStrength: 85
    }
  ]);

  // Mock recent events
  const [recentEvents] = useState<AccessEvent[]>([
    {
      id: '1',
      homeId: home.id,
      deviceId: '1',
      type: 'access',
      timestamp: '2 hours ago',
      personName: 'John Doe',
      confidence: 95,
      location: 'Front Door',
      status: 'success'
    },
    {
      id: '2',
      homeId: home.id,
      deviceId: '2',
      type: 'motion',
      timestamp: '4 hours ago',
      location: 'Living Room',
      status: 'success'
    }
  ]);

  // Load activities on mount
  useEffect(() => {
    loadActivities();
  }, [home.id]);

  const loadActivities = async () => {
    try {
      setLoadingActivities(true);
      const [activities, counts] = await Promise.all([
        homeActivityService.getRecentActivities(home.id, 24),
        homeActivityService.getActivityCounts(home.id)
      ]);
      setRecentActivities(activities);
      setActivityCounts(counts);
    } catch (err) {
      // Don't show error for activities, just log it
      console.error('Error loading activities:', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  const handleLogout = async () => {
    const response = await useUser().signOut();
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

  const handleSecuritySettings = () => {
    navigation.navigate('SecuritySettings', { home });
  };

  const handleDeviceManagement = () => {
    navigation.navigate('DeviceManagement', { home });
  };

  const handleMemberManagement = () => {
    navigation.navigate('MemberManagement', { home });
  };

  const handleAccessLog = () => {
    Alert.alert('Access Log', 'Access log coming soon!');
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

  const DeviceCard = ({ device }: { device: Device }) => (
    <View className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
      isDark ? 'border-neutral-700' : 'border-neutral-200'
    }`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
            device.status === 'online' ? 'bg-success' : 'bg-error'
          }`}>
            <Ionicons 
              name={device.type === 'camera' ? 'videocam' : 
                    device.type === 'sensor' ? 'eye' : 
                    device.type === 'lock' ? 'lock-closed' : 'hardware-chip'} 
              size={20} 
              color="white" 
            />
          </View>
          <View>
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {device.name}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {device.location}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className={`text-sm font-medium ${
            device.status === 'online' ? 'text-success' : 'text-error'
          }`}>
            {device.status}
          </Text>
          {device.batteryLevel && (
            <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {device.batteryLevel}% battery
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <View className="flex-1">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mb-2"
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {home.name}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {home.address}
          </Text>
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
            title="Security Settings"
            status="Configure"
            icon="settings"
            color="bg-neutral-600"
            onPress={handleSecuritySettings}
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
              title="Devices"
              icon="hardware-chip"
              color="bg-primary-500"
              onPress={() => navigation.navigate('DeviceManagement', { home })}
            />
          </View>
          
          <View className="flex-row mb-4">
            <QuickActionButton
              title="Deadbolts"
              icon="lock-closed"
              color="bg-warning"
              onPress={() => navigation.navigate('DeadboltControl', { home })}
            />
            <QuickActionButton
              title="Face Recognition"
              icon="person"
              color="bg-purple-500"
              onPress={() => navigation.navigate('FaceDetection', { home })}
            />
          </View>
          
          <View className="flex-row mb-4">
            <QuickActionButton
              title="RFID Cards"
              icon="card"
              color="bg-red-500"
              onPress={() => navigation.navigate('RFIDManagement', { home })}
            />
            <QuickActionButton
              title="Access Logs"
              icon="document-text"
              color="bg-info"
              onPress={() => navigation.navigate('AccessLogs', { home })}
            />
          </View>
          
          <View className="flex-row">
            <QuickActionButton
              title="Member Management"
              icon="people"
              color="bg-purple-600"
              onPress={handleMemberManagement}
            />
            <QuickActionButton
              title="Security Settings"
              icon="settings"
              color="bg-neutral-600"
              onPress={handleSecuritySettings}
            />
          </View>
        </View>

        {/* Devices */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Devices ({devices.length})
          </Text>
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </View>

        {/* Recent Activities */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Recent Activities
            </Text>
            {activityCounts.unacknowledged > 0 && (
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                <Text className={`text-sm font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  {activityCounts.unacknowledged} unacknowledged
                </Text>
              </View>
            )}
          </View>
          
          {loadingActivities ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color={isDark ? '#3b82f6' : '#3b82f6'} />
              <Text className={`mt-2 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Loading activities...
              </Text>
            </View>
          ) : recentActivities.length > 0 ? (
            <View>
              {recentActivities.slice(0, 3).map((activity) => (
                <View key={activity.id} className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
                  isDark ? 'border-neutral-700' : 'border-neutral-200'
                }`}>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {activity.title}
                      </Text>
                      {activity.description && (
                        <Text className={`text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {activity.description}
                        </Text>
                      )}
                      <View className="flex-row items-center mt-2">
                        <View className={`px-2 py-1 rounded-full mr-2 ${
                          activity.priority === 'CRITICAL' ? 'bg-red-100' :
                          activity.priority === 'HIGH' ? 'bg-orange-100' :
                          activity.priority === 'MEDIUM' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <Text className={`text-xs font-medium ${
                            activity.priority === 'CRITICAL' ? 'text-red-800' :
                            activity.priority === 'HIGH' ? 'text-orange-800' :
                            activity.priority === 'MEDIUM' ? 'text-yellow-800' : 'text-green-800'
                          }`}>
                            {activity.priority}
                          </Text>
                        </View>
                        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          {new Date(activity.activityTimestamp).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    {!activity.isAcknowledged && (
                      <View className="w-2 h-2 bg-red-500 rounded-full ml-2" />
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={`p-6 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
              isDark ? 'border-neutral-700' : 'border-neutral-200'
            }`}>
              <View className="items-center">
                <Ionicons 
                  name="time-outline" 
                  size={32} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
                <Text className={`mt-2 text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  No recent activities
                </Text>
                <Text className={`text-xs text-center mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Activities will appear here when they occur
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeDashboardScreen;
