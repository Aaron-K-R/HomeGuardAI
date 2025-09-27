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
  Image,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface FaceProfile {
  id: string;
  name: string;
  image: string;
  confidence: number;
  isActive: boolean;
  lastSeen: string;
  accessCount: number;
  enrollmentMethod: 'manual' | 'automatic';
  faceFeatures: string;
}

interface FaceDetectionScreenProps {
  navigation: any;
  route: {
    params: {
      home: any;
    };
  };
}

const FaceDetectionScreen: React.FC<FaceDetectionScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { home } = route.params;
  
  const [faceProfiles, setFaceProfiles] = useState<FaceProfile[]>([
    {
      id: '1',
      name: 'John Doe',
      image: 'https://via.placeholder.com/100x100/3b82f6/ffffff?text=JD',
      confidence: 95,
      isActive: true,
      lastSeen: '2 minutes ago',
      accessCount: 127,
      enrollmentMethod: 'manual',
      faceFeatures: 'Encoded face features data...'
    },
    {
      id: '2',
      name: 'Jane Smith',
      image: 'https://via.placeholder.com/100x100/10b981/ffffff?text=JS',
      confidence: 88,
      isActive: true,
      lastSeen: '1 hour ago',
      accessCount: 89,
      enrollmentMethod: 'automatic',
      faceFeatures: 'Encoded face features data...'
    },
    {
      id: '3',
      name: 'Unknown Person',
      image: 'https://via.placeholder.com/100x100/ef4444/ffffff?text=?',
      confidence: 45,
      isActive: false,
      lastSeen: '3 days ago',
      accessCount: 1,
      enrollmentMethod: 'automatic',
      faceFeatures: 'Encoded face features data...'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [aiDetectionEnabled, setAiDetectionEnabled] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);

  const handleToggleProfile = (profileId: string) => {
    setFaceProfiles(prev => prev.map(profile => 
      profile.id === profileId 
        ? { ...profile, isActive: !profile.isActive }
        : profile
    ));
  };

  const handleDeleteProfile = (profileId: string) => {
    Alert.alert(
      'Delete Face Profile',
      'Are you sure you want to delete this face profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setFaceProfiles(prev => prev.filter(profile => profile.id !== profileId));
          }
        }
      ]
    );
  };

  const handleAddProfile = () => {
    if (!newProfileName.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    const newProfile: FaceProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      image: 'https://via.placeholder.com/100x100/6b7280/ffffff?text=?',
      confidence: 0,
      isActive: true,
      lastSeen: 'Never',
      accessCount: 0,
      enrollmentMethod: 'manual',
      faceFeatures: ''
    };

    setFaceProfiles([...faceProfiles, newProfile]);
    setNewProfileName('');
    setShowAddModal(false);
    setShowEnrollmentModal(true);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return isDark ? '#10b981' : '#059669';
    if (confidence >= 60) return isDark ? '#f59e0b' : '#d97706';
    return isDark ? '#ef4444' : '#dc2626';
  };

  const FaceProfileCard = ({ profile }: { profile: FaceProfile }) => (
    <View className={`p-6 rounded-2xl mb-4 border ${
      isDark 
        ? 'bg-neutral-800 border-neutral-700' 
        : 'bg-white border-neutral-200'
    }`}>
      <View className="flex-row items-start mb-4">
        <View className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <Image 
            source={{ uri: profile.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {profile.name}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {profile.enrollmentMethod === 'manual' ? 'Manual Enrollment' : 'Auto-Detected'}
              </Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${
              profile.isActive 
                ? (isDark ? 'bg-green-600' : 'bg-green-500')
                : (isDark ? 'bg-neutral-600' : 'bg-neutral-300')
            }`}>
              <Text className={`text-xs font-medium ${
                profile.isActive ? 'text-white' : (isDark ? 'text-neutral-300' : 'text-neutral-600')
              }`}>
                {profile.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Confidence and Stats */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Ionicons 
            name="eye" 
            size={16} 
            color={getConfidenceColor(profile.confidence)} 
          />
          <Text className={`text-sm ml-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {profile.confidence}% confidence
          </Text>
        </View>
        <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          {profile.accessCount} accesses
        </Text>
      </View>
      
      {/* Last Seen */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className={`text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
          Last seen: {profile.lastSeen}
        </Text>
        <View className="flex-row">
          <TouchableOpacity 
            className="p-2 mr-2"
            onPress={() => handleToggleProfile(profile.id)}
          >
            <Ionicons 
              name={profile.isActive ? "eye" : "eye-off"} 
              size={16} 
              color={isDark ? '#a3a3a3' : '#737373'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            className="p-2"
            onPress={() => handleDeleteProfile(profile.id)}
          >
            <Ionicons 
              name="trash-outline" 
              size={16} 
              color={isDark ? '#ef4444' : '#dc2626'} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const AddProfileModal = () => (
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
              Add Face Profile
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>
          
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Person Name
            </Text>
            <TextInput
              className={`p-4 rounded-xl border ${
                isDark 
                  ? 'bg-neutral-700 border-neutral-600 text-white' 
                  : 'bg-neutral-100 border-neutral-200 text-neutral-900'
              }`}
              placeholder="Enter person's name"
              placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
              value={newProfileName}
              onChangeText={setNewProfileName}
            />
          </View>
          
          <TouchableOpacity
            className={`py-4 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
            onPress={handleAddProfile}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Add Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const EnrollmentModal = () => (
    <Modal
      visible={showEnrollmentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEnrollmentModal(false)}
    >
      <View className="flex-1 justify-center bg-black/50 px-6">
        <View className={`rounded-2xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6`}>
          <View className="items-center mb-6">
            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
              isDark ? 'bg-primary-600' : 'bg-primary-500'
            }`}>
              <Ionicons name="camera" size={32} color="white" />
            </View>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Face Enrollment
            </Text>
            <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Position your face in front of the camera and look straight ahead
            </Text>
          </View>
          
          <View className="mb-6">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Enrollment Progress
            </Text>
            <View className={`h-2 rounded-full ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}>
              <View className="h-2 rounded-full bg-primary-500" style={{ width: '75%' }} />
            </View>
            <Text className={`text-xs mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              75% complete - 3 of 4 angles captured
            </Text>
          </View>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-xl border ${
                isDark ? 'border-neutral-600' : 'border-neutral-300'
              }`}
              onPress={() => setShowEnrollmentModal(false)}
            >
              <Text className={`text-center font-medium ${
                isDark ? 'text-neutral-300' : 'text-neutral-600'
              }`}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
              onPress={() => setShowEnrollmentModal(false)}
            >
              <Text className="text-white text-center font-medium">
                Complete
              </Text>
            </TouchableOpacity>
          </View>
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
              Face Recognition
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {home.name} • AI Detection
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
        {/* AI Detection Settings */}
        <View className={`p-6 rounded-2xl mb-6 border ${
          isDark 
            ? 'bg-neutral-800 border-neutral-700' 
            : 'bg-white border-neutral-200'
        }`}>
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                AI Detection
              </Text>
              <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Enable automatic face recognition
              </Text>
            </View>
            <Switch
              value={aiDetectionEnabled}
              onValueChange={setAiDetectionEnabled}
              trackColor={{ false: '#767577', true: '#3b82f6' }}
              thumbColor={aiDetectionEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Confidence Threshold: {confidenceThreshold}%
            </Text>
            <View className={`h-2 rounded-full ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'}`}>
              <View 
                className="h-2 rounded-full bg-primary-500" 
                style={{ width: `${confidenceThreshold}%` }} 
              />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-6">
          <View className={`flex-1 p-4 rounded-xl mr-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {faceProfiles.length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Face Profiles
            </Text>
          </View>
          <View className={`flex-1 p-4 rounded-xl ml-2 ${
            isDark ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {faceProfiles.filter(p => p.isActive).length}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Active
            </Text>
          </View>
        </View>

        {/* Face Profiles */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Face Profiles
          </Text>
          
          {faceProfiles.length === 0 ? (
            <View className={`p-8 rounded-xl ${isDark ? 'bg-neutral-800' : 'bg-white'} items-center`}>
              <Ionicons 
                name="person-outline" 
                size={48} 
                color={isDark ? '#a3a3a3' : '#737373'} 
              />
              <Text className={`text-lg font-medium mt-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                No face profiles yet
              </Text>
              <Text className={`text-sm text-center mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Add face profiles for automatic recognition
              </Text>
            </View>
          ) : (
            faceProfiles.map((profile) => (
              <FaceProfileCard key={profile.id} profile={profile} />
            ))
          )}
        </View>
      </ScrollView>

      <AddProfileModal />
      <EnrollmentModal />
    </SafeAreaView>
  );
};

export default FaceDetectionScreen;
