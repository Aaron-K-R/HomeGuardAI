import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface TermsOfServiceScreenProps {
  navigation: any;
}

const TermsOfServiceScreen: React.FC<TermsOfServiceScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mb-6"
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? '#ffffff' : '#000000'} 
          />
        </TouchableOpacity>
        
        <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Terms of Service
        </Text>
        <Text className={`text-base ${isDark ? 'text-neutral-300' : 'text-neutral-600'} mb-6`}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="space-y-8 pb-8">
          
          {/* Introduction */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              1. Introduction
            </Text>
            <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Welcome to HomeGuard AI ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our smart home security application and services. By using HomeGuard AI, you agree to be bound by these Terms.
            </Text>
          </View>

          {/* Service Description */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              2. Service Description
            </Text>
            <Text className={`text-base leading-6 mb-4 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              HomeGuard AI provides intelligent home security services including:
            </Text>
            <View className="ml-4 space-y-2">
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Live camera monitoring and recording
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Facial recognition and access control
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Real-time security alerts and notifications
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • AI-powered threat detection and analysis
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Remote monitoring and control capabilities
              </Text>
            </View>
          </View>

          {/* User Responsibilities */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              3. User Responsibilities
            </Text>
            <Text className={`text-base leading-6 mb-4 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              You agree to:
            </Text>
            <View className="ml-4 space-y-2">
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Provide accurate and complete information during registration
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Maintain the security of your account credentials
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Use the service only for lawful purposes
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Comply with all applicable local, state, and federal laws
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Not attempt to circumvent security measures or access controls
              </Text>
            </View>
          </View>

          {/* Privacy and Data Collection */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              4. Privacy and Data Collection
            </Text>
            <Text className={`text-base leading-6 mb-4 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              We collect and process the following types of data:
            </Text>
            <View className="ml-4 space-y-2">
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Biometric data (facial recognition templates)
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Video and audio recordings from security cameras
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Device information and usage analytics
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Location data (if enabled)
              </Text>
            </View>
            <Text className={`text-base leading-6 mt-4 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              All data is encrypted and stored securely. We do not sell your personal information to third parties.
            </Text>
          </View>

          {/* AI and Machine Learning */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              5. AI and Machine Learning
            </Text>
            <Text className={`text-base leading-6 mb-4 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Our AI systems are designed to:
            </Text>
            <View className="ml-4 space-y-2">
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Identify known individuals through facial recognition
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Detect suspicious activities and potential threats
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Learn from user behavior patterns to improve accuracy
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Provide personalized security recommendations
              </Text>
            </View>
            <Text className={`text-base leading-6 mt-4 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              AI decisions are not infallible. Users should not rely solely on AI recommendations for security decisions.
            </Text>
          </View>

          {/* Prohibited Uses */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              6. Prohibited Uses
            </Text>
            <Text className={`text-base leading-6 mb-4 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              You may not use HomeGuard AI to:
            </Text>
            <View className="ml-4 space-y-2">
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Monitor individuals without their consent
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Violate privacy laws or regulations
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Harass, intimidate, or threaten others
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Record in private areas (bathrooms, bedrooms) without consent
              </Text>
              <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                • Use the service for commercial surveillance without proper authorization
              </Text>
            </View>
          </View>

          {/* Service Availability */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              7. Service Availability
            </Text>
            <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. Maintenance windows will be announced in advance when possible. We are not liable for service interruptions due to technical issues, natural disasters, or other circumstances beyond our control.
            </Text>
          </View>

          {/* Limitation of Liability */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              8. Limitation of Liability
            </Text>
            <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              HomeGuard AI is provided "as is" without warranties. We are not liable for any damages arising from the use of our service, including but not limited to security breaches, false alarms, or system failures. Our total liability shall not exceed the amount paid for the service in the 12 months preceding the claim.
            </Text>
          </View>

          {/* Termination */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              9. Termination
            </Text>
            <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Either party may terminate this agreement at any time. Upon termination, your access to the service will be revoked, and your data will be deleted within 30 days unless required to be retained by law.
            </Text>
          </View>

          {/* Changes to Terms */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              10. Changes to Terms
            </Text>
            <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              We may update these Terms from time to time. We will notify you of significant changes via email or through the app. Continued use of the service after changes constitutes acceptance of the new Terms.
            </Text>
          </View>

          {/* Contact Information */}
          <View>
            <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              11. Contact Information
            </Text>
            <Text className={`text-base leading-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              For questions about these Terms, please contact us at:
            </Text>
            <View className="ml-4 mt-2 space-y-1">
              <Text className={`text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Email: legal@homeguardai.com
              </Text>
              <Text className={`text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Phone: 1-800-HOMEGUARD
              </Text>
              <Text className={`text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Address: 123 Security Drive, Tech City, TC 12345
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
        <TouchableOpacity
          className={`py-4 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white text-lg font-semibold text-center">
            I Understand
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;
