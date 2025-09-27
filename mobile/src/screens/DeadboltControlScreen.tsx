import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Switch,
  Modal,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface Deadbolt {
  id: string;
  name: string;
  location: string;
  isLocked: boolean;
  isOnline: boolean;
  batteryLevel: number;
  lastActivity: string;
  autoUnlockEnabled: boolean;
  autoLockTimeout: number; // in minutes
}

interface DeadboltControlScreenProps {
  navigation: any;
  route: {
    params: {
      home: any;
    };
  };
}

const DeadboltControlScreen: React.FC<DeadboltControlScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { home } = route.params;
  
  const [deadbolts, setDeadbolts] = useState<Deadbolt[]>([
    {
      id: '1',
      name: 'Front Door',
      location: 'Main Entrance',
      isLocked: true,
      isOnline: true,
      batteryLevel: 85,
      lastActivity: '2 minutes ago',
      autoUnlockEnabled: true,
      autoLockTimeout: 5
    },
    {
      id: '2',
      name: 'Back Door',
      location: 'Garden Entrance',
      isLocked: false,
      isOnline: true,
      batteryLevel: 92,
      lastActivity: '1 minute ago',
      autoUnlockEnabled: false,
      autoLockTimeout: 10
    },
    {
      id: '3',
      name: 'Garage Door',
      location: 'Garage',
      isLocked: true,
      isOnline: false,
      batteryLevel: 45,
      lastActivity: '2 hours ago',
      autoUnlockEnabled: true,
      autoLockTimeout: 15
    }
  ]);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedDeadbolt, setSelectedDeadbolt] = useState<Deadbolt | null>(null);

  const handleLockToggle = (deadboltId: string) => {
    setDeadbolts(prev => prev.map(deadbolt => 
      deadbolt.id === deadboltId 
        ? { ...deadbolt, isLocked: !deadbolt.isLocked }
        : deadbolt
    ));
  };

  const handleAutoUnlockToggle = (deadboltId: string) => {
    setDeadbolts(prev => prev.map(deadbolt => 
      deadbolt.id === deadboltId 
        ? { ...deadbolt, autoUnlockEnabled: !deadbolt.autoUnlockEnabled }
        : deadbolt
    ));
  };

  const handleSettingsPress = (deadbolt: Deadbolt) => {
    setSelectedDeadbolt(deadbolt);
    setShowSettingsModal(true);
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return isDark ? '#10b981' : '#059669';
    if (level > 20) return isDark ? '#f59e0b' : '#d97706';
    return isDark ? '#ef4444' : '#dc2626';
  };

  const DeadboltCard = ({ deadbolt }: { deadbolt: Deadbolt }) => (
    <View className={`p-6 rounded-2xl mb-4 border ${
      isDark 
        ? 'bg-neutral-800 border-neutral-700' 
        : 'bg-white border-neutral-200'
    }`}>
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {deadbolt.name}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {deadbolt.location}
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className={`w-3 h-3 rounded-full mr-2 ${
            deadbolt.isOnline ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {deadbolt.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>
      
      {/* Lock Status */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Ionicons 
            name={deadbolt.isLocked ? "lock-closed" : "lock-open"} 
            size={24} 
            color={deadbolt.isLocked ? (isDark ? '#ef4444' : '#dc2626') : (isDark ? '#10b981' : '#059669')} 
          />
          <Text className={`text-lg font-semibold ml-3 ${
            deadbolt.isLocked ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-green-400' : 'text-green-600')
          }`}>
            {deadbolt.isLocked ? 'Locked' : 'Unlocked'}
          </Text>
        </View>
        <TouchableOpacity
          className={`px-4 py-2 rounded-xl ${
            deadbolt.isLocked 
              ? (isDark ? 'bg-red-600' : 'bg-red-500')
              : (isDark ? 'bg-green-600' : 'bg-green-500')
          }`}
          onPress={() => handleLockToggle(deadbolt.id)}
        >
          <Text className="text-white font-semibold">
            {deadbolt.isLocked ? 'Unlock' : 'Lock'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Battery and Status */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Ionicons 
            name="battery-half" 
            size={16} 
            color={getBatteryColor(deadbolt.batteryLevel)} 
          />
          <Text className={`text-sm ml-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {deadbolt.batteryLevel}%
          </Text>
        </View>
        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          {deadbolt.lastActivity}
        </Text>
      </View>
      
      {/* Auto Unlock Settings */}
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Auto Unlock
          </Text>
          <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Auto-unlock after {deadbolt.autoLockTimeout} minutes
          </Text>
        </View>
        <Switch
          value={deadbolt.autoUnlockEnabled}
          onValueChange={() => handleAutoUnlockToggle(deadbolt.id)}
          trackColor={{ false: '#767577', true: '#3b82f6' }}
          thumbColor={deadbolt.autoUnlockEnabled ? '#ffffff' : '#f4f3f4'}
        />
      </View>
      
      <TouchableOpacity 
        className="absolute top-4 right-4 p-2"
        onPress={() => handleSettingsPress(deadbolt)}
      >
        <Ionicons 
          name="settings-outline" 
          size={20} 
          color={isDark ? '#a3a3a3' : '#737373'} 
        />
      </TouchableOpacity>
    </View>
  );

  const SettingsModal = () => (
    <Modal
      visible={showSettingsModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSettingsModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6`}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {selectedDeadbolt?.name} Settings
            </Text>
            <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>
          
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Auto Lock Timeout (minutes)
            </Text>
            <TextInput
              className={`p-4 rounded-xl border ${
                isDark 
                  ? 'bg-neutral-700 border-neutral-600 text-white' 
                  : 'bg-neutral-100 border-neutral-200 text-neutral-900'
              }`}
              placeholder="Enter timeout in minutes"
              placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
              value={selectedDeadbolt?.autoLockTimeout.toString()}
              keyboardType="numeric"
            />
          </View>
          
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
            onPress={() => setShowSettingsModal(false)}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Save Settings
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
              Deadbolt Control
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {home.name} • Smart Locks
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View className="flex-row justify-between mb-6">
          <View className={`flex-1 p-4 rounded-xl mr-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {deadbolts.filter(d => d.isLocked).length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Locked
            </Text>
          </View>
          <View className={`flex-1 p-4 rounded-xl ml-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {deadbolts.filter(d => d.isOnline).length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Online
            </Text>
          </View>
        </View>

        {/* Deadbolts List */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Smart Deadbolts
          </Text>
          
          {deadbolts.length === 0 ? (
            <View className={`p-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} items-center`}>
              <Ionicons 
                name="lock-closed-outline" 
                size={48} 
                color={isDark ? '#a3a3a3' : '#737373'} 
              />
              <Text className={`text-lg font-medium mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                No deadbolts configured
              </Text>
              <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Add smart deadbolts to control your doors
              </Text>
            </View>
          ) : (
            deadbolts.map((deadbolt) => (
              <DeadboltCard key={deadbolt.id} deadbolt={deadbolt} />
            ))
          )}
        </View>
      </ScrollView>

      <SettingsModal />
    </SafeAreaView>
  );
};

export default DeadboltControlScreen;
