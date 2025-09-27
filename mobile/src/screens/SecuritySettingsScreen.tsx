import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Alert,
  Switch 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { Home, SecuritySettings } from '../types/Home';

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
  
  const [settings, setSettings] = useState<SecuritySettings>({
    homeId: home.id,
    armMode: 'away',
    motionDetection: true,
    doorSensors: true,
    windowSensors: true,
    cameraRecording: true,
    nightVision: true,
    alertsEnabled: true,
    silentMode: false,
    autoArm: false,
    autoArmTime: '22:00',
    emergencyContacts: ['+1-555-0123', '+1-555-0456'],
    notificationSettings: {
      push: true,
      email: true,
      sms: false
    }
  });

  const handleSave = () => {
    Alert.alert('Settings Saved', 'Your security settings have been updated successfully!');
    navigation.goBack();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => {
          // Reset to default settings
          setSettings({
            ...settings,
            armMode: 'away',
            motionDetection: true,
            doorSensors: true,
            windowSensors: true,
            cameraRecording: true,
            nightVision: true,
            alertsEnabled: true,
            silentMode: false,
            autoArm: false,
            autoArmTime: '22:00'
          });
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

  const ArmModeSelector = () => (
    <View className="mb-6">
      <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        Arm Mode
      </Text>
      <View className="flex-row space-x-2">
        {['away', 'stay', 'night', 'off'].map(mode => (
          <TouchableOpacity
            key={mode}
            className={`flex-1 p-3 rounded-xl border-2 ${
              settings.armMode === mode
                ? (isDark ? 'border-primary-600 bg-primary-600' : 'border-primary-500 bg-primary-500')
                : (isDark ? 'border-neutral-700' : 'border-neutral-200')
            }`}
            onPress={() => setSettings({ ...settings, armMode: mode as any })}
          >
            <Text className={`text-center font-semibold ${
              settings.armMode === mode
                ? 'text-white'
                : (isDark ? 'text-neutral-300' : 'text-neutral-700')
            }`}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const NotificationSettings = () => (
    <View className="mb-6">
      <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        Notifications
      </Text>
      
      <SettingRow
        title="Push Notifications"
        subtitle="Receive alerts on your device"
        icon="notifications"
        rightElement={
          <Switch
            value={settings.notificationSettings.push}
            onValueChange={(value) => setSettings({
              ...settings,
              notificationSettings: { ...settings.notificationSettings, push: value }
            })}
            trackColor={{ false: '#767577', true: '#3b82f6' }}
            thumbColor={settings.notificationSettings.push ? '#ffffff' : '#f4f3f4'}
          />
        }
      />
      
      <SettingRow
        title="Email Alerts"
        subtitle="Receive alerts via email"
        icon="mail"
        rightElement={
          <Switch
            value={settings.notificationSettings.email}
            onValueChange={(value) => setSettings({
              ...settings,
              notificationSettings: { ...settings.notificationSettings, email: value }
            })}
            trackColor={{ false: '#767577', true: '#3b82f6' }}
            thumbColor={settings.notificationSettings.email ? '#ffffff' : '#f4f3f4'}
          />
        }
      />
      
      <SettingRow
        title="SMS Alerts"
        subtitle="Receive alerts via text message"
        icon="chatbubble"
        rightElement={
          <Switch
            value={settings.notificationSettings.sms}
            onValueChange={(value) => setSettings({
              ...settings,
              notificationSettings: { ...settings.notificationSettings, sms: value }
            })}
            trackColor={{ false: '#767577', true: '#3b82f6' }}
            thumbColor={settings.notificationSettings.sms ? '#ffffff' : '#f4f3f4'}
          />
        }
      />
    </View>
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
        {/* Arm Mode */}
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
                value={settings.motionDetection}
                onValueChange={(value) => setSettings({ ...settings, motionDetection: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.motionDetection ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Door Sensors"
            subtitle="Monitor door openings and closings"
            icon="door-open"
            rightElement={
              <Switch
                value={settings.doorSensors}
                onValueChange={(value) => setSettings({ ...settings, doorSensors: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.doorSensors ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Window Sensors"
            subtitle="Monitor window openings and closings"
            icon="window"
            rightElement={
              <Switch
                value={settings.windowSensors}
                onValueChange={(value) => setSettings({ ...settings, windowSensors: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.windowSensors ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Camera Recording"
            subtitle="Record video when motion is detected"
            icon="videocam"
            rightElement={
              <Switch
                value={settings.cameraRecording}
                onValueChange={(value) => setSettings({ ...settings, cameraRecording: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.cameraRecording ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Night Vision"
            subtitle="Enable night vision for cameras"
            icon="moon"
            rightElement={
              <Switch
                value={settings.nightVision}
                onValueChange={(value) => setSettings({ ...settings, nightVision: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.nightVision ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Alert Settings */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Alert Settings
          </Text>
          
          <SettingRow
            title="Alerts Enabled"
            subtitle="Receive security alerts"
            icon="warning"
            rightElement={
              <Switch
                value={settings.alertsEnabled}
                onValueChange={(value) => setSettings({ ...settings, alertsEnabled: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.alertsEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingRow
            title="Silent Mode"
            subtitle="Disable sound alerts"
            icon="volume-mute"
            rightElement={
              <Switch
                value={settings.silentMode}
                onValueChange={(value) => setSettings({ ...settings, silentMode: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.silentMode ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Notification Settings */}
        <NotificationSettings />

        {/* Auto Arm */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Auto Arm
          </Text>
          
          <SettingRow
            title="Auto Arm"
            subtitle="Automatically arm system at scheduled time"
            icon="time"
            rightElement={
              <Switch
                value={settings.autoArm}
                onValueChange={(value) => setSettings({ ...settings, autoArm: value })}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={settings.autoArm ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          {settings.autoArm && (
            <SettingRow
              title="Arm Time"
              subtitle={`Automatically arm at ${settings.autoArmTime}`}
              icon="clock"
              onPress={() => Alert.alert('Time Picker', 'Time picker coming soon!')}
            />
          )}
        </View>

        {/* Emergency Contacts */}
        <View className="mb-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
            Emergency Contacts
          </Text>
          
          {settings.emergencyContacts.map((contact, index) => (
            <SettingRow
              key={index}
              title={`Contact ${index + 1}`}
              subtitle={contact}
              icon="call"
              onPress={() => Alert.alert('Edit Contact', 'Contact editing coming soon!')}
            />
          ))}
          
          <TouchableOpacity
            className={`p-4 rounded-xl border-2 border-dashed ${
              isDark ? 'border-neutral-600' : 'border-neutral-300'
            } items-center`}
            onPress={() => Alert.alert('Add Contact', 'Add contact coming soon!')}
          >
            <Ionicons 
              name="add-circle-outline" 
              size={24} 
              color={isDark ? '#a3a3a3' : '#737373'} 
            />
            <Text className={`text-sm font-semibold mt-2 ${
              isDark ? 'text-neutral-300' : 'text-neutral-600'
            }`}>
              Add Emergency Contact
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
        <TouchableOpacity
          className={`py-4 px-6 rounded-xl ${isDark ? 'bg-primary-600' : 'bg-primary-500'}`}
          onPress={handleSave}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Save Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SecuritySettingsScreen;
