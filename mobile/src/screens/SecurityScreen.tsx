import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * SecurityScreen Component - Live security monitoring and camera feeds
 * 
 * This screen provides real-time security monitoring capabilities, including live camera feeds,
 * security status indicators, and recent alert notifications. It's the central hub for users
 * to monitor their home security system and respond to security events.
 * 
 * Key Features:
 * - Real-time security status display with visual indicators
 * - Live camera feed grid for multiple security cameras
 * - Recent alerts and security event notifications
 * - Touch-friendly camera selection interface
 * - Responsive grid layout for different screen sizes
 * 
 * UI Components:
 * - Security Status: Large status indicator showing current security state
 * - Camera Grid: 2x2 grid of live camera feeds with labels
 * - Recent Alerts: Timeline of recent security events and notifications
 * - Header: Screen title and description
 * 
 * Camera Integration (Future):
 * - Real-time video streaming from security cameras
 * - Camera selection and full-screen viewing
 * - Recording controls and playback
 * - Motion detection highlights
 * - Night vision mode indicators
 * 
 * Alert System (Future):
 * - Real-time push notifications for security events
 * - Alert categorization (motion, door, window, system)
 * - Alert acknowledgment and response actions
 * - Historical alert viewing and filtering
 * 
 * Security Features:
 * - System arming/disarming controls
 * - Emergency contact integration
 * - Police notification settings
 * - Geofencing and location-based controls
 */
export default function SecurityScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Screen header with title and description */}
      <View style={styles.header}>
        <Text style={styles.title}>Security Status</Text>
        <Text style={styles.subtitle}>Monitor your home security</Text>
      </View>

      {/* Main security status indicator */}
      <View style={styles.securityStatus}>
        <View style={styles.statusIndicator}>
          {/* Large shield icon indicating system is secured */}
          <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
          <Text style={styles.statusTitle}>SECURED</Text>
        </View>
        {/* Status description providing additional context */}
        <Text style={styles.statusDescription}>
          All security systems are active and monitoring your home
        </Text>
      </View>

      {/* Live camera feeds grid */}
      <View style={styles.cameraGrid}>
        <Text style={styles.sectionTitle}>Live Cameras</Text>
        
        {/* First row of cameras */}
        <View style={styles.cameraRow}>
          {/* Front door camera feed */}
          <TouchableOpacity style={styles.cameraCard}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={24} color="#8E8E93" />
              <Text style={styles.cameraLabel}>Front Door</Text>
            </View>
          </TouchableOpacity>
          
          {/* Backyard camera feed */}
          <TouchableOpacity style={styles.cameraCard}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={24} color="#8E8E93" />
              <Text style={styles.cameraLabel}>Backyard</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Second row of cameras */}
        <View style={styles.cameraRow}>
          {/* Living room camera feed */}
          <TouchableOpacity style={styles.cameraCard}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={24} color="#8E8E93" />
              <Text style={styles.cameraLabel}>Living Room</Text>
            </View>
          </TouchableOpacity>
          
          {/* Kitchen camera feed */}
          <TouchableOpacity style={styles.cameraCard}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={24} color="#8E8E93" />
              <Text style={styles.cameraLabel}>Kitchen</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent alerts and security events section */}
      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        
        {/* Motion detection alert */}
        <View style={styles.alertItem}>
          <Ionicons name="warning" size={20} color="#FF9500" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Motion Detected</Text>
            <Text style={styles.alertTime}>2 hours ago</Text>
          </View>
        </View>
        
        {/* System check completion alert */}
        <View style={styles.alertItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>System Check Complete</Text>
            <Text style={styles.alertTime}>4 hours ago</Text>
          </View>
        </View>
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
  securityStatus: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 8,
  },
  statusDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  cameraGrid: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  cameraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cameraCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  cameraPlaceholder: {
    height: 120,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cameraLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
  alertsSection: {
    margin: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  alertTime: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
});
