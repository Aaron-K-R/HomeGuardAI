import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Modal,
  TextInput
} from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { homeService, HomeResponse, HomeRequest } from '../../services/home-management/HomeService';
import { Home } from '../../types/Home';

interface HomeListScreenProps {
  navigation: any;
  route: {
    params?: any;
  };
}

const { width } = Dimensions.get('window');

const HomeListScreen: React.FC<HomeListScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Add home modal states
  const [showAddHomeModal, setShowAddHomeModal] = useState(false);
  const [isCreatingHome, setIsCreatingHome] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  const [newHomeAddress, setNewHomeAddress] = useState('');
  const [newHomeCity, setNewHomeCity] = useState('');
  const [newHomeState, setNewHomeState] = useState('');
  const [newHomeZipCode, setNewHomeZipCode] = useState('');
  const [newHomeType, setNewHomeType] = useState('House');
  const [newHomeDescription, setNewHomeDescription] = useState('');
  
  // Location states
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

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

  // Load data on mount
  useEffect(() => {
    loadHomes();
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationPermission(status);
    } catch (err) {
      console.error('Error checking location permission:', err);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status);
      return status === 'granted';
    } catch (err) {
      console.error('Error requesting location permission:', err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsGettingLocation(true);
      
      // Check permission first
      if (locationPermission !== 'granted') {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          Alert.alert(
            'Location Permission Required',
            'Please enable location access to automatically set your home coordinates.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation(currentLocation);

      // Perform reverse geocoding to fill form fields
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          
          // Build the street address more comprehensively
          let streetAddress = '';
          const addressParts = [];
          
          // Try different combinations to get the best address
          if (address.streetNumber && address.street) {
            // Best case: we have both number and street
            streetAddress = `${address.streetNumber} ${address.street}`;
          } else if (address.street) {
            // Just street name
            streetAddress = address.street;
          } else if (address.streetNumber) {
            // Just street number (unusual but possible)
            streetAddress = address.streetNumber;
          } else if (address.name && (address.name.includes('St') || address.name.includes('Ave') || address.name.includes('Rd') || address.name.includes('Blvd') || address.name.includes('Dr') || address.name.includes('Ln') || address.name.includes('Way'))) {
            // Name looks like a street name
            streetAddress = address.name;
          } else if (address.name) {
            // Fallback to name (might be a landmark or business)
            streetAddress = address.name;
          } else if (address.district) {
            // Another fallback
            streetAddress = address.district;
          }
          
          // Set the address if we have something
          if (streetAddress) {
            setNewHomeAddress(streetAddress);
          }
          
          // Fill other fields
          if (address.city) {
            setNewHomeCity(address.city);
          }
          
          if (address.region) {
            setNewHomeState(address.region);
          }
          
          if (address.postalCode) {
            setNewHomeZipCode(address.postalCode);
          }

          Alert.alert('Success', 'Location obtained and form filled automatically!');
        } else {
          Alert.alert('Success', 'Location obtained successfully!');
        }
      } catch (geocodeError) {
        Alert.alert('Success', 'Location obtained! (Address lookup failed - please fill manually)');
      }
    } catch (err) {
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again or enter coordinates manually.'
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const loadHomes = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const apiHomes = await homeService.getHomesByOwnerId(user.id);
      const convertedHomes = apiHomes.map(convertApiResponseToHome);
      
      setHomes(convertedHomes);
    } catch (err) {
      console.error('Error loading homes:', err);
      setError('Failed to load homes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, convertApiResponseToHome]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHomes();
    setRefreshing(false);
  }, [loadHomes]);

  const handleHomeSelect = (home: Home) => {
    navigation.navigate('HomeDashboard', { home });
  };

  const handleAddHome = () => {
    setShowAddHomeModal(true);
  };

  const clearAddHomeForm = () => {
    setNewHomeName('');
    setNewHomeAddress('');
    setNewHomeCity('');
    setNewHomeState('');
    setNewHomeZipCode('');
    setNewHomeType('House');
    setNewHomeDescription('');
    setLocation(null);
  };

  const handleCreateHome = async () => {
    if (!newHomeName.trim() || !newHomeAddress.trim()) {
      Alert.alert('Error', 'Please fill in the required fields (Name and Address)');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    try {
      setIsCreatingHome(true);
      
      const homeData: HomeRequest = {
        name: newHomeName.trim(),
        address: newHomeAddress.trim(),
        city: newHomeCity.trim() || undefined,
        state: newHomeState.trim() || undefined,
        zipCode: newHomeZipCode.trim() || undefined,
        homeType: newHomeType,
        securitySystemType: 'basic',
        isPrimary: homes.length === 0, // First home is primary
        description: newHomeDescription.trim() || `Home created on ${new Date().toLocaleDateString()}`,
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude
      };

      // Validate the data
      const validationErrors = homeService.validateHomeData(homeData);
      if (validationErrors.length > 0) {
        Alert.alert('Validation Error', validationErrors.join('\n'));
        return;
      }

      const newHome = await homeService.createHome(user.id, homeData);
      const convertedHome = convertApiResponseToHome(newHome);
      
      setHomes(prev => [...prev, convertedHome]);
      setShowAddHomeModal(false);
      clearAddHomeForm();
      
      Alert.alert('Success', 'Home created successfully!');
    } catch (err) {
      console.error('Error creating home:', err);
      Alert.alert('Error', 'Failed to create home. Please try again.');
    } finally {
      setIsCreatingHome(false);
    }
  };

  const handleHomeSettings = (home: Home) => {
    navigation.navigate('SecuritySettings', { home });
  };

  const handleHomeManagement = (home: Home) => {
    navigation.navigate('HomeManagement', { home });
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

  const SettingRow = ({ 
    title, 
    subtitle, 
    icon, 
    onPress 
  }: { 
    title: string; 
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 rounded-xl mb-3 border ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-neutral-200'
      }`}
    >
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          isDark ? 'bg-primary-600' : 'bg-primary-500'
        }`}>
          <Ionicons name={icon} size={20} color="white" />
        </View>
        <View className="flex-1">
          <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {title}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {subtitle}
          </Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDark ? '#a3a3a3' : '#737373'} 
        />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator 
            size="large" 
            color={isDark ? '#3b82f6' : '#2563eb'} 
          />
          <Text className={`text-lg mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Loading homes...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons 
            name="alert-circle" 
            size={48} 
            color={isDark ? '#ef4444' : '#dc2626'} 
          />
          <Text className={`text-lg font-semibold mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Error Loading Homes
          </Text>
          <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadHomes}
            className="mt-4 px-6 py-3 bg-primary-600 rounded-xl"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              Manage your homes and security
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons 
              name="close" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDark ? '#ffffff' : '#000000'}
          />
        }
      >

        {/* Overview Stats */}
        {homes.length > 0 && (
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

        {/* Homes List */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            My Homes ({homes.length})
          </Text>
          
          {homes.length === 0 ? (
            <View className="items-center py-12">
              <Ionicons 
                name="home-outline" 
                size={64} 
                color={isDark ? '#a3a3a3' : '#737373'} 
              />
              <Text className={`text-xl font-semibold mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                No Homes Yet
              </Text>
              <Text className={`text-sm text-center mt-2 px-8 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Add your first home to get started with HomeGuard security system
              </Text>
              <TouchableOpacity 
                onPress={handleAddHome}
                className="mt-6 px-6 py-3 bg-primary-600 rounded-xl"
              >
                <Text className="text-white font-semibold">
                  Add Your First Home
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            homes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))
          )}
        </View>

        {/* Add Home Button */}
        {homes.length > 0 && (
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
        )}
      </ScrollView>

      {/* Add Home Modal */}
      <Modal
        visible={showAddHomeModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <TouchableOpacity onPress={() => setShowAddHomeModal(false)}>
              <Text className={`text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}>Cancel</Text>
            </TouchableOpacity>
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Add New Home
            </Text>
            <TouchableOpacity onPress={handleCreateHome} disabled={isCreatingHome}>
              <Text className={`text-lg font-semibold ${
                isCreatingHome 
                  ? (isDark ? 'text-neutral-500' : 'text-neutral-400')
                  : (isDark ? 'text-primary-400' : 'text-primary-600')
              }`}>
                {isCreatingHome ? 'Creating...' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 py-4">
            {/* Location Section - Prominent at Top */}
            <View className="mb-6">
              <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Location
              </Text>
              
              {location ? (
                <View className={`p-5 rounded-xl mb-3 ${isDark ? 'bg-green-900/20' : 'bg-green-50'} border-2 ${
                  isDark ? 'border-green-800' : 'border-green-200'
                }`}>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color={isDark ? '#4ade80' : '#22c55e'} 
                      style={{ marginRight: 12 }}
                    />
                    <View className="flex-1">
                      <Text className={`text-lg font-semibold ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                        Location Obtained
                      </Text>
                      <Text className={`text-sm ${isDark ? 'text-green-200' : 'text-green-700'} mt-1`}>
                        Form fields filled automatically
                      </Text>
                      <Text className={`text-xs ${isDark ? 'text-green-200' : 'text-green-600'} mt-1`}>
                        Lat: {location.coords.latitude.toFixed(6)}, Lng: {location.coords.longitude.toFixed(6)}
                      </Text>
                      <Text className={`text-xs ${isDark ? 'text-green-200' : 'text-green-600'}`}>
                        Accuracy: ±{Math.round(location.coords.accuracy || 0)}m
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setLocation(null)}
                      className="p-2 rounded-full bg-red-500"
                    >
                      <Ionicons 
                        name="close" 
                        size={16} 
                        color="white" 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className={`p-5 rounded-xl mb-3 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border-2 ${
                  isDark ? 'border-blue-800' : 'border-blue-200'
                }`}>
                  <View className="flex-row items-start mb-4">
                    <Ionicons 
                      name="location" 
                      size={24} 
                      color={isDark ? '#60a5fa' : '#3b82f6'} 
                      style={{ marginRight: 12, marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className={`text-lg font-semibold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                        Get Your Location
                      </Text>
                      <Text className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'} mt-1`}>
                        Get your location and automatically fill address fields
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={getCurrentLocation}
                    disabled={isGettingLocation}
                    className={`p-4 rounded-xl ${
                      isGettingLocation 
                        ? (isDark ? 'bg-neutral-700' : 'bg-neutral-200')
                        : (isDark ? 'bg-primary-600' : 'bg-primary-500')
                    }`}
                    style={{ 
                      shadowColor: '#3b82f6', 
                      shadowOffset: { width: 0, height: 2 }, 
                      shadowOpacity: 0.25, 
                      shadowRadius: 4, 
                      elevation: 3 
                    }}
                  >
                    <View className="flex-row items-center justify-center">
                      {isGettingLocation ? (
                        <ActivityIndicator size="small" color="white" style={{ marginRight: 12 }} />
                      ) : (
                        <Ionicons name="location" size={24} color="white" style={{ marginRight: 12 }} />
                      )}
                      <Text className="text-white font-semibold text-lg">
                        {isGettingLocation ? 'Getting Location...' : 'Get Current Location'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Home Name *
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter home name (e.g., Main Residence)"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newHomeName}
                onChangeText={setNewHomeName}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Address *
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter street address"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newHomeAddress}
                onChangeText={setNewHomeAddress}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                City
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter city"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newHomeCity}
                onChangeText={setNewHomeCity}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                State
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter state"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newHomeState}
                onChangeText={setNewHomeState}
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Zip Code
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter zip code"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newHomeZipCode}
                onChangeText={setNewHomeZipCode}
                keyboardType="numeric"
              />
            </View>

            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Home Type
              </Text>
              <View className="flex-row flex-wrap">
                {['House', 'Apartment', 'Condo', 'Townhouse', 'Other'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    className={`p-3 rounded-xl mr-2 mb-2 ${
                      newHomeType === type
                        ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                        : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
                    }`}
                    onPress={() => setNewHomeType(type)}
                  >
                    <Text className={`text-sm ${
                      newHomeType === type
                        ? 'text-white'
                        : (isDark ? 'text-neutral-300' : 'text-neutral-700')
                    }`}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Description
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Add a description for your home (optional)"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newHomeDescription}
                onChangeText={setNewHomeDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View className={`p-4 rounded-xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} border ${
              isDark ? 'border-blue-800' : 'border-blue-200'
            }`}>
              <View className="flex-row items-start">
                <Ionicons 
                  name="information-circle" 
                  size={20} 
                  color={isDark ? '#60a5fa' : '#3b82f6'} 
                  style={{ marginRight: 12, marginTop: 2 }}
                />
                <View className="flex-1">
                  <Text className={`font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                    Security Setup
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                    Your new home will be set up with basic security features. 
                    You can configure advanced settings after creation.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeListScreen;