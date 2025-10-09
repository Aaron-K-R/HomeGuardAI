import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView,
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { signUp, isLoading } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    const { firstName, lastName, email, password, confirmPassword, phoneNumber } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    const response = await signUp({
      email,
      password,
      firstName,
      lastName,
      phoneNumber: phoneNumber || undefined,
    });
    
    if (response.success) {
      Alert.alert('Success', response.message || 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      Alert.alert('Error', response.error || 'Sign up failed');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-8">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mb-8"
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDark ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          
          <Text className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Create Account
          </Text>
          <Text className={`text-lg ${isDark ? 'text-neutral-300' : 'text-neutral-600'} mb-8`}>
            Join HomeGuard AI and secure your home
          </Text>
        </View>

        {/* Form */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="space-y-8">
            {/* First Name Field */}
            <View className="mb-6">
              <Text className={`text-sm font-semibold mb-3 ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
                First Name *
              </Text>
              <View className={`flex-row items-center border-2 rounded-xl px-4 py-4 ${
                isDark ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-200 bg-white'
              }`} style={{ minHeight: 56 }}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
                <TextInput
                  className={`flex-1 ml-3 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}
                  placeholder="First name"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={formData.firstName}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                  autoCapitalize="words"
                  style={{ 
                    textAlignVertical: 'center',
                    paddingVertical: 0,
                    includeFontPadding: false,
                    lineHeight: 24,
                    fontSize: 18,
                    marginBottom: 2
                  }}
                />
              </View>
            </View>

            {/* Last Name Field */}
            <View className="mb-6">
              <Text className={`text-sm font-semibold mb-3 ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
                Last Name *
              </Text>
              <View className={`flex-row items-center border-2 rounded-xl px-4 py-4 ${
                isDark ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-200 bg-white'
              }`} style={{ minHeight: 56 }}>
                <Ionicons 
                  name="person-outline" 
                  size={20} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
                <TextInput
                  className={`flex-1 ml-3 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}
                  placeholder="Last name"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={formData.lastName}
                  onChangeText={(value) => handleInputChange('lastName', value)}
                  autoCapitalize="words"
                  style={{ 
                    textAlignVertical: 'center',
                    paddingVertical: 0,
                    includeFontPadding: false,
                    lineHeight: 24,
                    fontSize: 18,
                    marginBottom: 2
                  }}
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
                Email Address *
              </Text>
              <View className={`flex-row items-center border-2 rounded-xl px-4 py-4 ${
                isDark ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-200 bg-white'
              }`} style={{ minHeight: 56 }}>
                <Ionicons 
                  name="mail-outline" 
                  size={20} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
                <TextInput
                  className={`flex-1 ml-3 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{ 
                    textAlignVertical: 'center',
                    paddingVertical: 0,
                    includeFontPadding: false,
                    lineHeight: 24,
                    fontSize: 18,
                    marginBottom: 2
                  }}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
                Phone Number (Optional)
              </Text>
              <View className={`flex-row items-center border-2 rounded-xl px-4 py-4 ${
                isDark ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-200 bg-white'
              }`} style={{ minHeight: 56 }}>
                <Ionicons 
                  name="call-outline" 
                  size={20} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
                <TextInput
                  className={`flex-1 ml-3 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}
                  placeholder="Enter your phone number"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={formData.phoneNumber}
                  onChangeText={(value) => handleInputChange('phoneNumber', value)}
                  keyboardType="phone-pad"
                  style={{ 
                    textAlignVertical: 'center',
                    paddingVertical: 0,
                    includeFontPadding: false,
                    lineHeight: 24,
                    fontSize: 18,
                    marginBottom: 2
                  }}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
                Password *
              </Text>
              <View className={`flex-row items-center border-2 rounded-xl px-4 py-4 ${
                isDark ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-200 bg-white'
              }`} style={{ minHeight: 56 }}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
                <TextInput
                  className={`flex-1 ml-3 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}
                  placeholder="Create a password"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  style={{ 
                    textAlignVertical: 'center',
                    paddingVertical: 0,
                    includeFontPadding: false,
                    lineHeight: 24,
                    fontSize: 18,
                    marginBottom: 2
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={isDark ? '#a3a3a3' : '#737373'} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-neutral-200' : 'text-neutral-700'}`}>
                Confirm Password *
              </Text>
              <View className={`flex-row items-center border-2 rounded-xl px-4 py-4 ${
                isDark ? 'border-neutral-600 bg-neutral-800' : 'border-neutral-200 bg-white'
              }`} style={{ minHeight: 56 }}>
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={isDark ? '#a3a3a3' : '#737373'} 
                />
                <TextInput
                  className={`flex-1 ml-3 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}
                  placeholder="Confirm your password"
                  placeholderTextColor={isDark ? '#a3a3a3' : '#737373'}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                  style={{ 
                    textAlignVertical: 'center',
                    paddingVertical: 0,
                    includeFontPadding: false,
                    lineHeight: 24,
                    fontSize: 18,
                    marginBottom: 2
                  }}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={isDark ? '#a3a3a3' : '#737373'} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Agreement */}
            <View className="flex-row items-start mt-2">
              <TouchableOpacity 
                className="flex-row items-start flex-1"
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                <View className={`w-5 h-5 rounded border-2 mr-3 mt-1 items-center justify-center ${
                  agreedToTerms 
                    ? (isDark ? 'bg-primary-600 border-primary-600' : 'bg-primary-500 border-primary-500')
                    : (isDark ? 'border-neutral-600' : 'border-neutral-300')
                }`}>
                  {agreedToTerms && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
                <Text className={`flex-1 text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  I agree to the{' '}
                  <Text className={`font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                    Terms of Service
                  </Text>
                  {' '}and{' '}
                  <Text className={`font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                    Privacy Policy
                  </Text>
                </Text>
              </TouchableOpacity>
              
              {/* Separate clickable Terms of Service link */}
              <TouchableOpacity 
                onPress={() => {
                  setAgreedToTerms(true);
                  navigation.navigate('TermsOfService');
                }}
                className="ml-2"
              >
                <Text className={`text-sm font-semibold underline ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                  View Terms
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`py-5 px-6 rounded-xl mt-12 mb-6 ${isDark ? 'bg-primary-600' : 'bg-primary-500'} ${
              isLoading ? 'opacity-50' : ''
            }`}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center mt-10 mb-6">
            <Text className={`text-base ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className={`text-base font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
