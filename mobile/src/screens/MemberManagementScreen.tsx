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
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Home } from '../types/Home';
import { homeInvitationService, HomeInvitationRequest, HomeInvitationResponse } from '../services/HomeInvitationService';

interface MemberManagementScreenProps {
  navigation: any;
  route: {
    params: {
      home: Home;
    };
  };
}

const MemberManagementScreen: React.FC<MemberManagementScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  
  // Early safety check - prevent any code execution if route params are not ready
  if (!route || !route.params) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  
  const { home } = route.params;
  
  // Safety check for home object
  if (!home || !home.id) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Home Not Found
          </Text>
          <Text className={`text-sm text-center ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Please select a home first
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-4 px-6 py-3 bg-primary-600 rounded-xl"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Home management states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitations, setInvitations] = useState<HomeInvitationResponse[]>([]);
  const [isHomeAdmin, setIsHomeAdmin] = useState(true); // TODO: Check actual admin status
  
  // Invitation form states
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  
  

  // Load data on mount
  useEffect(() => {
    if (isHomeAdmin) {
      loadInvitations();
    } else {
      setIsLoading(false);
    }
  }, [home.id, isHomeAdmin]);

  const loadInvitations = async () => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const responsePromise = homeInvitationService.getInvitationsByHomeId(home.id);
      const response = await Promise.race([responsePromise, timeoutPromise]);
      setInvitations(response as HomeInvitationResponse[]);
    } catch (err) {
      console.error('Error loading invitations:', err);
      setError('Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };


  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    try {
      setIsInviting(true);
      const invitation: HomeInvitationRequest = {
        email: inviteEmail.trim(),
        role: 'USER', // Only users can be invited, no admins
        message: inviteMessage.trim() || undefined,
      };

      await homeInvitationService.createInvitation(home.id, user?.id || '', invitation);
      
      Alert.alert('Success', 'Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteMessage('');
      loadInvitations();
    } catch (err) {
      console.error('Error sending invitation:', err);
      Alert.alert('Error', 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };




  const handleCancelInvitation = async (invitationId: string) => {
    Alert.alert(
      'Cancel Invitation',
      'Are you sure you want to cancel this invitation?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            try {
              await homeInvitationService.cancelInvitation(invitationId);
              loadInvitations();
            } catch (err) {
              console.error('Error canceling invitation:', err);
              Alert.alert('Error', 'Failed to cancel invitation');
            }
          }
        }
      ]
    );
  };



  const SettingRow = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    rightElement 
  }: {
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
        isDark ? 'border-neutral-700' : 'border-neutral-200'
      }`}
      onPress={onPress}
      disabled={!onPress}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
            isDark ? 'bg-primary-600' : 'bg-primary-500'
          }`}>
            <Ionicons name={icon} size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {title}
            </Text>
            {subtitle && (
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightElement || (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center px-6">
          <ActivityIndicator size="large" color={isDark ? '#3b82f6' : '#3b82f6'} />
          <Text className={`mt-4 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Loading member management...
          </Text>
          <Text className={`mt-2 text-sm text-center ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            This may take a moment
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
          <Ionicons name="alert-circle" size={64} color={isDark ? '#ef4444' : '#dc2626'} />
          <Text className={`mt-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Error Loading
          </Text>
          <Text className={`mt-2 text-sm text-center ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setError(null);
              setIsLoading(true);
              loadInvitations();
            }}
            className={`mt-4 px-6 py-3 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
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
              Member Management
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {home.name}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Member Management */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Member Management
          </Text>
          
          <SettingRow
            title="Invite Users"
            subtitle="Send invitations to join this home (Users only)"
            icon="person-add"
            onPress={() => setShowInviteModal(true)}
          />
          
          <SettingRow
            title="Manage Invitations"
            subtitle={`${invitations.length} pending invitations`}
            icon="mail"
            onPress={() => Alert.alert('Invitations', 'Invitation management coming soon!')}
          />
          
          <SettingRow
            title="Manage Users"
            subtitle="View and manage home users"
            icon="people"
            onPress={() => Alert.alert('Users', 'User management coming soon!')}
          />
          
          
        </View>

        {/* Person Management */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Person Management
          </Text>
          
          <SettingRow
            title="Manage People"
            subtitle="Add and manage people for this home"
            icon="people"
            onPress={() => navigation.navigate('ManagePeople', { home })}
          />
          <SettingRow
            title="Face Recognition"
            subtitle="View and manage face profiles"
            icon="person"
            onPress={() => navigation.navigate('FaceDetection', { home })}
          />
        </View>
        

        {/* Recent Invitations */}
        {invitations.length > 0 && (
          <View className="mb-6">
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Recent Invitations
            </Text>
            
            {invitations.slice(0, 3).map((invitation) => (
              <View key={invitation.id} className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${
                isDark ? 'border-neutral-700' : 'border-neutral-200'
              }`}>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {invitation.email}
                    </Text>
                    <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {invitation.isAccepted ? 'Accepted' : 'Pending'}
                    </Text>
                  </View>
                  {!invitation.isAccepted && (
                    <TouchableOpacity
                      onPress={() => handleCancelInvitation(invitation.id)}
                      className="p-2 rounded-full bg-red-500"
                    >
                      <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Invite User Modal */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <TouchableOpacity onPress={() => setShowInviteModal(false)}>
              <Text className={`text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}>Cancel</Text>
            </TouchableOpacity>
            <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Invite User
            </Text>
            <TouchableOpacity onPress={handleInviteUser} disabled={isInviting}>
              <Text className={`text-lg font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                {isInviting ? 'Sending...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-6 py-4">
            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Email Address
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Enter email address"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-4">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Role: User (Only users can be invited)
              </Text>
              <View className={`p-3 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`}>
                <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Invited users will have standard access to the home. Only the home creator is an admin.
                </Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Message (Optional)
              </Text>
              <TextInput
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-neutral-700 border-neutral-600 text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                }`}
                placeholder="Add a personal message"
                placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                value={inviteMessage}
                onChangeText={setInviteMessage}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MemberManagementScreen;
