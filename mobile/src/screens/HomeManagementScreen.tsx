import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Modal,
  TextInput,
  FlatList,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { homeService, HomeRequest, HomeResponse } from '../services/HomeService';
import * as Location from 'expo-location';

interface Home extends HomeResponse {
  lastActivity: string; // Computed field for display
}

interface HomeManagementScreenProps {
  navigation: any;
}

const HomeManagementScreen: React.FC<HomeManagementScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  
  const [homes, setHomes] = useState<Home[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newHomeName, setNewHomeName] = useState('');
  const [newHomeAddress, setNewHomeAddress] = useState('');
  const [newHomeCity, setNewHomeCity] = useState('');
  const [newHomeState, setNewHomeState] = useState('');
  const [newHomeZipCode, setNewHomeZipCode] = useState('');
  const [newHomeCountry, setNewHomeCountry] = useState('');
  const [newHomeType, setNewHomeType] = useState('house');
  const [newHomeDescription, setNewHomeDescription] = useState('');
  const [newHomeSecurityType, setNewHomeSecurityType] = useState('basic');

  // Load homes on component mount
  useEffect(() => {
    loadHomes();
  }, []);

  const loadHomes = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const homesData = await homeService.getHomesByOwnerId(user.id);
      // Add computed lastActivity field for display
      const homesWithActivity = homesData.map(home => ({
        ...home,
        lastActivity: 'Recently active' // This would come from actual activity data
      }));
      setHomes(homesWithActivity);
    } catch (error) {
      console.error('Error loading homes:', error);
      Alert.alert('Error', 'Failed to load homes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHome = async () => {
    if (!newHomeName.trim() || !newHomeAddress.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setIsSaving(true);
      
      const homeData: HomeRequest = {
        name: newHomeName.trim(),
        address: newHomeAddress.trim(),
        city: newHomeCity.trim() || undefined,
        state: newHomeState.trim() || undefined,
        zipCode: newHomeZipCode.trim() || undefined,
        country: newHomeCountry.trim() || undefined,
        homeType: newHomeType,
        isPrimary: homes.length === 0, // First home is primary
        description: newHomeDescription.trim() || undefined,
        securitySystemType: newHomeSecurityType,
      };

      // Validate data
      const validationErrors = homeService.validateHomeData(homeData);
      if (validationErrors.length > 0) {
        Alert.alert('Validation Error', validationErrors.join('\n'));
        return;
      }

      const newHome = await homeService.createHome(user.id, homeData);
      
      // Add computed field for display
      const homeWithActivity = {
        ...newHome,
        lastActivity: 'Just now'
      };
      
      setHomes([...homes, homeWithActivity]);
      
      // Reset form and close modal
      handleCloseModal();
      
      Alert.alert('Success', 'Home added successfully!');
    } catch (error) {
      console.error('Error adding home:', error);
      Alert.alert('Error', 'Failed to add home. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHomePress = (home: Home) => {
    navigation.navigate('HomeDashboard', { home });
  };

  const clearFormData = useCallback(() => {
    setNewHomeName('');
    setNewHomeAddress('');
    setNewHomeCity('');
    setNewHomeState('');
    setNewHomeZipCode('');
    setNewHomeCountry('');
    setNewHomeDescription('');
  }, []);

  const handleGetCurrentLocation = useCallback(async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to get your current address.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const parts = [];
        
        if (address.streetNumber) parts.push(address.streetNumber);
        if (address.street) parts.push(address.street);
        if (address.city) parts.push(address.city);
        if (address.region) parts.push(address.region);
        if (address.postalCode) parts.push(address.postalCode);
        if (address.country) parts.push(address.country);
        
        const formattedAddress = parts.join(', ');
        
        // Auto-fill the form
        setNewHomeAddress(formattedAddress);
        setNewHomeCity(address.city || '');
        setNewHomeState(address.region || '');
        setNewHomeZipCode(address.postalCode || '');
        setNewHomeCountry(address.country || '');
        
        Alert.alert('Success', 'Current location detected and filled!');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your current location.');
    }
  }, []);


  const HomeCard = ({ home }: { home: Home }) => (
    <TouchableOpacity
      className={`p-6 rounded-2xl mb-4 border ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-neutral-200'
      }`}
      onPress={() => handleHomePress(home)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {home.name}
            </Text>
            {home.isPrimary && (
              <View className={`ml-2 px-2 py-1 rounded-full ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}>
                <Text className="text-white text-xs font-semibold">
                  Primary
                </Text>
              </View>
            )}
          </View>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'} mt-1`}>
            {home.fullAddress || home.address}
          </Text>
          <View className="flex-row items-center mt-2">
            <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
              {home.homeType ? home.homeType.charAt(0).toUpperCase() + home.homeType.slice(1) : 'Unknown'} • {home.securitySystemType ? home.securitySystemType.charAt(0).toUpperCase() + home.securitySystemType.slice(1) : 'Basic'} Security
            </Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          home.isActive 
            ? (isDark ? 'bg-green-600' : 'bg-green-500')
            : (isDark ? 'bg-neutral-600' : 'bg-neutral-300')
        }`}>
          <Text className={`text-xs font-medium ${
            home.isActive ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
          }`}>
            {home.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Ionicons 
            name="hardware-chip" 
            size={16} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
          <Text className={`text-sm ml-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {home.deviceCount} device{home.deviceCount !== 1 ? 's' : ''}
          </Text>
        </View>
        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          {home.lastActivity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleCloseModal = () => {
    setShowAddModal(false);
    clearFormData();
  };


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
              Home Management
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Manage your smart homes
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className={`p-2 rounded-full ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="flex-row justify-between mb-6">
          <View className={`flex-1 p-4 rounded-xl mr-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {homes.length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Total Homes
            </Text>
          </View>
          <View className={`flex-1 p-4 rounded-xl ml-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {homes.filter(h => h.isActive).length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Active Homes
            </Text>
          </View>
        </View>

        {/* Homes List */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Your Homes
          </Text>
          
          {isLoading ? (
            <View className={`p-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} items-center`}>
              <Text className={`text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Loading homes...
              </Text>
            </View>
          ) : homes.length === 0 ? (
            <View className={`p-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} items-center`}>
              <Ionicons 
                name="home-outline" 
                size={48} 
                color={isDark ? '#a3a3a3' : '#737373'} 
              />
              <Text className={`text-lg font-medium mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                No homes yet
              </Text>
              <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Add your first smart home to get started
              </Text>
            </View>
          ) : (
            homes.map((home) => (
              <HomeCard key={home.id} home={home} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Home Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Add New Home
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
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
                  placeholder="Enter home name"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={newHomeName}
                  onChangeText={setNewHomeName}
                />
              </View>
              
              <View className="mb-4">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Address *
                  </Text>
                  <TouchableOpacity
                    onPress={handleGetCurrentLocation}
                    className={`px-3 py-1 rounded-full ${
                      isDark ? 'bg-primary-600' : 'bg-primary-500'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="location" size={14} color="white" />
                      <Text className="text-white text-xs font-medium ml-1">
                        Current Location
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <TextInput
                  className={`p-4 rounded-xl border ${
                    isDark 
                      ? 'bg-neutral-700 border-neutral-600 text-white' 
                      : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                  }`}
                  placeholder="Enter home address"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={newHomeAddress}
                  onChangeText={setNewHomeAddress}
                  multiline
                />
              </View>

              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    City
                  </Text>
                  <TextInput
                    className={`p-4 rounded-xl border ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white' 
                        : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                    }`}
                    placeholder="City"
                    placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                    value={newHomeCity}
                    onChangeText={setNewHomeCity}
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    State
                  </Text>
                  <TextInput
                    className={`p-4 rounded-xl border ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white' 
                        : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                    }`}
                    placeholder="State"
                    placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                    value={newHomeState}
                    onChangeText={setNewHomeState}
                  />
                </View>
              </View>

              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Zip Code
                  </Text>
                  <TextInput
                    className={`p-4 rounded-xl border ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white' 
                        : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                    }`}
                    placeholder="Zip Code"
                    placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                    value={newHomeZipCode}
                    onChangeText={setNewHomeZipCode}
                  />
                </View>
                <View className="flex-1 ml-2">
                  <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    Country
                  </Text>
                  <TextInput
                    className={`p-4 rounded-xl border ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white' 
                        : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                    }`}
                    placeholder="Country"
                    placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                    value={newHomeCountry}
                    onChangeText={setNewHomeCountry}
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Home Type
                </Text>
                <View className="flex-row flex-wrap">
                  {[
                    { value: 'house', label: 'House' },
                    { value: 'apartment', label: 'Apartment' },
                    { value: 'condo', label: 'Condo' },
                    { value: 'townhouse', label: 'Townhouse' }
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      className={`p-3 rounded-xl mr-2 mb-2 ${
                        newHomeType === type.value
                          ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                          : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
                      }`}
                      onPress={() => setNewHomeType(type.value)}
                    >
                      <Text className={`text-sm ${
                        newHomeType === type.value ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
                      }`}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="mb-4">
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Security System Type
                </Text>
                <View className="flex-row flex-wrap">
                  {[
                    { value: 'basic', label: 'Basic' },
                    { value: 'premium', label: 'Premium' },
                    { value: 'custom', label: 'Custom' }
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      className={`p-3 rounded-xl mr-2 mb-2 ${
                        newHomeSecurityType === type.value
                          ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                          : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
                      }`}
                      onPress={() => setNewHomeSecurityType(type.value)}
                    >
                      <Text className={`text-sm ${
                        newHomeSecurityType === type.value ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
                      }`}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="mb-6">
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Description (Optional)
                </Text>
                <TextInput
                  className={`p-4 rounded-xl border ${
                    isDark 
                      ? 'bg-neutral-700 border-neutral-600 text-white' 
                      : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                  }`}
                  placeholder="Enter home description"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={newHomeDescription}
                  onChangeText={setNewHomeDescription}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
            
            <TouchableOpacity
              className={`py-4 px-6 rounded-xl ${
                isSaving 
                  ? (isDark ? 'bg-neutral-600' : 'bg-neutral-400')
                  : (isDark ? 'bg-primary-600' : 'bg-primary-500')
              }`}
              onPress={handleAddHome}
              disabled={isSaving}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isSaving ? 'Adding Home...' : 'Add Home'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeManagementScreen;
