import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Home } from '../types/Home';
import { homeActivityService, HomeActivity, ActivityCounts } from '../services/HomeActivityService';

interface RecentActivitiesScreenProps {
  navigation: any;
  route: {
    params: {
      home: Home;
    };
  };
}

const RecentActivitiesScreen: React.FC<RecentActivitiesScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { home } = route.params;
  
  const [recentActivities, setRecentActivities] = useState<HomeActivity[]>([]);
  const [activityCounts, setActivityCounts] = useState<ActivityCounts>({ unacknowledged: 0, unresolved: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const [activities, counts] = await Promise.all([
        homeActivityService.getRecentActivities(home.id, 24),
        homeActivityService.getActivityCounts(home.id)
      ]);
      setRecentActivities(activities);
      setActivityCounts(counts);
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [home.id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      case 'HIGH':
        return { bg: 'bg-orange-100', text: 'text-orange-800' };
      case 'MEDIUM':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'LOW':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'PERSON_ADDED':
      case 'PERSON_REMOVED':
        return 'people';
      case 'DOOR_OPENED':
      case 'DOOR_CLOSED':
        return 'door';
      case 'ACCESS_GRANTED':
      case 'ACCESS_DENIED':
        return 'key';
      case 'MOTION_DETECTED':
        return 'eye';
      case 'ALARM_TRIGGERED':
        return 'warning';
      case 'USER_LOGIN':
      case 'USER_LOGOUT':
        return 'person';
      default:
        return 'time';
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color={isDark ? '#3b82f6' : '#3b82f6'} />
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
      <View className="flex-row justify-between items-center px-6 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          <View>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Recent Activities
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {home.name}
            </Text>
          </View>
        </View>
        
        {/* Activity Counts */}
        {(activityCounts.unacknowledged > 0 || activityCounts.unresolved > 0) && (
          <View className="flex-row items-center space-x-2">
            {activityCounts.unacknowledged > 0 && (
              <View className="flex-row items-center bg-red-100 px-2 py-1 rounded-full">
                <View className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                <Text className="text-xs font-medium text-red-800">
                  {activityCounts.unacknowledged}
                </Text>
              </View>
            )}
            {activityCounts.unresolved > 0 && (
              <View className="flex-row items-center bg-orange-100 px-2 py-1 rounded-full">
                <View className="w-2 h-2 bg-orange-500 rounded-full mr-1" />
                <Text className="text-xs font-medium text-orange-800">
                  {activityCounts.unresolved}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
          <Text className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Error Loading Activities
          </Text>
          <Text className={`mt-2 text-sm text-center ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => loadActivities()}
            className={`mt-4 px-6 py-3 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadActivities(true)}
              tintColor={isDark ? '#ffffff' : '#000000'}
            />
          }
        >
          {recentActivities.length > 0 ? (
            <View>
              {recentActivities.map((activity) => {
                const priorityColors = getPriorityColor(activity.priority);
                const iconName = getActivityIcon(activity.activityType);
                
                return (
                  <View key={activity.id} className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
                    isDark ? 'border-neutral-700' : 'border-neutral-200'
                  }`}>
                    <View className="flex-row items-start">
                      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                        isDark ? 'bg-neutral-700' : 'bg-neutral-100'
                      }`}>
                        <Ionicons 
                          name={iconName as any} 
                          size={20} 
                          color={isDark ? '#ffffff' : '#000000'} 
                        />
                      </View>
                      
                      <View className="flex-1">
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
                          </View>
                          {!activity.isAcknowledged && (
                            <View className="w-2 h-2 bg-red-500 rounded-full ml-2" />
                          )}
                        </View>
                        
                        <View className="flex-row items-center justify-between mt-3">
                          <View className="flex-row items-center">
                            <View className={`px-2 py-1 rounded-full mr-2 ${priorityColors.bg}`}>
                              <Text className={`text-xs font-medium ${priorityColors.text}`}>
                                {activity.priority}
                              </Text>
                            </View>
                            {activity.location && (
                              <View className="flex-row items-center">
                                <Ionicons 
                                  name="location-outline" 
                                  size={12} 
                                  color={isDark ? '#a3a3a3' : '#737373'} 
                                />
                                <Text className={`text-xs ml-1 ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                                  {activity.location}
                                </Text>
                              </View>
                            )}
                          </View>
                          
                          <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                            {new Date(activity.activityTimestamp).toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View className={`p-6 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
              isDark ? 'border-neutral-700' : 'border-neutral-200'
            }`}>
              <View className="items-center">
                <Ionicons 
                  name="time-outline" 
                  size={48} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
                <Text className={`mt-4 text-lg font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  No Recent Activities
                </Text>
                <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Activities will appear here when they occur in your home
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default RecentActivitiesScreen;
