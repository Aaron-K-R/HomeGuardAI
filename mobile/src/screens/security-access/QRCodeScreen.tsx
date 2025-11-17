import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  Share,
  Platform,
  TextInput
} from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import QRCode from 'react-native-qrcode-svg';

/**
 * QR Code Screen Props Interface
 * Defines the navigation and route parameters for the QR Code screen
 */
interface QRCodeScreenProps {
  navigation: any;
  route: {
    params: {
      home: any; // Home object containing home information
    };
  };
}

const { width: screenWidth } = Dimensions.get('window');

/**
 * Access Type Interface
 * Defines different types of temporary access that can be granted
 */
interface AccessType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  maxUses?: number;
  durationHours?: number;
}

/**
 * Generated QR Code Interface
 * Defines the structure of a generated QR code
 */
interface GeneratedQRCode {
  id: string;
  homeId: string;
  accessType: string;
  maxUses?: number;
  durationHours?: number;
  startDateTime?: string;
  endDateTime?: string;
  createdAt: string;
  expiresAt: string;
  qrData: string;
  usedCount: number;
}

/**
 * QR Code Generator Screen Component
 * 
 * This screen provides QR code generation for temporary door access control.
 * Users can generate QR codes with different access types and send them to
 * friends/family for temporary access to their home.
 * 
 * Features:
 * - Generate QR codes with different access types
 * - Set usage limits (1 entry, 5 entries, unlimited)
 * - Set time-based access (hours, days)
 * - Share QR codes via text/email
 * - View generated QR codes
 */
