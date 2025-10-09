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
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

interface RFIDCard {
  id: string;
  cardNumber: string;
  name: string;
  type: 'resident' | 'guest' | 'service' | 'emergency';
  isActive: boolean;
  assignedTo: string;
  lastUsed: string;
  accessCount: number;
  expiryDate?: string;
  notes?: string;
}

interface RFIDManagementScreenProps {
  navigation: any;
  route: {
    params: {
      home: any;
    };
  };
}

const RFIDManagementScreen: React.FC<RFIDManagementScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { home } = route.params;
  
  const [rfidCards, setRfidCards] = useState<RFIDCard[]>([
    {
      id: '1',
      cardNumber: 'RFID-001-ABC123',
      name: 'John Doe - Main Card',
      type: 'resident',
      isActive: true,
      assignedTo: 'John Doe',
      lastUsed: '2 minutes ago',
      accessCount: 127,
      expiryDate: '2025-12-31',
      notes: 'Primary access card'
    },
    {
      id: '2',
      cardNumber: 'RFID-002-DEF456',
      name: 'Jane Smith - Spare Card',
      type: 'resident',
      isActive: true,
      assignedTo: 'Jane Smith',
      lastUsed: '1 hour ago',
      accessCount: 89,
      expiryDate: '2025-12-31',
      notes: 'Backup card'
    },
    {
      id: '3',
      cardNumber: 'RFID-003-GHI789',
      name: 'Guest Card - Temporary',
      type: 'guest',
      isActive: true,
      assignedTo: 'Guest',
      lastUsed: '3 days ago',
      accessCount: 5,
      expiryDate: '2024-02-15',
      notes: 'Temporary guest access'
    },
    {
      id: '4',
      cardNumber: 'RFID-004-JKL012',
      name: 'Maintenance Card',
      type: 'service',
      isActive: false,
      assignedTo: 'Maintenance Team',
      lastUsed: '1 week ago',
      accessCount: 23,
      notes: 'Service access only'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardType, setNewCardType] = useState<'resident' | 'guest' | 'service' | 'emergency'>('resident');
  const [newCardAssignedTo, setNewCardAssignedTo] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardNotes, setNewCardNotes] = useState('');

  const handleToggleCard = (cardId: string) => {
    setRfidCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, isActive: !card.isActive }
        : card
    ));
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert(
      'Delete RFID Card',
      'Are you sure you want to delete this RFID card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setRfidCards(prev => prev.filter(card => card.id !== cardId));
          }
        }
      ]
    );
  };

  const handleAddCard = () => {
    if (!newCardName.trim() || !newCardAssignedTo.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newCard: RFIDCard = {
      id: Date.now().toString(),
      cardNumber: `RFID-${String(rfidCards.length + 1).padStart(3, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: newCardName.trim(),
      type: newCardType,
      isActive: true,
      assignedTo: newCardAssignedTo.trim(),
      lastUsed: 'Never',
      accessCount: 0,
      expiryDate: newCardExpiry || undefined,
      notes: newCardNotes.trim() || undefined
    };

    setRfidCards([...rfidCards, newCard]);
    setNewCardName('');
    setNewCardAssignedTo('');
    setNewCardExpiry('');
    setNewCardNotes('');
    setShowAddModal(false);
    Alert.alert('Success', 'RFID card added successfully!');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'resident': return isDark ? '#3b82f6' : '#2563eb';
      case 'guest': return isDark ? '#10b981' : '#059669';
      case 'service': return isDark ? '#f59e0b' : '#d97706';
      case 'emergency': return isDark ? '#ef4444' : '#dc2626';
      default: return isDark ? '#6b7280' : '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resident': return 'person';
      case 'guest': return 'people';
      case 'service': return 'construct';
      case 'emergency': return 'warning';
      default: return 'card';
    }
  };

  const RFIDCardItem = ({ card }: { card: RFIDCard }) => (
    <View className={`p-6 rounded-2xl mb-4 border ${
      isDark 
        ? 'bg-neutral-800 border-neutral-700' 
        : 'bg-white border-neutral-200'
    }`}>
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center flex-1">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-4`} 
                style={{ backgroundColor: getTypeColor(card.type) }}>
            <Ionicons 
              name={getTypeIcon(card.type) as any} 
              size={24} 
              color="white" 
            />
          </View>
          <View className="flex-1">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {card.name}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {card.cardNumber}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Assigned to: {card.assignedTo}
            </Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          card.isActive 
            ? (isDark ? 'bg-green-600' : 'bg-green-500')
            : (isDark ? 'bg-neutral-600' : 'bg-neutral-300')
        }`}>
          <Text className={`text-xs font-medium ${
            card.isActive ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
          }`}>
            {card.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      
      {/* Stats */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Ionicons 
            name="stats-chart" 
            size={16} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
          <Text className={`text-sm ml-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {card.accessCount} uses
          </Text>
        </View>
        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          Last used: {card.lastUsed}
        </Text>
      </View>
      
      {/* Expiry Date */}
      {card.expiryDate && (
        <View className="flex-row items-center mb-4">
          <Ionicons 
            name="calendar" 
            size={16} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
          <Text className={`text-sm ml-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Expires: {card.expiryDate}
          </Text>
        </View>
      )}
      
      {/* Notes */}
      {card.notes && (
        <View className="mb-4">
          <Text className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            {card.notes}
          </Text>
        </View>
      )}
      
      {/* Actions */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          <TouchableOpacity 
            className="p-2 mr-2"
            onPress={() => handleToggleCard(card.id)}
          >
            <Ionicons 
              name={card.isActive ? "checkmark-circle" : "close-circle"} 
              size={20} 
              color={card.isActive ? (isDark ? '#10b981' : '#059669') : (isDark ? '#ef4444' : '#dc2626')} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            className="p-2"
            onPress={() => handleDeleteCard(card.id)}
          >
            <Ionicons 
              name="trash-outline" 
              size={20} 
              color={isDark ? '#ef4444' : '#dc2626'} 
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="p-2">
          <Ionicons 
            name="settings-outline" 
            size={16} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const AddCardModal = () => (
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
              Add RFID Card
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Card Name *
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter card name"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newCardName}
                onChangeText={setNewCardName}
              />
            </View>
            
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Assigned To *
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter person's name"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newCardAssignedTo}
                onChangeText={setNewCardAssignedTo}
              />
            </View>
            
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Card Type
              </Text>
              <View className="flex-row flex-wrap">
                {[
                  { value: 'resident', label: 'Resident', icon: 'person' },
                  { value: 'guest', label: 'Guest', icon: 'people' },
                  { value: 'service', label: 'Service', icon: 'construct' },
                  { value: 'emergency', label: 'Emergency', icon: 'warning' }
                ].map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    className={`p-3 rounded-xl mr-2 mb-2 flex-row items-center ${
                      newCardType === type.value
                        ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                        : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
                    }`}
                    onPress={() => setNewCardType(type.value as any)}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={16} 
                      color={newCardType === type.value ? 'white' : (isDark ? '#a3a3a3' : '#737373')} 
                    />
                    <Text className={`text-sm ml-2 ${
                      newCardType === type.value ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
                    }`}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Expiry Date (Optional)
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newCardExpiry}
                onChangeText={setNewCardExpiry}
              />
            </View>
            
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Notes (Optional)
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter any notes"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={newCardNotes}
                onChangeText={setNewCardNotes}
                multiline
              />
            </View>
          </ScrollView>
          
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
            onPress={handleAddCard}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Add Card
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ScanModal = () => (
    <Modal
      visible={showScanModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowScanModal(false)}
    >
      <View className="flex-1 justify-center bg-black/50 px-6">
        <View className={`rounded-2xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6`}>
          <View className="items-center mb-6">
            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
              isDark ? 'bg-primary-600' : 'bg-primary-500'
            }`}>
              <Ionicons name="scan" size={32} color="white" />
            </View>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Scan RFID Card
            </Text>
            <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Hold the RFID card near the device to scan
            </Text>
          </View>
          
          <View className="mb-6">
            <View className={`h-2 rounded-full ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}>
              <View className="h-2 rounded-full bg-primary-500 animate-pulse" style={{ width: '60%' }} />
            </View>
            <Text className={`text-xs mt-2 text-center ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Waiting for card...
            </Text>
          </View>
          
          <TouchableOpacity
            className={`py-3 px-4 rounded-xl border ${
              isDark ? 'border-neutral-600' : 'border-neutral-300'
            }`}
            onPress={() => setShowScanModal(false)}
          >
            <Text className={`text-center font-medium ${
              isDark ? 'text-neutral-300' : 'text-neutral-600'
            }`}>
              Cancel
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
              RFID Cards
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {home.name} • Access Cards
            </Text>
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setShowScanModal(true)}
            className={`p-2 rounded-full mr-2 ${isDark ? 'bg-green-600' : 'bg-green-500'}`}
          >
            <Ionicons name="scan" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className={`p-2 rounded-full ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View className="flex-row justify-between mb-6">
          <View className={`flex-1 p-4 rounded-xl mr-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {rfidCards.length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Total Cards
            </Text>
          </View>
          <View className={`flex-1 p-4 rounded-xl ml-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {rfidCards.filter(c => c.isActive).length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Active
            </Text>
          </View>
        </View>

        {/* RFID Cards */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Access Cards
          </Text>
          
          {rfidCards.length === 0 ? (
            <View className={`p-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} items-center`}>
              <Ionicons 
                name="card-outline" 
                size={48} 
                color={isDark ? '#a3a3a3' : '#737373'} 
              />
              <Text className={`text-lg font-medium mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                No RFID cards yet
              </Text>
              <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Add RFID cards for access control
              </Text>
            </View>
          ) : (
            rfidCards.map((card) => (
              <RFIDCardItem key={card.id} card={card} />
            ))
          )}
        </View>
      </ScrollView>

      <AddCardModal />
      <ScanModal />
    </SafeAreaView>
  );
};

export default RFIDManagementScreen;
