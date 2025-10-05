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
  FlatList,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { AppSettings, AppSettingsUpdate } from '../types/AppSettings';
import { appSettingsService } from '../services/AppSettingsService';

interface AppSettingsScreenProps {
  navigation: any;
}

const AppSettingsScreen: React.FC<AppSettingsScreenProps> = ({ navigation }) => {
  const themeContext = useTheme();
  const { user, signOut } = useUser();
  
  // Safety check for theme context
  if (!themeContext) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#171717' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 16, fontSize: 18, fontWeight: '500', color: '#ffffff' }}>
          Loading...
        </Text>
      </View>
    );
  }
  
  const { isDark, toggleTheme, setThemePreference, theme } = themeContext;
  
  const [settings, setSettings] = useState<AppSettings>({
    userId: user?.id || '',
    theme: 'auto',
    language: 'en',
    notificationsEnabled: true,
    pushNotificationsEnabled: true,
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    biometricLoginEnabled: false,
    twoFactorEnabled: false,
    autoLockTimeout: 5,
    dataUsageWifiOnly: true,
    locationTrackingEnabled: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const timeoutOptions = [
    { value: 1, label: '1 minute' },
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
  ];

  useEffect(() => {
    loadAppSettings();
  }, []);

  // Sync theme preference when settings are loaded
  useEffect(() => {
    if (settings.theme) {
      setThemePreference(settings.theme as any);
    }
  }, [settings.theme, setThemePreference]);

  // Auto-save settings when they change (with debouncing)
  useEffect(() => {
    if (settings.userId && !isLoading) {
      const timeoutId = setTimeout(() => {
        saveAppSettings(settings);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [settings, isLoading]);

  const loadAppSettings = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await appSettingsService.getAppSettingsByUserId(user.id);
      setSettings(response);
    } catch (error) {
      console.error('Error loading app settings:', error);
      // If settings don't exist, use default settings
      const defaultSettings = appSettingsService.getDefaultSettings(user.id);
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAppSettings = async (updatedSettings: AppSettings) => {
    if (!user?.id) return;
    
    try {
      const updateData: AppSettingsUpdate = {
        theme: updatedSettings.theme,
        language: updatedSettings.language,
        notificationsEnabled: updatedSettings.notificationsEnabled,
        pushNotificationsEnabled: updatedSettings.pushNotificationsEnabled,
        emailNotificationsEnabled: updatedSettings.emailNotificationsEnabled,
        smsNotificationsEnabled: updatedSettings.smsNotificationsEnabled,
        locationTrackingEnabled: updatedSettings.locationTrackingEnabled,
        biometricLoginEnabled: updatedSettings.biometricLoginEnabled,
        twoFactorEnabled: updatedSettings.twoFactorEnabled,
        autoLockTimeout: updatedSettings.autoLockTimeout,
        dataUsageWifiOnly: updatedSettings.dataUsageWifiOnly,
      };
      
      await appSettingsService.updateAppSettingsByUserId(user.id, updateData);
    } catch (error) {
      console.error('Error saving app settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await signOut();
      
      if (response.success) {
        // Navigation handled automatically by AppNavigator
      } else {
        Alert.alert('Logout Error', response.error || 'Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', 'An unexpected error occurred during logout');
    }
  };

  const SettingRow = ({ 
    title, 
    subtitle, 
    icon, 
    onPress, 
    rightElement,
    showChevron = true
  }: {
    title: string;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
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
        {rightElement || (showChevron && (
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? '#a3a3a3' : '#737373'} 
          />
        ))}
      </View>
    </TouchableOpacity>
  );

  const LanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6`}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Select Language
            </Text>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>
          
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              className={`p-4 rounded-xl mb-2 ${
                settings.language === lang.code 
                  ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                  : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
              }`}
              onPress={() => {
                setSettings({ ...settings, language: lang.code as any });
                setShowLanguageModal(false);
              }}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">{lang.flag}</Text>
                <Text className={`font-semibold ${
                  settings.language === lang.code ? 'text-white' : (isDark ? 'text-white' : 'text-neutral-900')
                }`}>
                  {lang.name}
                </Text>
                {settings.language === lang.code && (
                  <Ionicons name="checkmark" size={20} color="white" className="ml-auto" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const TimeoutModal = () => (
    <Modal
      visible={showTimeoutModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTimeoutModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className={`rounded-t-3xl ${isDark ? 'bg-neutral-800' : 'bg-white'} p-6`}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Auto Lock Timeout
            </Text>
            <TouchableOpacity onPress={() => setShowTimeoutModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#000000'} />
            </TouchableOpacity>
          </View>
          
          {timeoutOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`p-4 rounded-xl mb-2 ${
                settings.autoLockTimeout === option.value 
                  ? (isDark ? 'bg-primary-600' : 'bg-primary-500')
                  : (isDark ? 'bg-neutral-700' : 'bg-neutral-100')
              }`}
              onPress={() => {
                setSettings({ ...settings, autoLockTimeout: option.value });
                setShowTimeoutModal(false);
              }}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`font-semibold ${
                  settings.autoLockTimeout === option.value ? 'text-white' : (isDark ? 'text-white' : 'text-neutral-900')
                }`}>
                  {option.label}
                </Text>
                {settings.autoLockTimeout === option.value && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </View>
            </TouchableOpacity>
          ))}
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
              App Settings
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Customize your experience
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View 
          key={`loading-${isDark}`}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? '#171717' : '#fafafa',
          }}
        >
          <ActivityIndicator 
            size="large" 
            color={isDark ? '#3b82f6' : '#2563eb'} 
          />
          <Text 
            style={{
              marginTop: 16,
              fontSize: 18,
              fontWeight: '500',
              color: isDark ? '#ffffff' : '#171717',
            }}
          >
            Loading settings...
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Appearance
          </Text>
          
          <SettingRow
            title="Theme"
            subtitle={settings.theme === 'auto' ? 'Auto (System)' : settings.theme === 'dark' ? 'Dark' : 'Light'}
            icon="color-palette"
            onPress={() => {
              const themes = ['light', 'dark', 'auto'];
              const currentIndex = themes.indexOf(settings.theme);
              const nextTheme = themes[(currentIndex + 1) % themes.length];
              setSettings({ ...settings, theme: nextTheme as any });
              
              // Apply theme change immediately
              setThemePreference(nextTheme as any);
            }}
          />
          
          <SettingRow
            title="Language"
            subtitle={languages.find(l => l.code === settings.language)?.name || 'English'}
            icon="language"
            onPress={() => setShowLanguageModal(true)}
          />
        </View>

        {/* Notifications */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Notifications
          </Text>
          
          <SettingRow
            title="Enable Notifications"
            subtitle="Receive app notifications"
            icon="notifications"
            rightElement={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => setSettings({ ...settings, notificationsEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.notificationsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
            showChevron={false}
          />
          
          {settings.notificationsEnabled && (
            <>
              <SettingRow
                title="Push Notifications"
                subtitle="Receive notifications on your device"
                icon="phone-portrait"
                rightElement={
                  <Switch
                    value={settings.pushNotificationsEnabled}
                    onValueChange={(value) => setSettings({ ...settings, pushNotificationsEnabled: value })}
                    trackColor={{ false: '#767577', true: '#3b82f6' }}
                    thumbColor={settings.pushNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
                  />
                }
                showChevron={false}
              />
              
              <SettingRow
                title="Email Notifications"
                subtitle="Receive notifications via email"
                icon="mail"
                rightElement={
                  <Switch
                    value={settings.emailNotificationsEnabled}
                    onValueChange={(value) => setSettings({ ...settings, emailNotificationsEnabled: value })}
                    trackColor={{ false: '#767577', true: '#3b82f6' }}
                    thumbColor={settings.emailNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
                  />
                }
                showChevron={false}
              />
              
              <SettingRow
                title="SMS Notifications"
                subtitle="Receive notifications via text message"
                icon="chatbubble"
                rightElement={
                  <Switch
                    value={settings.smsNotificationsEnabled}
                    onValueChange={(value) => setSettings({ ...settings, smsNotificationsEnabled: value })}
                    trackColor={{ false: '#767577', true: '#3b82f6' }}
                    thumbColor={settings.smsNotificationsEnabled ? '#ffffff' : '#f4f3f4'}
                  />
                }
                showChevron={false}
              />
            </>
          )}
        </View>

        {/* Security */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Security
          </Text>
          
          <SettingRow
            title="Biometric Login"
            subtitle="Use fingerprint or face recognition"
            icon="finger-print"
            rightElement={
              <Switch
                value={settings.biometricLoginEnabled}
                onValueChange={(value) => setSettings({ ...settings, biometricLoginEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.biometricLoginEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
            showChevron={false}
          />
          
          <SettingRow
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            icon="shield-checkmark"
            rightElement={
              <Switch
                value={settings.twoFactorEnabled}
                onValueChange={(value) => setSettings({ ...settings, twoFactorEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.twoFactorEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
            showChevron={false}
          />
          
          <SettingRow
            title="Auto Lock Timeout"
            subtitle={`${settings.autoLockTimeout} minute${settings.autoLockTimeout > 1 ? 's' : ''}`}
            icon="time"
            onPress={() => setShowTimeoutModal(true)}
          />
        </View>

        {/* Privacy & Data */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Privacy & Data
          </Text>
          
          <SettingRow
            title="Location Tracking"
            subtitle="Allow app to access your location"
            icon="location"
            rightElement={
              <Switch
                value={settings.locationTrackingEnabled}
                onValueChange={(value) => setSettings({ ...settings, locationTrackingEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.locationTrackingEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
            showChevron={false}
          />
          
          <SettingRow
            title="WiFi Only Data"
            subtitle="Use data only when connected to WiFi"
            icon="wifi"
            rightElement={
              <Switch
                value={settings.dataUsageWifiOnly}
                onValueChange={(value) => setSettings({ ...settings, dataUsageWifiOnly: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.dataUsageWifiOnly ? '#ffffff' : '#f4f3f4'}
              />
            }
            showChevron={false}
          />
        </View>

        {/* Account */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Account
          </Text>
          
          <SettingRow
            title="Profile"
            subtitle="Manage your profile information"
            icon="person"
            onPress={() => Alert.alert('Profile', 'Profile management coming soon!')}
          />
          
          <SettingRow
            title="Change Password"
            subtitle="Update your account password"
            icon="key"
            onPress={() => Alert.alert('Change Password', 'Password change coming soon!')}
          />
          
          <SettingRow
            title="Sign Out"
            subtitle="Sign out of your account"
            icon="log-out"
            onPress={() => {
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign Out', style: 'destructive', onPress: handleLogout }
                ]
              );
            }}
          />
          
          <SettingRow
            title="Delete Account"
            subtitle="Permanently delete your account"
            icon="trash"
            onPress={() => Alert.alert('Delete Account', 'Account deletion coming soon!')}
          />
        </View>

        {/* About */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            About
          </Text>
          
          <SettingRow
            title="App Version"
            subtitle="1.0.0"
            icon="information-circle"
            showChevron={false}
          />
          
          <SettingRow
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            icon="document-text"
            onPress={() => navigation.navigate('TermsOfService')}
          />
          
          <SettingRow
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            icon="shield"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon!')}
          />
          
          <SettingRow
            title="Support"
            subtitle="Get help and contact support"
            icon="help-circle"
            onPress={() => Alert.alert('Support', 'Support coming soon!')}
          />
        </View>
      </ScrollView>
      )}

      {/* Modals */}
      <LanguageModal />
      <TimeoutModal />
    </SafeAreaView>
  );
};

export default AppSettingsScreen;
