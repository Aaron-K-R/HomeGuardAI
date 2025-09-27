import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Home } from '../types/Home';
import { homeService, HomeResponse } from '../services/HomeService';

interface HomeSelectionScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const HomeSelectionScreen: React.FC<HomeSelectionScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  
  // State for homes data
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllHomes, setShowAllHomes] = useState(false);
  const [hasMoreHomes, setHasMoreHomes] = useState(false);
  
  // Pagination settings
  const HOMES_PER_PAGE = 3;
  const [displayedHomes, setDisplayedHomes] = useState<Home[]>([]);

  // Global Activity and Queued Requests
  interface GlobalActivity {
    id: string;
    timestamp: string;
    type: 'door_request' | 'face_detection' | 'rfid_scan' | 'system_alert' | 'device_offline';
    title: string;
    description: string;
    homeName: string;
    status: 'pending' | 'approved' | 'denied' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }

  interface QueuedRequest {
    id: string;
    timestamp: string;
    type: 'door_open' | 'call' | 'emergency' | 'maintenance';
    personName: string;
    homeName: string;
    location: string;
    message?: string;
    status: 'pending' | 'approved' | 'denied';
  }

  const [globalActivities] = useState<GlobalActivity[]>([
    {
      id: '1',
      timestamp: '2 minutes ago',
      type: 'door_request',
      title: 'Door Access Request',
      description: 'John Doe requesting access at Main Residence front door',
      homeName: 'Main Residence',
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      timestamp: '5 minutes ago',
      type: 'face_detection',
      title: 'Face Recognition',
      description: 'Unknown person detected at Beach House',
      homeName: 'Beach House',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '3',
      timestamp: '10 minutes ago',
      type: 'device_offline',
      title: 'Device Offline',
      description: 'Garage door sensor offline at Mountain Cabin',
      homeName: 'Mountain Cabin',
      status: 'completed',
      priority: 'low'
    }
  ]);

  const [queuedRequests] = useState<QueuedRequest[]>([
    {
      id: '1',
      timestamp: '1 minute ago',
      type: 'door_open',
      personName: 'John Doe',
      homeName: 'Main Residence',
      location: 'Front Door',
      message: 'Requesting access to front door',
      status: 'pending'
    },
    {
      id: '2',
      timestamp: '3 minutes ago',
      type: 'call',
      personName: 'Jane Smith',
      homeName: 'Beach House',
      location: 'Intercom',
      message: 'Video call from front gate',
      status: 'pending'
    },
    {
      id: '3',
      timestamp: '5 minutes ago',
      type: 'maintenance',
      personName: 'Maintenance Team',
      homeName: 'Main Residence',
      location: 'Service Entrance',
      message: 'Scheduled maintenance access',
      status: 'approved'
    }
  ]);

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

  // Convert API response to Home type
  const convertApiResponseToHome = useCallback((apiHome: HomeResponse): Home => {
    return {
      id: apiHome.id,
      name: apiHome.name,
      address: apiHome.fullAddress || apiHome.address,
      isActive: apiHome.isActive,
      isArmed: false, // This would come from security settings
      lastActivity: 'Just now', // This would come from activity logs
      deviceCount: apiHome.deviceCount || 0,
      cameraCount: 0, // This would come from device count by type
      accessCount: 0, // This would come from access logs
      securityLevel: apiHome.securitySystemType === 'premium' ? 'high' : 
                    apiHome.securitySystemType === 'basic' ? 'low' : 'medium',
      timezone: 'America/New_York', // Default timezone
      createdAt: apiHome.createdAt,
      updatedAt: apiHome.updatedAt
    };
  }, []);

  // Load homes from API
  const loadHomes = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const apiHomes = await homeService.getHomesByOwnerId(user.id);
      const convertedHomes = apiHomes.map(convertApiResponseToHome);
      
      setHomes(convertedHomes);
      
      // Set up pagination
      const initialHomes = convertedHomes.slice(0, HOMES_PER_PAGE);
      setDisplayedHomes(initialHomes);
      setHasMoreHomes(convertedHomes.length > HOMES_PER_PAGE);
      
    } catch (err) {
      console.error('Error loading homes:', err);
      setError('Failed to load homes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, convertApiResponseToHome]);

  // Load homes on component mount
  useEffect(() => {
    loadHomes();
  }, [loadHomes]);

  // Handle "See More" functionality
  const handleSeeMore = useCallback(() => {
    if (showAllHomes) {
      // Show only first few homes
      const limitedHomes = homes.slice(0, HOMES_PER_PAGE);
      setDisplayedHomes(limitedHomes);
      setShowAllHomes(false);
    } else {
      // Show all homes
      setDisplayedHomes(homes);
      setShowAllHomes(true);
    }
  }, [homes, showAllHomes]);

  const handleHomeSelect = (home: Home) => {
    navigation.navigate('HomeDashboard', { home });
  };

  const handleAddHome = () => {
    navigation.navigate('HomeManagement');
  };

  const handleHomeSettings = (home: Home) => {
    navigation.navigate('SecuritySettings', { home });
  };

  const handleRequestAction = (requestId: string, action: 'approve' | 'deny') => {
    Alert.alert(
      action === 'approve' ? 'Approve Request' : 'Deny Request',
      `Are you sure you want to ${action} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action === 'approve' ? 'Approve' : 'Deny', 
          style: action === 'approve' ? 'default' : 'destructive',
          onPress: () => {
            // Handle request approval/denial
            Alert.alert('Success', `Request ${action}d successfully`);
          }
        }
      ]
    );
  };

  const handleActivityAction = (activityId: string, action: 'acknowledge' | 'dismiss' | 'investigate') => {
    const actionText = action === 'acknowledge' ? 'acknowledge' : 
                     action === 'dismiss' ? 'dismiss' : 'investigate';
    
    Alert.alert(
      `Activity ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
      `Are you sure you want to ${actionText} this activity?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: actionText.charAt(0).toUpperCase() + actionText.slice(1), 
          style: 'default',
          onPress: () => {
            Alert.alert('Success', `Activity ${actionText}d successfully`);
          }
        }
      ]
    );
  };

  const toggleActivityExpansion = (activityId: string) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  const toggleRequestExpansion = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return isDark ? '#ef4444' : '#dc2626';
      case 'high': return isDark ? '#f59e0b' : '#d97706';
      case 'medium': return isDark ? '#3b82f6' : '#2563eb';
      case 'low': return isDark ? '#10b981' : '#059669';
      default: return isDark ? '#6b7280' : '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'door_request': return 'door-open';
      case 'face_detection': return 'person';
      case 'rfid_scan': return 'card';
      case 'system_alert': return 'warning';
      case 'device_offline': return 'hardware-chip';
      case 'door_open': return 'lock-open';
      case 'call': return 'call';
      case 'emergency': return 'alert-circle';
      case 'maintenance': return 'construct';
      default: return 'information-circle';
    }
  };


  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-error';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-neutral-500';
    }
  };

  const getSecurityLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'High Security';
      case 'medium': return 'Medium Security';
      case 'low': return 'Low Security';
      default: return 'Unknown';
    }
  };

  const HomeCard = ({ home }: { home: Home }) => (
    <TouchableOpacity
      className={`p-6 rounded-xl mb-4 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
        isDark ? 'border-neutral-700' : 'border-neutral-200'
      }`}
      onPress={() => handleHomeSelect(home)}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {home.name}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'} mt-1`}>
            {home.address}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleHomeSettings(home)}
          className="p-2"
        >
          <Ionicons 
            name="settings-outline" 
            size={20} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <View className={`w-3 h-3 rounded-full mr-2 ${
            home.isActive ? 'bg-success' : 'bg-neutral-400'
          }`} />
          <Text className={`text-sm font-medium ${
            home.isActive ? 'text-success' : 'text-neutral-500'
          }`}>
            {home.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons 
            name={home.isArmed ? 'shield-checkmark' : 'shield-outline'} 
            size={16} 
            color={home.isArmed ? '#10b981' : '#a3a3a3'} 
          />
          <Text className={`text-sm ml-1 ${
            home.isArmed ? 'text-success' : 'text-neutral-500'
          }`}>
            {home.isArmed ? 'Armed' : 'Disarmed'}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Ionicons name="videocam" size={16} color="#3b82f6" />
          <Text className={`text-sm ml-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {home.cameraCount} cameras
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="hardware-chip" size={16} color="#3b82f6" />
          <Text className={`text-sm ml-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {home.deviceCount} devices
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <View className={`px-3 py-1 rounded-full ${getSecurityLevelColor(home.securityLevel)}`}>
          <Text className="text-white text-xs font-semibold">
            {getSecurityLevelText(home.securityLevel)}
          </Text>
        </View>
        
        <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          Last activity: {home.lastActivity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1">
            <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              My Homes
            </Text>
            <Text className={`text-base ${isDark ? 'text-neutral-400' : 'text-neutral-600'} mt-1`}>
              Select a home to manage security
            </Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity 
              onPress={() => navigation.navigate('HomeManagement')}
              className="mr-4"
            >
              <Ionicons 
                name="home-outline" 
                size={24} 
                color={isDark ? '#ffffff' : '#000000'} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AppSettings')}>
              <Ionicons 
                name="settings-outline" 
                size={24} 
                color={isDark ? '#ffffff' : '#000000'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Quick Actions
          </Text>
          
          <View className="flex-row justify-between mb-3">
            <TouchableOpacity 
              className={`flex-1 p-4 rounded-xl mr-2 ${
                isDark ? 'bg-neutral-800' : 'bg-white'
              }`}
              onPress={() => setShowActivityModal(true)}
            >
              <Ionicons 
                name="pulse" 
                size={24} 
                color={isDark ? '#3b82f6' : '#2563eb'} 
              />
              <Text className={`text-sm font-medium mt-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Global Activity
              </Text>
              <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {globalActivities.length} events
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 p-4 rounded-xl ml-2 ${
                isDark ? 'bg-neutral-800' : 'bg-white'
              }`}
              onPress={() => setShowRequestsModal(true)}
            >
              <Ionicons 
                name="list" 
                size={24} 
                color={isDark ? '#10b981' : '#059669'} 
              />
              <Text className={`text-sm font-medium mt-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Queued Requests
              </Text>
              <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {queuedRequests.filter(r => r.status === 'pending').length} pending
              </Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-between">
            <TouchableOpacity 
              className={`flex-1 p-4 rounded-xl mr-2 ${
                isDark ? 'bg-neutral-800' : 'bg-white'
              }`}
              onPress={() => Alert.alert('Emergency', 'Emergency features coming soon!')}
            >
              <Ionicons 
                name="alert-circle" 
                size={24} 
                color={isDark ? '#ef4444' : '#dc2626'} 
              />
              <Text className={`text-sm font-medium mt-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Emergency
              </Text>
              <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Quick access
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 p-4 rounded-xl ml-2 ${
                isDark ? 'bg-neutral-800' : 'bg-white'
              }`}
              onPress={() => Alert.alert('All Homes', 'Global home management coming soon!')}
            >
              <Ionicons 
                name="home" 
                size={24} 
                color={isDark ? '#8b5cf6' : '#7c3aed'} 
              />
              <Text className={`text-sm font-medium mt-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                All Homes
              </Text>
              <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Global control
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity Summary */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => setShowActivityModal(true)}>
              <Text className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {globalActivities.slice(0, 2).map(activity => (
            <View key={activity.id} className={`p-4 rounded-xl mb-3 ${
              isDark ? 'bg-neutral-800' : 'bg-white'
            }`}>
              <TouchableOpacity 
                onPress={() => toggleActivityExpansion(activity.id)}
                className="flex-row items-start"
              >
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-3`} 
                      style={{ backgroundColor: getPriorityColor(activity.priority) }}>
                  <Ionicons 
                    name={getTypeIcon(activity.type) as any} 
                    size={16} 
                    color="white" 
                  />
                </View>
                <View className="flex-1">
                  <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {activity.title}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {activity.description}
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    {activity.homeName} • {activity.timestamp}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className={`px-2 py-1 rounded-full mr-2 ${
                    activity.status === 'pending' 
                      ? (isDark ? 'bg-yellow-600' : 'bg-yellow-500')
                      : activity.status === 'completed'
                      ? (isDark ? 'bg-green-600' : 'bg-green-500')
                      : (isDark ? 'bg-neutral-600' : 'bg-neutral-300')
                  }`}>
                    <Text className="text-xs font-medium text-white">
                      {activity.status}
                    </Text>
                  </View>
                  <Ionicons 
                    name={expandedActivity === activity.id ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={isDark ? '#a3a3a3' : '#737373'} 
                  />
                </View>
              </TouchableOpacity>
              
              {/* Expanded Activity Actions */}
              {expandedActivity === activity.id && (
                <View className="mt-4 pt-4 border-t border-neutral-600">
                  <View className="flex-row justify-between mb-3">
                    <Text className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Actions
                    </Text>
                    <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      Priority: {activity.priority}
                    </Text>
                  </View>
                  
                  <View>
                    <TouchableOpacity 
                      className={`w-full py-4 px-6 rounded-2xl mb-4 ${
                        isDark ? 'bg-blue-600' : 'bg-blue-500'
                      }`}
                      onPress={() => handleActivityAction(activity.id, 'acknowledge')}
                      style={{ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                    >
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="checkmark-circle" size={20} color="white" />
                        <Text className="text-white text-base font-semibold ml-3">
                          Acknowledge
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      className={`w-full py-4 px-6 rounded-2xl mb-4 ${
                        isDark ? 'bg-orange-600' : 'bg-orange-500'
                      }`}
                      onPress={() => handleActivityAction(activity.id, 'investigate')}
                      style={{ shadowColor: '#f59e0b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                    >
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="search" size={20} color="white" />
                        <Text className="text-white text-base font-semibold ml-3">
                          Investigate
                        </Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      className={`w-full py-4 px-6 rounded-2xl ${
                        isDark ? 'bg-neutral-600' : 'bg-neutral-500'
                      }`}
                      onPress={() => handleActivityAction(activity.id, 'dismiss')}
                      style={{ shadowColor: '#6b7280', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                    >
                      <View className="flex-row items-center justify-center">
                        <Ionicons name="close-circle" size={20} color="white" />
                        <Text className="text-white text-base font-semibold ml-3">
                          Dismiss
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Queued Requests Summary */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Queued Requests
            </Text>
            <TouchableOpacity onPress={() => setShowRequestsModal(true)}>
              <Text className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          
          {queuedRequests.slice(0, 2).map(request => (
            <View key={request.id} className={`p-4 rounded-xl mb-3 ${
              isDark ? 'bg-neutral-800' : 'bg-white'
            }`}>
              <TouchableOpacity 
                onPress={() => toggleRequestExpansion(request.id)}
                className="flex-row items-start"
              >
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                  isDark ? 'bg-primary-600' : 'bg-primary-500'
                }`}>
                  <Ionicons 
                    name={getTypeIcon(request.type) as any} 
                    size={16} 
                    color="white" 
                  />
                </View>
                <View className="flex-1">
                  <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {request.personName}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {request.type.charAt(0).toUpperCase() + request.type.slice(1)} at {request.location}
                  </Text>
                  {request.message && (
                    <Text className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      "{request.message}"
                    </Text>
                  )}
                  <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                    {request.homeName} • {request.timestamp}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className={`px-2 py-1 rounded-full mr-2 ${
                    request.status === 'pending' 
                      ? (isDark ? 'bg-yellow-600' : 'bg-yellow-500')
                      : request.status === 'approved'
                      ? (isDark ? 'bg-green-600' : 'bg-green-500')
                      : (isDark ? 'bg-red-600' : 'bg-red-500')
                  }`}>
                    <Text className="text-xs font-medium text-white">
                      {request.status}
                    </Text>
                  </View>
                  <Ionicons 
                    name={expandedRequest === request.id ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={isDark ? '#a3a3a3' : '#737373'} 
                  />
                </View>
              </TouchableOpacity>
              
              {/* Expanded Request Actions */}
              {expandedRequest === request.id && (
                <View className="mt-4 pt-4 border-t border-neutral-600">
                  <View className="flex-row justify-between mb-3">
                    <Text className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      Actions
                    </Text>
                    <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      {request.type.toUpperCase()}
                    </Text>
                  </View>
                  
                  {request.status === 'pending' ? (
                    <View>
                      <TouchableOpacity 
                        className={`w-full py-4 px-6 rounded-2xl mb-4 ${
                          isDark ? 'bg-green-600' : 'bg-green-500'
                        }`}
                        onPress={() => handleRequestAction(request.id, 'approve')}
                        style={{ shadowColor: '#10b981', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                      >
                        <View className="flex-row items-center justify-center">
                          <Ionicons name="checkmark-circle" size={20} color="white" />
                          <Text className="text-white text-base font-semibold ml-3">
                            Approve
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        className={`w-full py-4 px-6 rounded-2xl ${
                          isDark ? 'bg-red-600' : 'bg-red-500'
                        }`}
                        onPress={() => handleRequestAction(request.id, 'deny')}
                        style={{ shadowColor: '#ef4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                      >
                        <View className="flex-row items-center justify-center">
                          <Ionicons name="close-circle" size={20} color="white" />
                          <Text className="text-white text-base font-semibold ml-3">
                            Deny
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="flex-row items-center justify-center py-2">
                      <View className={`px-3 py-1 rounded-full ${
                        request.status === 'approved' 
                          ? (isDark ? 'bg-green-600' : 'bg-green-500')
                          : (isDark ? 'bg-red-600' : 'bg-red-500')
                      }`}>
                        <Text className="text-white text-xs font-medium">
                          {request.status === 'approved' ? '✓ Approved' : '✗ Denied'}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Homes List */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              My Homes
            </Text>
            {hasMoreHomes && (
              <TouchableOpacity onPress={handleSeeMore}>
                <Text className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                  {showAllHomes ? 'Show Less' : 'See More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator 
                size="large" 
                color={isDark ? '#3b82f6' : '#2563eb'} 
              />
              <Text className={`text-sm mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Loading homes...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center py-8">
              <Ionicons 
                name="alert-circle" 
                size={48} 
                color={isDark ? '#ef4444' : '#dc2626'} 
              />
              <Text className={`text-lg font-semibold mt-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Error Loading Homes
              </Text>
              <Text className={`text-sm text-center mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {error}
              </Text>
              <TouchableOpacity 
                className={`mt-4 px-4 py-2 rounded-lg ${
                  isDark ? 'bg-primary-600' : 'bg-primary-500'
                }`}
                onPress={loadHomes}
              >
                <Text className="text-white font-medium">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : displayedHomes.length === 0 ? (
            <View className="items-center py-8">
              <Ionicons 
                name="home-outline" 
                size={48} 
                color={isDark ? '#a3a3a3' : '#737373'} 
              />
              <Text className={`text-lg font-semibold mt-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                No Homes Yet
              </Text>
              <Text className={`text-sm text-center mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Add your first home to get started
              </Text>
            </View>
          ) : (
            displayedHomes.map(home => (
              <HomeCard key={home.id} home={home} />
            ))
          )}
        </View>

        {/* Add Home Button */}
        <TouchableOpacity
          className={`p-6 rounded-xl border-2 border-dashed ${
            isDark ? 'border-neutral-600' : 'border-neutral-300'
          } items-center mb-6`}
          onPress={handleAddHome}
        >
          <Ionicons 
            name="add-circle-outline" 
            size={32} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
          <Text className={`text-lg font-semibold mt-2 ${
            isDark ? 'text-neutral-300' : 'text-neutral-600'
          }`}>
            Add New Home
          </Text>
          <Text className={`text-sm text-center mt-1 ${
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          }`}>
            Set up security for another property
          </Text>
        </TouchableOpacity>

        {/* Quick Stats */}
        {!isLoading && !error && homes.length > 0 && (
          <View className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
            isDark ? 'border-neutral-700' : 'border-neutral-200'
          }`}>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Overview
            </Text>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {homes.length}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Total Homes
                </Text>
              </View>
              
              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {homes.filter(h => h.isActive).length}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Active
                </Text>
              </View>
              
              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  {homes.filter(h => h.isArmed).length}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Armed
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Global Activity Modal */}
      <Modal
        visible={showActivityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowActivityModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6 max-h-96`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Global Activity
              </Text>
              <TouchableOpacity onPress={() => setShowActivityModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {globalActivities.map(activity => (
                <View key={activity.id} className={`p-4 rounded-xl mb-3 ${
                  isDark ? 'bg-neutral-700' : 'bg-neutral-100'
                }`}>
                  <TouchableOpacity 
                    onPress={() => toggleActivityExpansion(activity.id)}
                    className="flex-row items-start"
                  >
                    <View className={`w-8 h-8 rounded-full items-center justify-center mr-3`} 
                          style={{ backgroundColor: getPriorityColor(activity.priority) }}>
                      <Ionicons 
                        name={getTypeIcon(activity.type) as any} 
                        size={16} 
                        color="white" 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {activity.title}
                      </Text>
                      <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {activity.description}
                      </Text>
                      <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        {activity.homeName} • {activity.timestamp}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className={`px-2 py-1 rounded-full mr-2 ${
                        activity.status === 'pending' 
                          ? (isDark ? 'bg-yellow-600' : 'bg-yellow-500')
                          : activity.status === 'completed'
                          ? (isDark ? 'bg-green-600' : 'bg-green-500')
                          : (isDark ? 'bg-neutral-600' : 'bg-neutral-300')
                      }`}>
                        <Text className="text-xs font-medium text-white">
                          {activity.status}
                        </Text>
                      </View>
                      <Ionicons 
                        name={expandedActivity === activity.id ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color={isDark ? '#a3a3a3' : '#737373'} 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {/* Expanded Activity Actions in Modal */}
                  {expandedActivity === activity.id && (
                    <View className="mt-4 pt-4 border-t border-neutral-600">
                      <View className="flex-row justify-between mb-3">
                        <Text className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          Actions
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          Priority: {activity.priority}
                        </Text>
                      </View>
                      
                      <View>
                        <TouchableOpacity 
                          className={`w-full py-4 px-6 rounded-2xl mb-4 ${
                            isDark ? 'bg-blue-600' : 'bg-blue-500'
                          }`}
                          onPress={() => handleActivityAction(activity.id, 'acknowledge')}
                          style={{ shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                        >
                          <View className="flex-row items-center justify-center">
                            <Ionicons name="checkmark-circle" size={20} color="white" />
                            <Text className="text-white text-base font-semibold ml-3">
                              Acknowledge
                            </Text>
                          </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          className={`w-full py-4 px-6 rounded-2xl mb-4 ${
                            isDark ? 'bg-orange-600' : 'bg-orange-500'
                          }`}
                          onPress={() => handleActivityAction(activity.id, 'investigate')}
                          style={{ shadowColor: '#f59e0b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                        >
                          <View className="flex-row items-center justify-center">
                            <Ionicons name="search" size={20} color="white" />
                            <Text className="text-white text-base font-semibold ml-3">
                              Investigate
                            </Text>
                          </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          className={`w-full py-4 px-6 rounded-2xl ${
                            isDark ? 'bg-neutral-600' : 'bg-neutral-500'
                          }`}
                          onPress={() => handleActivityAction(activity.id, 'dismiss')}
                          style={{ shadowColor: '#6b7280', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                        >
                          <View className="flex-row items-center justify-center">
                            <Ionicons name="close-circle" size={20} color="white" />
                            <Text className="text-white text-base font-semibold ml-3">
                              Dismiss
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Queued Requests Modal */}
      <Modal
        visible={showRequestsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRequestsModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6 max-h-96`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Queued Requests
              </Text>
              <TouchableOpacity onPress={() => setShowRequestsModal(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {queuedRequests.map(request => (
                <View key={request.id} className={`p-4 rounded-xl mb-3 ${
                  isDark ? 'bg-neutral-700' : 'bg-neutral-100'
                }`}>
                  <TouchableOpacity 
                    onPress={() => toggleRequestExpansion(request.id)}
                    className="flex-row items-start"
                  >
                    <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                      isDark ? 'bg-primary-600' : 'bg-primary-500'
                    }`}>
                      <Ionicons 
                        name={getTypeIcon(request.type) as any} 
                        size={16} 
                        color="white" 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {request.personName}
                      </Text>
                      <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)} at {request.location}
                      </Text>
                      {request.message && (
                        <Text className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          "{request.message}"
                        </Text>
                      )}
                      <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                        {request.homeName} • {request.timestamp}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className={`px-2 py-1 rounded-full mr-2 ${
                        request.status === 'pending' 
                          ? (isDark ? 'bg-yellow-600' : 'bg-yellow-500')
                          : request.status === 'approved'
                          ? (isDark ? 'bg-green-600' : 'bg-green-500')
                          : (isDark ? 'bg-red-600' : 'bg-red-500')
                      }`}>
                        <Text className="text-xs font-medium text-white">
                          {request.status}
                        </Text>
                      </View>
                      <Ionicons 
                        name={expandedRequest === request.id ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color={isDark ? '#a3a3a3' : '#737373'} 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {/* Expanded Request Actions in Modal */}
                  {expandedRequest === request.id && (
                    <View className="mt-4 pt-4 border-t border-neutral-600">
                      <View className="flex-row justify-between mb-3">
                        <Text className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          Actions
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                          {request.type.toUpperCase()}
                        </Text>
                      </View>
                      
                      {request.status === 'pending' ? (
                        <View>
                          <TouchableOpacity 
                            className={`w-full py-4 px-6 rounded-2xl mb-4 ${
                              isDark ? 'bg-green-600' : 'bg-green-500'
                            }`}
                            onPress={() => handleRequestAction(request.id, 'approve')}
                            style={{ shadowColor: '#10b981', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                          >
                            <View className="flex-row items-center justify-center">
                              <Ionicons name="checkmark-circle" size={20} color="white" />
                              <Text className="text-white text-base font-semibold ml-3">
                                Approve
                              </Text>
                            </View>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            className={`w-full py-4 px-6 rounded-2xl ${
                              isDark ? 'bg-red-600' : 'bg-red-500'
                            }`}
                            onPress={() => handleRequestAction(request.id, 'deny')}
                            style={{ shadowColor: '#ef4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 }}
                          >
                            <View className="flex-row items-center justify-center">
                              <Ionicons name="close-circle" size={20} color="white" />
                              <Text className="text-white text-base font-semibold ml-3">
                                Deny
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View className="flex-row items-center justify-center py-2">
                          <View className={`px-3 py-1 rounded-full ${
                            request.status === 'approved' 
                              ? (isDark ? 'bg-green-600' : 'bg-green-500')
                              : (isDark ? 'bg-red-600' : 'bg-red-500')
                          }`}>
                            <Text className="text-white text-xs font-medium">
                              {request.status === 'approved' ? '✓ Approved' : '✗ Denied'}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeSelectionScreen;