const QRCodeScreen: React.FC<QRCodeScreenProps> = ({ navigation, route }) => {
  // Theme and user context
  const { isDark } = useTheme();
  const { user } = useUser();
  
  // Get home data from navigation params
  const { home } = route.params;
  
  // State management
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<GeneratedQRCode | null>(null);
  const [selectedAccessType, setSelectedAccessType] = useState<AccessType | null>(null);
  const [generatedQRCodes, setGeneratedQRCodes] = useState<GeneratedQRCode[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [startHour, setStartHour] = useState<string>('12');
  const [startMinute, setStartMinute] = useState<string>('00');
  const [startAmPm, setStartAmPm] = useState<string>('PM');
  const [endDate, setEndDate] = useState<string>('');
  const [endHour, setEndHour] = useState<string>('12');
  const [endMinute, setEndMinute] = useState<string>('00');
  const [endAmPm, setEndAmPm] = useState<string>('PM');

  /**
   * Convert 12-hour time to 24-hour format
   */
  const convertTo24Hour = (hour: string, minute: string, amPm: string): string => {
    let hour24 = parseInt(hour);
    if (amPm === 'AM' && hour24 === 12) {
      hour24 = 0;
    } else if (amPm === 'PM' && hour24 !== 12) {
      hour24 += 12;
    }
    return `${hour24.toString().padStart(2, '0')}:${minute}`;
  };

  /**
   * Format date for display (MM/DD/YYYY h:mm AM/PM)
   */
  const formatDateTime = (date: Date): string => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours24 = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const period = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
      
      return `${month}/${day}/${year} ${hours12}:${minutes} ${period}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  /**
   * Convert Date to ISO string
   */
  const dateToISO = (date: Date): string => {
    try {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch (error) {
      console.error('Error converting date to ISO:', error);
      return new Date().toISOString();
    }
  };

  /**
   * Safely parse stored MM/DD/YYYY HH:mm (24h) strings to Date
   */
  const parseStoredDateTime = (value?: string | null): Date | null => {
    try {
      if (!value) return null;
      // Expecting "MM/DD/YYYY HH:mm"
      const [datePart, timePart] = value.split(' ');
      if (!datePart || !timePart) return null;
      const [mm, dd, yyyy] = datePart.split('/').map((v) => parseInt(v, 10));
      const [hh, min] = timePart.split(':').map((v) => parseInt(v, 10));
      if (!mm || !dd || !yyyy || isNaN(hh) || isNaN(min)) return null;
      return new Date(yyyy, mm - 1, dd, hh, min);
    } catch {
      return null;
    }
  };

  // Available access types
  const accessTypes: AccessType[] = [
    {
      id: 'single',
      name: 'Single Entry',
      description: 'One-time access only',
      icon: 'key',
      color: 'bg-green-500',
      maxUses: 1
    },
    {
      id: 'datetime',
      name: 'Date & Time Range',
      description: 'Access from start to end date/time',
      icon: 'calendar',
      color: 'bg-blue-500'
    }
  ];

  /**
   * Generate QR Code Data
   * Creates a unique QR code data string with home ID, user ID, access type, and timestamp
   */
  const generateQRCodeData = (accessType: AccessType): string => {
    const timestamp = Date.now();
    let expiresAt = timestamp + (24 * 60 * 60 * 1000); // Default 24 hours
    
    // For date/time range, use the end date/time
    if (accessType.id === 'datetime') {
      const parseDate = (dateStr: string, hour: string, minute: string, amPm: string) => {
        const [month, day, year] = dateStr.split('/');
        const time24 = convertTo24Hour(hour, minute, amPm);
        const [hour24, minute24] = time24.split(':');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour24), parseInt(minute24));
      };
      const endDateObj = parseDate(endDate, endHour, endMinute, endAmPm);
      expiresAt = endDateObj.getTime();
    }
    
    const qrData = {
      homeId: home.id,
      userId: user?.id,
      accessType: accessType.id,
      maxUses: accessType.maxUses,
      startDateTime: accessType.id === 'datetime' ? `${startDate} ${convertTo24Hour(startHour, startMinute, startAmPm)}` : null,
      endDateTime: accessType.id === 'datetime' ? `${endDate} ${convertTo24Hour(endHour, endMinute, endAmPm)}` : null,
      createdAt: timestamp,
      expiresAt: expiresAt,
      generatedBy: user?.firstName + ' ' + user?.lastName
    };
    
    return JSON.stringify(qrData);
  };

  /**
   * Generate QR Code
   * Creates a new QR code with the selected access type
   */
  const generateQRCode = () => {
    if (!selectedAccessType) {
      Alert.alert('Error', 'Please select an access type first');
      return;
    }

    // Validate date/time range if selected
    if (selectedAccessType.id === 'datetime') {
      if (!startDate || !endDate) {
        Alert.alert('Error', 'Please fill in all date fields');
        return;
      }

      // Parse dates more reliably by converting MM/DD/YYYY to YYYY-MM-DD format
      const parseDate = (dateStr: string, hour: string, minute: string, amPm: string) => {
        const [month, day, year] = dateStr.split('/');
        const time24 = convertTo24Hour(hour, minute, amPm);
        const [hour24, minute24] = time24.split(':');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour24), parseInt(minute24));
      };
      
      const startDateObj = parseDate(startDate, startHour, startMinute, startAmPm);
      const endDateObj = parseDate(endDate, endHour, endMinute, endAmPm);
      const now = new Date();

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        Alert.alert('Error', 'Please enter valid date and time');
        return;
      }

      if (startDateObj < now) {
        Alert.alert('Error', 'Start date/time must be in the future');
        return;
      }
      
      if (endDateObj <= startDateObj) {
        Alert.alert('Error', 'End date/time must be after start date/time');
        return;
      }
    }

    const qrData = generateQRCodeData(selectedAccessType);
    const now = new Date();
    
    // Create expiresAt date for datetime access type
    let expiresAt: Date;
    if (selectedAccessType.id === 'datetime') {
      const parseDate = (dateStr: string, hour: string, minute: string, amPm: string) => {
        const [month, day, year] = dateStr.split('/');
        const time24 = convertTo24Hour(hour, minute, amPm);
        const [hour24, minute24] = time24.split(':');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour24), parseInt(minute24));
      };
      expiresAt = parseDate(endDate, endHour, endMinute, endAmPm);
    } else {
      expiresAt = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Default 24 hours for single entry
    }

    const newQRCode: GeneratedQRCode = {
      id: `qr_${Date.now()}`,
      homeId: home.id,
      accessType: selectedAccessType.id,
      maxUses: selectedAccessType.maxUses,
      durationHours: selectedAccessType.durationHours,
      startDateTime: selectedAccessType.id === 'datetime' ? `${startDate} ${convertTo24Hour(startHour, startMinute, startAmPm)}` : undefined,
      endDateTime: selectedAccessType.id === 'datetime' ? `${endDate} ${convertTo24Hour(endHour, endMinute, endAmPm)}` : undefined,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      qrData: qrData,
      usedCount: 0
    };

    setGeneratedQR(newQRCode);
    setGeneratedQRCodes(prev => [newQRCode, ...prev]);
    setShowQRGenerator(false);
    setSelectedAccessType(null);
    setStartDate('');
    setStartHour('12');
    setStartMinute('00');
    setStartAmPm('PM');
    setEndDate('');
    setEndHour('12');
    setEndMinute('00');
    setEndAmPm('PM');
    
    // Removed success alert - the QR code list reflects creation immediately
  };

  /**
   * Share QR Code
   * Shares the generated QR code data via text/email
   */
  const shareQRCode = async (qrCode: GeneratedQRCode) => {
    try {
      const accessType = accessTypes.find(t => t.id === qrCode.accessType);
      let accessInfo = `Access Type: ${accessType?.name}\n`;
      
      if (qrCode.accessType === 'datetime') {
        const startDate = new Date(qrCode.startDateTime || qrCode.createdAt);
        const endDate = new Date(qrCode.expiresAt);
        accessInfo += `Access Period: ${startDate.toLocaleString()} - ${endDate.toLocaleString()}\n`;
      } else {
        accessInfo += `Expires: ${new Date(qrCode.expiresAt).toLocaleString()}\n`;
      }

      const shareMessage = `🏠 Home Access QR Code\n\n` +
        `Home: ${home.name}\n` +
        accessInfo +
        `\nQR Code Data:\n${qrCode.qrData}\n\n` +
        `Scan this QR code at the door to gain access.`;

      await Share.share({
        message: shareMessage,
        title: 'Home Access QR Code'
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  /**
   * Copy QR Code Data
   * Copies the QR code data to clipboard
   */
  const copyQRCodeData = (qrCode: GeneratedQRCode) => {
    // Note: In a real app, you'd use Clipboard from @react-native-clipboard/clipboard
    Alert.alert(
      'QR Code Data',
      qrCode.qrData,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Copy', onPress: () => console.log('Copied to clipboard:', qrCode.qrData) }
      ]
    );
  };

  /**
   * Check if QR Code is Expired
   * Determines if a QR code has expired based on its expiration time
   */
  const isQRCodeExpired = (qrCode: GeneratedQRCode): boolean => {
    return new Date(qrCode.expiresAt) < new Date();
  };

  /**
   * Check if QR Code is Used Up
   * Determines if a QR code has reached its usage limit
   */
  const isQRCodeUsedUp = (qrCode: GeneratedQRCode): boolean => {
    return qrCode.maxUses ? qrCode.usedCount >= qrCode.maxUses : false;
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
      {/* Header */}
      <View className={`flex-row items-center justify-between p-4 border-b ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2"
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
        <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          QR Code Access
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Home Info */}
        <View className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {home.name}
          </Text>
          <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {home.address}
          </Text>
        </View>

        {/* Generate QR Code Button */}
        <TouchableOpacity
          onPress={() => setShowQRGenerator(true)}
          className={`p-4 rounded-xl mb-6 ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="qr-code" size={24} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Generate QR Code
            </Text>
          </View>
        </TouchableOpacity>

        {/* Generated QR Codes */}
        {generatedQRCodes.length > 0 && (
          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Generated QR Codes
            </Text>
            {generatedQRCodes.map((qrCode) => {
              const accessType = accessTypes.find(t => t.id === qrCode.accessType);
              const isExpired = isQRCodeExpired(qrCode);
              const isUsedUp = isQRCodeUsedUp(qrCode);
              const isActive = !isExpired && !isUsedUp;

              return (
                <View
                  key={qrCode.id}
                  className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-neutral-800' : 'bg-white'} ${
                    !isActive ? 'opacity-50' : ''
                  }`}
                  style={{ minHeight: 420 }}
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                      <View className={`p-2 rounded-lg ${accessType?.color || 'bg-gray-500'}`}>
                        <Ionicons name={accessType?.icon as any || 'key'} size={20} color="white" />
                      </View>
                      <View className="ml-3">
                        <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {accessType?.name}
                        </Text>
                        <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {accessType?.description}
                        </Text>
                      </View>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${
                      isActive ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        isActive ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {isExpired ? 'Expired' : isUsedUp ? 'Used Up' : 'Active'}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-1 items-center justify-center">
                    <View className="mb-3 items-center">
                      <QRCode
                        value={qrCode.qrData}
                        size={220}
                        color={isDark ? '#ffffff' : '#000000'}
                        backgroundColor={isDark ? '#1f2937' : '#ffffff'}
                      />
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 pr-3">
                      <Text className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'} mb-1`}>
                        Created: {new Date(qrCode.createdAt).toLocaleDateString()}
                      </Text>
                      {qrCode.accessType === 'datetime' ? (
                        <Text className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'} mb-1`}>
                          {(() => {
                            const start = parseStoredDateTime(qrCode.startDateTime);
                            const end = parseStoredDateTime(qrCode.endDateTime) || new Date(qrCode.expiresAt);
                            const startText = start ? formatDateTime(start) : 'Invalid Date';
                            const endText = end ? formatDateTime(end) : 'Invalid Date';
                            return `Period: ${startText} - ${endText}`;
                          })()}
                        </Text>
                      ) : (
                        <Text className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'} mb-1`}>
                          Expires: {formatDateTime(new Date(qrCode.expiresAt))}
                        </Text>
                      )}
                      {qrCode.maxUses && (
                        <Text className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          Uses: {qrCode.usedCount}/{qrCode.maxUses}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row space-x-3">
                      <TouchableOpacity
                        onPress={() => shareQRCode(qrCode)}
                        className="px-4 py-3 rounded-lg bg-blue-500"
                      >
                        <Text className="text-white font-semibold">Send</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => copyQRCodeData(qrCode)}
                        className={`${isDark ? 'bg-neutral-700' : 'bg-neutral-200'} px-4 py-3 rounded-lg`}
                      >
                        <Text className={`${isDark ? 'text-white' : 'text-neutral-900'} font-semibold`}>Copy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Instructions - only show when no QR codes yet */}
        {generatedQRCodes.length === 0 && (
          <View className={`p-4 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              How to Use
            </Text>
            <View className="space-y-2">
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                1. Generate a QR code with your desired access type
              </Text>
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                2. Share the QR code with friends/family via text or email
              </Text>
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                3. They can scan the QR code at your door to gain access
              </Text>
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                4. QR codes automatically expire based on the access type
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* QR Code Generator Modal */}
      <Modal
        visible={showQRGenerator}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
          {/* Modal Header */}
          <View className={`flex-row items-center justify-between p-4 border-b ${isDark ? 'border-neutral-700' : 'border-neutral-200'}`}>
            <TouchableOpacity
              onPress={() => {
                setShowQRGenerator(false);
                setSelectedAccessType(null);
              }}
              className="p-2"
            >
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Select Access Type
            </Text>
            <View className="w-8" />
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Access Type Options */}
            {accessTypes.map((accessType) => (
              <TouchableOpacity
                key={accessType.id}
                onPress={() => setSelectedAccessType(accessType)}
                className={`p-4 rounded-xl mb-3 border-2 ${
                  selectedAccessType?.id === accessType.id
                    ? isDark ? 'border-blue-500 bg-blue-900' : 'border-blue-500 bg-blue-50'
                    : isDark ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-white'
                }`}
              >
                <View className="flex-row items-center">
                  <View className={`p-3 rounded-lg ${accessType.color}`}>
                    <Ionicons name={accessType.icon as any} size={24} color="white" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {accessType.name}
                    </Text>
                    <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {accessType.description}
                    </Text>
                  </View>
                  {selectedAccessType?.id === accessType.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Date/Time Picker Fields */}
            {selectedAccessType?.id === 'datetime' && (
              <View className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-neutral-800' : 'bg-gray-50'}`}>
                <Text className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Set Access Period
                </Text>
                <View className="space-y-4">
                {/* Start Date/Time */}
                <View>
                  <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Start Date & Time
                  </Text>
                  <TextInput
                    value={startDate}
                    onChangeText={setStartDate}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    className={`mb-2 p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white' 
                        : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                  <View className="flex-row space-x-2">
                    {/* Hour Picker */}
                    <View className="flex-1">
                      <Text className={`text-xs mb-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Hour</Text>
                      <TextInput
                        value={startHour}
                        onChangeText={(text) => {
                          // Allow empty string or valid numbers 1-12
                          if (text === '') {
                            setStartHour('');
                          } else {
                            const num = parseInt(text);
                            if (!isNaN(num) && num >= 1 && num <= 12) {
                              setStartHour(text);
                            }
                          }
                        }}
                        placeholder="12"
                        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                        keyboardType="numeric"
                        maxLength={2}
                        className={`p-2 rounded-lg border text-center ${
                          isDark ? 'bg-neutral-700 border-neutral-600 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                        }`}
                      />
                    </View>

                    {/* Minute Picker */}
                    <View className="flex-1">
                      <Text className={`text-xs mb-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Minute</Text>
                      <TextInput
                        value={startMinute}
                        onChangeText={(text) => {
                          // Allow empty string or valid numbers 0-59
                          if (text === '') {
                            setStartMinute('');
                          } else {
                            const num = parseInt(text);
                            if (!isNaN(num) && num >= 0 && num <= 59) {
                              setStartMinute(text);
                            }
                          }
                        }}
                        onBlur={() => {
                          // Only pad with zeros when user finishes editing
                          if (startMinute && startMinute.length === 1) {
                            setStartMinute(startMinute.padStart(2, '0'));
                          }
                        }}
                        placeholder="00"
                        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                        keyboardType="numeric"
                        maxLength={2}
                        className={`p-2 rounded-lg border text-center ${
                          isDark ? 'bg-neutral-700 border-neutral-600 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                        }`}
                      />
                    </View>

                    {/* AM/PM Picker */}
                    <View className="flex-1">
                      <Text className={`text-xs mb-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>AM/PM</Text>
                      <TouchableOpacity
                        onPress={() => setStartAmPm(startAmPm === 'AM' ? 'PM' : 'AM')}
                        className={`p-2 rounded-lg border ${
                          isDark ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-neutral-300'
                        }`}
                      >
                        <Text className={`text-center ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {startAmPm}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* End Date/Time */}
                <View>
                  <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    End Date & Time
                  </Text>
                  <TextInput
                    value={endDate}
                    onChangeText={setEndDate}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                    className={`mb-2 p-3 rounded-lg border ${
                      isDark 
                        ? 'bg-neutral-700 border-neutral-600 text-white' 
                        : 'bg-white border-neutral-300 text-neutral-900'
                    }`}
                  />
                  <View className="flex-row space-x-2">
                    {/* Hour Picker */}
                    <View className="flex-1">
                      <Text className={`text-xs mb-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Hour</Text>
                      <TextInput
                        value={endHour}
                        onChangeText={(text) => {
                          // Allow empty string or valid numbers 1-12
                          if (text === '') {
                            setEndHour('');
                          } else {
                            const num = parseInt(text);
                            if (!isNaN(num) && num >= 1 && num <= 12) {
                              setEndHour(text);
                            }
                          }
                        }}
                        placeholder="12"
                        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                        keyboardType="numeric"
                        maxLength={2}
                        className={`p-2 rounded-lg border text-center ${
                          isDark ? 'bg-neutral-700 border-neutral-600 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                        }`}
                      />
                    </View>

                    {/* Minute Picker */}
                    <View className="flex-1">
                      <Text className={`text-xs mb-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Minute</Text>
                      <TextInput
                        value={endMinute}
                        onChangeText={(text) => {
                          // Allow empty string or valid numbers 0-59
                          if (text === '') {
                            setEndMinute('');
                          } else {
                            const num = parseInt(text);
                            if (!isNaN(num) && num >= 0 && num <= 59) {
                              setEndMinute(text);
                            }
                          }
                        }}
                        onBlur={() => {
                          // Only pad with zeros when user finishes editing
                          if (endMinute && endMinute.length === 1) {
                            setEndMinute(endMinute.padStart(2, '0'));
                          }
                        }}
                        placeholder="00"
                        placeholderTextColor={isDark ? '#9ca3af' : '#6b7280'}
                        keyboardType="numeric"
                        maxLength={2}
                        className={`p-2 rounded-lg border text-center ${
                          isDark ? 'bg-neutral-700 border-neutral-600 text-white' : 'bg-white border-neutral-300 text-neutral-900'
                        }`}
                      />
                    </View>

                    {/* AM/PM Picker */}
                    <View className="flex-1">
                      <Text className={`text-xs mb-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>AM/PM</Text>
                      <TouchableOpacity
                        onPress={() => setEndAmPm(endAmPm === 'AM' ? 'PM' : 'AM')}
                        className={`p-2 rounded-lg border ${
                          isDark ? 'bg-neutral-700 border-neutral-600' : 'bg-white border-neutral-300'
                        }`}
                      >
                        <Text className={`text-center ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                          {endAmPm}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                </View>

                {/* Current Selection Display */}
                <View className={`p-3 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-50'}`}>
                  <Text className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
                    Selected Period:
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    From: {startDate} {startHour}:{startMinute} {startAmPm}{'\n'}
                    To: {endDate} {endHour}:{endMinute} {endAmPm}
                  </Text>
                </View>
              </View>
            )}

            {/* Generate Button */}
            <TouchableOpacity
              onPress={generateQRCode}
              disabled={!selectedAccessType}
              className={`p-4 rounded-xl mt-6 ${
                selectedAccessType
                  ? isDark ? 'bg-blue-600' : 'bg-blue-500'
                  : isDark ? 'bg-neutral-700' : 'bg-neutral-300'
              }`}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Generate QR Code
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

export default QRCodeScreen;