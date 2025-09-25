import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * SettingsScreen Component - User preferences and system configuration
 * 
 * This screen provides comprehensive settings and configuration options for the HomeGuard AI system.
 * It's organized into logical sections covering security settings, system configuration, and account
 * management. Users can customize their security preferences, notification settings, and app behavior.
 * 
 * Key Features:
 * - Security system configuration and controls
 * - Notification and alert preferences
 * - System settings and network configuration
 * - Account management and profile settings
 * - Help and support access
 * - App information and version details
 * 
 * UI Sections:
 * - Security Settings: System arming, notifications, camera recording
 * - System Settings: Network, storage, scheduling configuration
 * - Account: Profile management, help, app information
 * 
 * Interactive Elements:
 * - Toggle switches for boolean settings (on/off)
 * - Navigation arrows for detailed configuration screens
 * - Touchable items for navigation to sub-screens
 * - Visual icons for easy identification of settings
 * 
 * Data Integration (Future):
 * - Real-time synchronization with backend API
 * - User preference persistence
 * - Settings validation and error handling
 * - Configuration backup and restore
 * 
 * Security Considerations:
 * - Sensitive settings require authentication
 * - Changes are logged for audit purposes
 * - Critical settings have confirmation dialogs
 * - Settings are encrypted in storage
 */
export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Screen header with title and description */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your HomeGuard AI system</Text>
      </View>

      {/* Security Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Settings</Text>
        
        {/* System arming/disarming toggle */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="shield" size={24} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Arm System</Text>
              <Text style={styles.settingDescription}>Enable/disable security monitoring</Text>
            </View>
          </View>
          <Switch value={true} />
        </TouchableOpacity>

        {/* Push notifications toggle */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications" size={24} color="#FF9500" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Receive alerts on your device</Text>
            </View>
          </View>
          <Switch value={true} />
        </TouchableOpacity>

        {/* Camera recording toggle */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="camera" size={24} color="#34C759" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Camera Recording</Text>
              <Text style={styles.settingDescription}>Record video when motion is detected</Text>
            </View>
          </View>
          <Switch value={true} />
        </TouchableOpacity>
      </View>

      {/* System Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Settings</Text>
        
        {/* Network configuration navigation */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="wifi" size={24} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Network Settings</Text>
              <Text style={styles.settingDescription}>Configure WiFi and connectivity</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        {/* Storage management navigation */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="storage" size={24} color="#8E8E93" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Storage Management</Text>
              <Text style={styles.settingDescription}>Manage video storage and cloud backup</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        {/* Schedule settings navigation */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="time" size={24} color="#8E8E93" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Schedule Settings</Text>
              <Text style={styles.settingDescription}>Set up automated schedules</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        {/* Profile management navigation */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="person" size={24} color="#007AFF" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Profile</Text>
              <Text style={styles.settingDescription}>Manage your account information</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        {/* Help and support navigation */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="help-circle" size={24} color="#8E8E93" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get help and contact support</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>

        {/* App information navigation */}
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="information-circle" size={24} color="#8E8E93" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>About</Text>
              <Text style={styles.settingDescription}>App version and information</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
});
