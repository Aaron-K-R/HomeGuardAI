import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Modal,
  TextInput,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface Device {
  id: string;
  name: string;
  type: 'raspberry-pi' | 'camera' | 'sensor' | 'lock';
  status: 'online' | 'offline' | 'error';
  location: string;
  ipAddress: string;
  lastSeen: string;
  features: string[];
}

interface DeviceManagementScreenProps {
  navigation: any;
  route: {
    params: {
      home: any;
    };
  };
}

const DeviceManagementScreen: React.FC<DeviceManagementScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { home } = route.params;
  
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Main Door Controller',
      type: 'raspberry-pi',
      status: 'online',
      location: 'Front Door',
      ipAddress: '192.168.1.100',
      lastSeen: '2 minutes ago',
      features: ['Face Recognition', 'RFID Reader', 'Deadbolt Control']
    },
    {
      id: '2',
      name: 'Back Door Camera',
      type: 'camera',
      status: 'online',
      location: 'Back Door',
      ipAddress: '192.168.1.101',
      lastSeen: '1 minute ago',
      features: ['Motion Detection', 'Night Vision']
    },
    {
      id: '3',
      name: 'Garage Door Sensor',
      type: 'sensor',
      status: 'offline',
      location: 'Garage',
      ipAddress: '192.168.1.102',
      lastSeen: '2 hours ago',
      features: ['Door Position', 'Motion Detection']
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'raspberry-pi' | 'camera' | 'sensor' | 'lock'>('raspberry-pi');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return isDark ? '#10b981' : '#059669';
      case 'offline': return isDark ? '#6b7280' : '#6b7280';
      case 'error': return isDark ? '#ef4444' : '#dc2626';
      default: return isDark ? '#6b7280' : '#6b7280';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'raspberry-pi': return 'hardware-chip';
      case 'camera': return 'videocam';
      case 'sensor': return 'pulse';
      case 'lock': return 'lock-closed';
      default: return 'hardware-chip';
    }
  };

  const handleAddDevice = () => {
    if (!newDeviceName.trim()) {
      Alert.alert('Error', 'Please enter a device name');
      return;
    }

    const newDevice: Device = {
      id: Date.now().toString(),
      name: newDeviceName.trim(),
      type: newDeviceType,
      status: 'offline',
      location: 'Unknown',
      ipAddress: '0.0.0.0',
      lastSeen: 'Never',
      features: []
    };

    setDevices([...devices, newDevice]);
    setNewDeviceName('');
    setShowAddModal(false);
    Alert.alert('Success', 'Device added successfully!');
  };

  const DeviceCard = ({ device }: { device: Device }) => (
    <TouchableOpacity
      className={`p-6 rounded-2xl mb-4 border ${
        isDark 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-neutral-200'
      }`}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
            isDark ? 'bg-primary-600' : 'bg-primary-500'
          }`}>
            <Ionicons 
              name={getDeviceIcon(device.type) as any} 
              size={24} 
              color="white" 
            />
          </View>
          <View className="flex-1">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {device.name}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {device.location} • {device.ipAddress}
            </Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full`} style={{ backgroundColor: getStatusColor(device.status) }}>
          <Text className="text-xs font-medium text-white">
            {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
          </Text>
        </View>
      </View>
      
      {device.features.length > 0 && (
        <View className="mb-3">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            Features:
          </Text>
          <View className="flex-row flex-wrap">
            {device.features.map((feature, index) => (
              <View
                key={index}
                className={`px-2 py-1 rounded-md mr-2 mb-1 ${
                  isDark ? 'bg-neutral-700' : 'bg-neutral-100'
                }`}
              >
                <Text className={`text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <View className="flex-row justify-between items-center">
        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          Last seen: {device.lastSeen}
        </Text>
        <TouchableOpacity className="p-2">
          <Ionicons 
            name="settings-outline" 
            size={16} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const AddDeviceModal = () => (
    <Modal
      visible={showAddModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAddModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6`}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Add New Device
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>
          
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Device Name
            </Text>
            <TextInput
              className={`p-4 rounded-xl border ${
                isDark 
                  ? 'bg-neutral-700 border-neutral-600 text-white' 
                  : 'bg-neutral-100 border-neutral-200 text-neutral-900'
              }`}
              placeholder="Enter device name"
              placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
              value={newDeviceName}
              onChangeText={setNewDeviceName}
            />
          </View>
          
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Device Type
            </Text>
            <View className="flex-row flex-wrap">
              {[
                { value: 'raspberry-pi', label: 'Raspberry Pi', icon: 'hardware-chip' },
                { value: 'camera', label: 'Camera', icon: 'videocam' },
                { value: 'sensor', label: 'Sensor', icon: 'pulse' },
                { value: 'lock', label: 'Smart Lock', icon: 'lock-closed' }
              ].map((type) => (
                <TouchableOpacity
                  key={type.value}
                  className={`p-3 rounded-xl mr-2 mb-2 flex-row items-center ${
                    newDeviceType === type.value
                      ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                      : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
                  }`}
                  onPress={() => setNewDeviceType(type.value as any)}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={16} 
                    color={newDeviceType === type.value ? 'white' : (isDark ? '#a3a3a3' : '#737373')} 
                  />
                  <Text className={`text-sm ml-2 ${
                    newDeviceType === type.value ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
                  }`}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
            onPress={handleAddDevice}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Add Device
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
              {home.name} Devices
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Manage Raspberry Pi and smart devices
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
              {devices.length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Total Devices
            </Text>
          </View>
          <View className={`flex-1 p-4 rounded-xl ml-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {devices.filter(d => d.status === 'online').length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Online
            </Text>
          </View>
        </View>

        {/* Devices List */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Smart Devices
          </Text>
          
          {devices.length === 0 ? (
            <View className={`p-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} items-center`}>
              <Ionicons 
                name="hardware-chip-outline" 
                size={48} 
                color={isDark ? '#a3a3a3' : '#737373'} 
              />
              <Text className={`text-lg font-medium mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                No devices yet
              </Text>
              <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Add your first smart device to get started
              </Text>
            </View>
          ) : (
            devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))
          )}
        </View>
      </ScrollView>

      <AddDeviceModal />
    </SafeAreaView>
  );
};

export default DeviceManagementScreen;
