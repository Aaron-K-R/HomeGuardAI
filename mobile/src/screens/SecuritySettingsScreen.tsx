import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Switch,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Home } from '../types/Home';
import { securitySettingsService, SecuritySettingsRequest, SecuritySettingsResponse } from '../services/SecuritySettingsService';

interface SecuritySettingsScreenProps {
  navigation: any;
  route: {
    params: {
      home: Home;
    };
  };
}

const SecuritySettingsScreen: React.FC<SecuritySettingsScreenProps> = ({ navigation, route }) => {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { home } = route.params;
  
  const [settings, setSettings] = useState<SecuritySettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load security settings on mount
  useEffect(() => {
    loadSecuritySettings();
  }, [home.id]);

  const loadSecuritySettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await securitySettingsService.getSecuritySettingsByHomeId(home.id);
      setSettings(response);
    } catch (err) {
      console.error('Error loading security settings:', err);
      setError('Failed to load security settings');
      // Create default settings if none exist
      setSettings({
        id: '',
        homeId: home.id,
        homeName: home.name,
        homeAddress: home.address,
        ownerId: user?.id || '',
        ownerName: user?.firstName + ' ' + user?.lastName || '',
        ownerEmail: user?.email || '',
        motionDetectionEnabled: true,
        doorSensorEnabled: true,
        windowSensorEnabled: true,
        cameraRecordingEnabled: true,
        nightVisionEnabled: true,
        alarmSensitivityLevel: 5,
        autoArmTime: '22:00',
        autoDisarmTime: '07:00',
        emergencyContactsNotified: true,
        policeNotificationEnabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        hasAutoArming: true,
        hasCustomAlert: false,
        securityLevel: 'basic'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSecuritySettings = useCallback(async (updatedSettings: Partial<SecuritySettingsRequest>) => {
    if (!settings) return;
    
    try {
      if (settings.id) {
        // Update existing settings
        const response = await securitySettingsService.updateSecuritySettings(settings.id, updatedSettings);
        setSettings(response);
      } else {
        // Create new settings
        const response = await securitySettingsService.createSecuritySettings(home.id, {
          motionDetectionEnabled: updatedSettings.motionDetectionEnabled ?? settings.motionDetectionEnabled,
          doorSensorEnabled: updatedSettings.doorSensorEnabled ?? settings.doorSensorEnabled,
          windowSensorEnabled: updatedSettings.windowSensorEnabled ?? settings.windowSensorEnabled,
          cameraRecordingEnabled: updatedSettings.cameraRecordingEnabled ?? settings.cameraRecordingEnabled,
          nightVisionEnabled: updatedSettings.nightVisionEnabled ?? settings.nightVisionEnabled,
          alarmSensitivityLevel: updatedSettings.alarmSensitivityLevel ?? settings.alarmSensitivityLevel,
          autoArmTime: updatedSettings.autoArmTime ?? settings.autoArmTime,
          autoDisarmTime: updatedSettings.autoDisarmTime ?? settings.autoDisarmTime,
          emergencyContactsNotified: updatedSettings.emergencyContactsNotified ?? settings.emergencyContactsNotified,
          policeNotificationEnabled: updatedSettings.policeNotificationEnabled ?? settings.policeNotificationEnabled,
        });
        setSettings(response);
      }
    } catch (err) {
      console.error('Error saving security settings:', err);
      Alert.alert('Error', 'Failed to save security settings');
    }
  }, [settings, home.id]);


  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {
          if (settings) {
            saveSecuritySettings({
              motionDetectionEnabled: true,
              doorSensorEnabled: true,
              windowSensorEnabled: true,
              cameraRecordingEnabled: true,
              nightVisionEnabled: true,
              alarmSensitivityLevel: 5,
              autoArmTime: '22:00',
              autoDisarmTime: '07:00',
              emergencyContactsNotified: true,
              policeNotificationEnabled: false,
            });
          }
        }}
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

  const ArmModeSelector = () => {
    if (!settings) return null;
    
    return (
      <View className="mb-6">
        <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Security Level: {settings.securityLevel.toUpperCase()}
        </Text>
        <View className="flex-row space-x-2">
          {['basic', 'standard', 'premium'].map(level => (
            <TouchableOpacity
              key={level}
              className={`flex-1 p-3 rounded-xl border-2 ${
                settings.securityLevel === level
                  ? (isDark ? 'border-primary-600 bg-primary-600' : 'border-primary-500 bg-primary-500')
                  : (isDark ? 'border-neutral-700' : 'border-neutral-200')
              }`}
              onPress={() => {
                // Security level is computed based on enabled features
                Alert.alert('Info', 'Security level is automatically determined by your enabled features');
              }}
            >
              <Text className={`text-center font-semibold ${
                settings.securityLevel === level
                  ? 'text-white'
                  : (isDark ? 'text-neutral-300' : 'text-neutral-700')
              }`}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const NotificationSettings = () => {
    if (!settings) return null;
    
    return (
      <View className="mb-6">
        <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
          Notifications
        </Text>
        
        <SettingRow
          title="Emergency Contacts"
          subtitle="Notify emergency contacts when alarm is triggered"
          icon="people"
          rightElement={
            <Switch
              value={settings.emergencyContactsNotified}
              onValueChange={(value) => saveSecuritySettings({ emergencyContactsNotified: value })}
              trackColor={{ false: '#767577', true: '#3b82f6' }}
              thumbColor={settings.emergencyContactsNotified ? '#ffffff' : '#f4f3f4'}
            />
          }
        />
        
        <SettingRow
          title="Police Notification"
          subtitle="Automatically notify police when alarm is triggered"
          icon="shield"
          rightElement={
            <Switch
              value={settings.policeNotificationEnabled}
              onValueChange={(value) => saveSecuritySettings({ policeNotificationEnabled: value })}
              trackColor={{ false: '#767577', true: '#3b82f6' }}
              thumbColor={settings.policeNotificationEnabled ? '#ffffff' : '#f4f3f4'}
            />
          }
        />
      </View>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDark ? '#3b82f6' : '#3b82f6'} />
          <Text className={`mt-4 text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Loading security settings...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !settings) {
    return (
      <SafeAreaView className={`flex-1 ${isDark ? 'bg-neutral-900' : 'bg-neutral-50'}`}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="warning" size={48} color={isDark ? '#ef4444' : '#ef4444'} />
          <Text className={`mt-4 text-lg font-semibold text-center ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            {error}
          </Text>
          <TouchableOpacity
            className={`mt-4 py-3 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
            onPress={loadSecuritySettings}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!settings) return null;

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
              Security Settings
            </Text>
            <Text className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {home.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleReset}>
          <Ionicons 
            name="refresh" 
            size={24} 
            color={isDark ? '#ef4444' : '#ef4444'} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Security Level */}
        <ArmModeSelector />

        {/* Security Features */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Security Features
          </Text>
          
          <SettingRow
            title="Motion Detection"
            subtitle="Detect movement in monitored areas"
            icon="eye"
            rightElement={
              <Switch
                value={settings.motionDetectionEnabled}
                onValueChange={(value) => saveSecuritySettings({ motionDetectionEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.motionDetectionEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Door Sensors"
            subtitle="Monitor door openings and closings"
            icon="home"
            rightElement={
              <Switch
                value={settings.doorSensorEnabled}
                onValueChange={(value) => saveSecuritySettings({ doorSensorEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.doorSensorEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Window Sensors"
            subtitle="Monitor window openings and closings"
            icon="square"
            rightElement={
              <Switch
                value={settings.windowSensorEnabled}
                onValueChange={(value) => saveSecuritySettings({ windowSensorEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.windowSensorEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Camera Recording"
            subtitle="Record video when motion is detected"
            icon="videocam"
            rightElement={
              <Switch
                value={settings.cameraRecordingEnabled}
                onValueChange={(value) => saveSecuritySettings({ cameraRecordingEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.cameraRecordingEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Night Vision"
            subtitle="Enable night vision for cameras"
            icon="moon"
            rightElement={
              <Switch
                value={settings.nightVisionEnabled}
                onValueChange={(value) => saveSecuritySettings({ nightVisionEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.nightVisionEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Alarm Sensitivity */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Alarm Sensitivity
          </Text>
          
          <SettingRow
            title="Sensitivity Level"
            subtitle={`Level ${settings.alarmSensitivityLevel} of 10`}
            icon="speedometer"
            onPress={() => Alert.alert('Sensitivity', 'Sensitivity adjustment coming soon!')}
          />
        </View>

        {/* Auto Arm Settings */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Auto Arm Settings
          </Text>
          
          <SettingRow
            title="Auto Arm Time"
            subtitle={settings.autoArmTime ? `Arm at ${settings.autoArmTime}` : 'Not set'}
            icon="time"
            onPress={() => Alert.alert('Time Picker', 'Time picker coming soon!')}
          />
          
          <SettingRow
            title="Auto Disarm Time"
            subtitle={settings.autoDisarmTime ? `Disarm at ${settings.autoDisarmTime}` : 'Not set'}
            icon="time-outline"
            onPress={() => Alert.alert('Time Picker', 'Time picker coming soon!')}
          />
        </View>

        {/* Notification Settings */}
        <NotificationSettings />
      </ScrollView>

    </SafeAreaView>
  );
};

export default SecuritySettingsScreen;
