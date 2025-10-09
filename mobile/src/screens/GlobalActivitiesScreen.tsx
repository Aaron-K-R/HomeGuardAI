import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator,
  RefreshControl,
  Modal,
  AppState
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Home } from '../types/Home';
import { homeService, HomeResponse } from '../services/HomeService';
import { homeActivityService, HomeActivity } from '../services/HomeActivityService';

interface GlobalActivitiesScreenProps {
  navigation: any;
}

const GlobalActivitiesScreen: React.FC<GlobalActivitiesScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  
  const [homes, setHomes] = useState<Home[]>([]);
  const [globalActivities, setGlobalActivities] = useState<HomeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<HomeActivity | null>(null);
  const [lastActivityFetch, setLastActivityFetch] = useState<number>(0);

  // Convert API response to Home type
  const convertApiResponseToHome = useCallback((apiHome: HomeResponse): Home => {
    return {
      id: apiHome.id,
      name: apiHome.name,
      address: apiHome.fullAddress || apiHome.address,
      isActive: apiHome.isActive,
      isArmed: false,
      lastActivity: 'Just now',
      deviceCount: apiHome.deviceCount || 0,
      cameraCount: 0,
      accessCount: 0,
      securityLevel: apiHome.securitySystemType === 'premium' ? 'high' : 
                    apiHome.securitySystemType === 'basic' ? 'low' : 'medium',
      timezone: 'America/New_York',
      createdAt: apiHome.createdAt,
      updatedAt: apiHome.updatedAt
    };
  }, []);

  const loadHomes = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const apiHomes = await homeService.getHomesByOwnerId(user.id);
      const convertedHomes = apiHomes.map(convertApiResponseToHome);
      setHomes(convertedHomes);
      return convertedHomes;
    } catch (err) {
      console.error('Error loading homes:', err);
      throw err;
    }
  }, [user?.id, convertApiResponseToHome]);

  const loadActivities = useCallback(async (isRefresh = false) => {
    if (!user?.id) return;
    
    // Throttle API calls - only fetch if it's been more than 10 seconds since last fetch
    const now = Date.now();
    if (!isRefresh && now - lastActivityFetch < 10000) {
      return;
    }
    
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Load homes first, then activities
      const homesData = await loadHomes();
      if (homesData.length > 0) {
        const homeIds = homesData.map(home => home.id);
        const activities = await homeActivityService.getGlobalRecentActivities(homeIds); // All activities
        setGlobalActivities(activities);
        setLastActivityFetch(now);
      }
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, loadHomes, lastActivityFetch]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Auto-refresh activities every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadActivities(true); // Force refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [loadActivities]);

  // Refresh activities when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        loadActivities(true); // Force refresh
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [loadActivities]);

  // Refresh activities when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadActivities(true); // Force refresh
    });

    return unsubscribe;
  }, [navigation, loadActivities]);

  const handleRefresh = () => {
    loadActivities(true);
  };

  const handleActivityClick = async (activity: HomeActivity) => {
    if (!user?.id) return;
    
    try {
      // If the activity is not acknowledged, acknowledge it first
      if (!activity.isAcknowledged) {
        await homeActivityService.acknowledgeActivity(activity.id, user.id);
        // Refresh activities to show updated status
        loadActivities();
      }
      
      // Show activity detail modal
      setSelectedActivity(activity);
      setShowActivityDetailModal(true);
    } catch (error) {
      console.error('Error acknowledging activity:', error);
      // Still show modal even if acknowledgment fails
      setSelectedActivity(activity);
      setShowActivityDetailModal(true);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'CRITICAL': return isDark ? '#ef4444' : '#dc2626';
      case 'HIGH': return isDark ? '#f59e0b' : '#d97706';
      case 'MEDIUM': return isDark ? '#3b82f6' : '#2563eb';
      case 'LOW': return isDark ? '#10b981' : '#059669';
      default: return isDark ? '#6b7280' : '#6b7280';
    }
  };

  const getTypeIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'door_access':
      case 'door_request': return 'key';
      case 'face_detection':
      case 'face_recognition': return 'person';
      case 'rfid_scan':
      case 'rfid_access': return 'card';
      case 'system_alert':
      case 'security_alert': return 'warning';
      case 'device_offline':
      case 'device_status': return 'hardware-chip';
      case 'motion_detected': return 'eye';
      case 'door_open': return 'lock-open';
      case 'call': return 'call';
      case 'emergency': return 'alert-circle';
      case 'maintenance': return 'construct';
      default: return 'information-circle';
    }
  };


  const formatActivityTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDark ? '#3b82f6' : '#2563eb'} />
          <Text className={`mt-4 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Loading activities...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View className="px-6 py-4 border-b border-neutral-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              All Activities
            </Text>
            {globalActivities.filter(activity => !activity.isAcknowledged).length > 0 && (
              <View className={`ml-3 px-2 py-1 rounded-full ${
                isDark ? 'bg-red-600' : 'bg-red-500'
              }`}>
                <Text className="text-white text-xs font-semibold">
                  {globalActivities.filter(activity => !activity.isAcknowledged).length} new
                </Text>
              </View>
            )}
          </View>
          <View className="w-8" />
        </View>
        <Text className={`text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Activities from all your homes
        </Text>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#3b82f6' : '#2563eb'}
          />
        }
      >
        {error ? (
          <View className="items-center py-8">
            <Ionicons 
              name="alert-circle" 
              size={48} 
              color={isDark ? '#ef4444' : '#dc2626'} 
            />
            <Text className={`text-lg font-semibold mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Error Loading Activities
            </Text>
            <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {error}
            </Text>
            <TouchableOpacity 
              className={`mt-4 px-6 py-3 rounded-xl ${
                isDark ? 'bg-primary-600' : 'bg-primary-500'
              }`}
              onPress={() => loadActivities()}
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : globalActivities.length === 0 ? (
          <View className="items-center py-12">
            <Ionicons 
              name="time-outline" 
              size={64} 
              color={isDark ? '#a3a3a3' : '#737373'} 
            />
            <Text className={`text-lg font-semibold mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              No Activities Yet
            </Text>
            <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Activities from all your homes will appear here
            </Text>
          </View>
        ) : (
          <View className="py-4">
            {globalActivities.map(activity => {
              const home = homes.find(h => h.id === activity.homeId);
              const homeName = home?.name || 'Unknown Home';
              
              return (
                <TouchableOpacity
                  key={activity.id}
                  className={`p-4 rounded-xl mb-3 ${
                    isDark ? 'bg-neutral-800' : 'bg-white'
                  } border ${
                    isDark ? 'border-neutral-700' : 'border-neutral-200'
                  }`}
                  onPress={() => handleActivityClick(activity)}
                >
                  <View className="flex-row items-start">
                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3`} 
                          style={{ backgroundColor: getPriorityColor(activity.priority) }}>
                      <Ionicons 
                        name={getTypeIcon(activity.activityType) as any} 
                        size={20} 
                        color="white" 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-semibold text-base ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {activity.title}
                      </Text>
                      {activity.description && (
                        <Text className={`text-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {activity.description}
                        </Text>
                      )}
                      <Text className={`text-xs mt-2 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        {homeName} • {formatActivityTimestamp(activity.activityTimestamp)}
                      </Text>
                    </View>
                    <View className="relative">
                      {!activity.isAcknowledged && (
                        <View className="w-3 h-3 bg-red-500 rounded-full" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
            )}
          </ScrollView>

          {/* Activity Detail Modal */}
          <Modal
            visible={showActivityDetailModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowActivityDetailModal(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6 max-h-96`}>
                <View className="flex-row justify-between items-center mb-6">
                  <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Activity Details
                  </Text>
                  <TouchableOpacity onPress={() => setShowActivityDetailModal(false)}>
                    <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
                  </TouchableOpacity>
                </View>
                
                {selectedActivity && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <View className={`p-4 rounded-xl mb-4 ${
                      isDark ? 'bg-neutral-700' : 'bg-neutral-100'
                    }`}>
                      <View className="flex-row items-start mb-4">
                        <View className={`w-12 h-12 rounded-full items-center justify-center mr-4`} 
                              style={{ backgroundColor: getPriorityColor(selectedActivity.priority) }}>
                          <Ionicons 
                            name={getTypeIcon(selectedActivity.activityType) as any} 
                            size={24} 
                            color="white" 
                          />
                        </View>
                        <View className="flex-1">
                          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            {selectedActivity.title}
                          </Text>
                          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {selectedActivity.activityType.replace('_', ' ').toUpperCase()}
                          </Text>
                        </View>
                        <View className={`px-3 py-1 rounded-full ${
                          selectedActivity.priority === 'CRITICAL' 
                            ? (isDark ? 'bg-red-600' : 'bg-red-500')
                            : selectedActivity.priority === 'HIGH'
                            ? (isDark ? 'bg-orange-600' : 'bg-orange-500')
                            : selectedActivity.priority === 'MEDIUM'
                            ? (isDark ? 'bg-blue-600' : 'bg-blue-500')
                            : (isDark ? 'bg-green-600' : 'bg-green-500')
                        }`}>
                          <Text className="text-white text-xs font-semibold">
                            {selectedActivity.priority}
                          </Text>
                        </View>
                      </View>

                      {selectedActivity.description && (
                        <View className="mb-4">
                          <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                            Description
                          </Text>
                          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {selectedActivity.description}
                          </Text>
                        </View>
                      )}

                      <View className="mb-4">
                        <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          Home
                        </Text>
                        <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {homes.find(h => h.id === selectedActivity.homeId)?.name || 'Unknown Home'}
                        </Text>
                      </View>

                      <View className="mb-4">
                        <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          Timestamp
                        </Text>
                        <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {formatActivityTimestamp(selectedActivity.activityTimestamp)}
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          {new Date(selectedActivity.activityTimestamp).toLocaleString()}
                        </Text>
                      </View>

                      <View className="mb-4">
                        <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          Status
                        </Text>
                        <View className="flex-row items-center">
                          <View className={`w-3 h-3 rounded-full mr-2 ${
                            selectedActivity.isAcknowledged ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {selectedActivity.isAcknowledged ? 'Acknowledged' : 'Unacknowledged'}
                          </Text>
                        </View>
                        {selectedActivity.isResolved && (
                          <View className="flex-row items-center mt-1">
                            <View className="w-3 h-3 rounded-full mr-2 bg-blue-500" />
                            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              Resolved
                            </Text>
                          </View>
                        )}
                      </View>

                      {selectedActivity.additionalData && (
                        <View className="mb-4">
                          <Text className={`text-sm font-semibold mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                            Additional Information
                          </Text>
                          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {selectedActivity.additionalData}
                          </Text>
                        </View>
                      )}

                      <View className="flex-row justify-between mt-6">
                        <TouchableOpacity 
                          className={`flex-1 py-3 px-4 rounded-xl mr-2 ${
                            isDark ? 'bg-neutral-600' : 'bg-neutral-200'
                          }`}
                          onPress={() => {
                            const home = homes.find(h => h.id === selectedActivity.homeId);
                            if (home) {
                              setShowActivityDetailModal(false);
                              navigation.navigate('RecentActivities', { home });
                            }
                          }}
                        >
                          <Text className={`text-center font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                            View All Activities
                          </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          className={`flex-1 py-3 px-4 rounded-xl ml-2 ${
                            isDark ? 'bg-primary-600' : 'bg-primary-500'
                          }`}
                          onPress={() => setShowActivityDetailModal(false)}
                        >
                          <Text className="text-center font-semibold text-white">
                            Close
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      );
    };

    export default GlobalActivitiesScreen;
