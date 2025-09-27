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
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface AccessLog {
  id: string;
  timestamp: string;
  personName: string;
  accessType: 'face' | 'rfid' | 'app' | 'manual';
  result: 'granted' | 'denied' | 'error';
  location: string;
  deviceName: string;
  confidence?: number;
  cardNumber?: string;
  notes?: string;
}

interface AccessLogsScreenProps {
  navigation: any;
  route: {
    params: {
      home: any;
    };
  };
}

const AccessLogsScreen: React.FC<AccessLogsScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { home } = route.params;
  
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15 14:30:25',
      personName: 'John Doe',
      accessType: 'face',
      result: 'granted',
      location: 'Front Door',
      deviceName: 'Main Door Controller',
      confidence: 95,
      notes: 'Successful face recognition'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:10',
      personName: 'Jane Smith',
      accessType: 'rfid',
      result: 'granted',
      location: 'Back Door',
      deviceName: 'Back Door Controller',
      cardNumber: 'RFID-002-DEF456',
      notes: 'RFID card access'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:20:45',
      personName: 'Unknown Person',
      accessType: 'face',
      result: 'denied',
      location: 'Front Door',
      deviceName: 'Main Door Controller',
      confidence: 45,
      notes: 'Low confidence match'
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:15:30',
      personName: 'John Doe',
      accessType: 'app',
      result: 'granted',
      location: 'Garage Door',
      deviceName: 'Garage Controller',
      notes: 'Mobile app unlock'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:10:15',
      personName: 'Maintenance Team',
      accessType: 'rfid',
      result: 'granted',
      location: 'Service Entrance',
      deviceName: 'Service Door Controller',
      cardNumber: 'RFID-004-JKL012',
      notes: 'Service access'
    },
    {
      id: '6',
      timestamp: '2024-01-15 14:05:00',
      personName: 'System',
      accessType: 'manual',
      result: 'granted',
      location: 'Front Door',
      deviceName: 'Main Door Controller',
      notes: 'Emergency override'
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState<AccessLog[]>(accessLogs);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'granted' | 'denied' | 'face' | 'rfid' | 'app'>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = accessLogs;

    // Apply result filter
    if (selectedFilter === 'granted' || selectedFilter === 'denied') {
      filtered = filtered.filter(log => log.result === selectedFilter);
    }
    // Apply access type filter
    else if (selectedFilter !== 'all') {
      filtered = filtered.filter(log => log.accessType === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(log => 
        log.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.deviceName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [accessLogs, selectedFilter, searchQuery]);

  const getResultColor = (result: string) => {
    switch (result) {
      case 'granted': return isDark ? '#10b981' : '#059669';
      case 'denied': return isDark ? '#ef4444' : '#dc2626';
      case 'error': return isDark ? '#f59e0b' : '#d97706';
      default: return isDark ? '#6b7280' : '#6b7280';
    }
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'face': return 'person';
      case 'rfid': return 'card';
      case 'app': return 'phone-portrait';
      case 'manual': return 'hand';
      default: return 'key';
    }
  };

  const getAccessTypeColor = (type: string) => {
    switch (type) {
      case 'face': return isDark ? '#3b82f6' : '#2563eb';
      case 'rfid': return isDark ? '#10b981' : '#059669';
      case 'app': return isDark ? '#8b5cf6' : '#7c3aed';
      case 'manual': return isDark ? '#f59e0b' : '#d97706';
      default: return isDark ? '#6b7280' : '#6b7280';
    }
  };

  const AccessLogItem = ({ log }: { log: AccessLog }) => (
    <View className={`p-6 rounded-2xl mb-4 border ${
      isDark 
        ? 'bg-neutral-800 border-neutral-700' 
        : 'bg-white border-neutral-200'
    }`}>
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {log.personName}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {log.location} • {log.deviceName}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full`} style={{ backgroundColor: getResultColor(log.result) }}>
          <Text className="text-xs font-medium text-white">
            {log.result.charAt(0).toUpperCase() + log.result.slice(1)}
          </Text>
        </View>
      </View>
      
      <View className="flex-row items-center mb-3">
        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3`} 
              style={{ backgroundColor: getAccessTypeColor(log.accessType) }}>
          <Ionicons 
            name={getAccessTypeIcon(log.accessType) as any} 
            size={16} 
            color="white" 
          />
        </View>
        <View className="flex-1">
          <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {log.accessType.charAt(0).toUpperCase() + log.accessType.slice(1)} Access
          </Text>
          {log.confidence && (
            <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {log.confidence}% confidence
            </Text>
          )}
          {log.cardNumber && (
            <Text className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Card: {log.cardNumber}
            </Text>
          )}
        </View>
        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          {log.timestamp}
        </Text>
      </View>
      
      {log.notes && (
        <View className={`p-3 rounded-xl ${isDark ? 'bg-neutral-700' : 'bg-neutral-100'}`}>
          <Text className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {log.notes}
          </Text>
        </View>
      )}
    </View>
  );

  const FilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6`}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Filter Logs
            </Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>
          
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Filter by Result
            </Text>
            <View className="flex-row flex-wrap">
              {[
                { value: 'all', label: 'All' },
                { value: 'granted', label: 'Granted' },
                { value: 'denied', label: 'Denied' }
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  className={`p-3 rounded-xl mr-2 mb-2 ${
                    selectedFilter === filter.value
                      ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                      : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
                  }`}
                  onPress={() => setSelectedFilter(filter.value as any)}
                >
                  <Text className={`text-sm ${
                    selectedFilter === filter.value ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
                  }`}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Filter by Access Type
            </Text>
            <View className="flex-row flex-wrap">
              {[
                { value: 'face', label: 'Face Recognition' },
                { value: 'rfid', label: 'RFID Card' },
                { value: 'app', label: 'Mobile App' },
                { value: 'manual', label: 'Manual' }
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  className={`p-3 rounded-xl mr-2 mb-2 ${
                    selectedFilter === filter.value
                      ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                      : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
                  }`}
                  onPress={() => setSelectedFilter(filter.value as any)}
                >
                  <Text className={`text-sm ${
                    selectedFilter === filter.value ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
                  }`}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
            onPress={() => setShowFilterModal(false)}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Apply Filter
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
              Access Logs
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {home.name} • Activity History
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShowFilterModal(true)}
          className={`p-2 rounded-full ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
        >
          <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <View className={`p-4 rounded-xl border ${
          isDark 
            ? 'bg-neutral-800 border-neutral-700' 
            : 'bg-white border-neutral-200'
        }`}>
          <View className="flex-row items-center">
            <Ionicons 
              name="search" 
              size={20} 
              color={isDark ? '#a3a3a3' : '#737373'} 
            />
            <TextInput
              className={`flex-1 ml-3 text-base ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}
              placeholder="Search logs..."
              placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons 
                  name="close-circle" 
                  size={20} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View className="flex-row justify-between mb-6">
          <View className={`flex-1 p-4 rounded-xl mr-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {filteredLogs.length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Total Logs
            </Text>
          </View>
          <View className={`flex-1 p-4 rounded-xl ml-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {filteredLogs.filter(log => log.result === 'granted').length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Granted
            </Text>
          </View>
        </View>

        {/* Access Logs */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Recent Activity
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {selectedFilter !== 'all' && `Filtered by ${selectedFilter}`}
            </Text>
          </View>
          
          {filteredLogs.length === 0 ? (
            <View className={`p-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} items-center`}>
              <Ionicons 
                name="document-text-outline" 
                size={48} 
                color={isDark ? '#a3a3a3' : '#737373'} 
              />
              <Text className={`text-lg font-medium mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                No logs found
              </Text>
              <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {searchQuery ? 'Try adjusting your search' : 'No access logs available'}
              </Text>
            </View>
          ) : (
            filteredLogs.map((log) => (
              <AccessLogItem key={log.id} log={log} />
            ))
          )}
        </View>
      </ScrollView>

      <FilterModal />
    </SafeAreaView>
  );
};

export default AccessLogsScreen;
