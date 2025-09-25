import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * HomeScreen Component - Main dashboard for the HomeGuard AI mobile app
 * 
 * This is the primary screen that users see when they open the app. It provides a comprehensive
 * overview of the security system status, quick access to key features, and recent activity feed.
 * The screen is designed to give users immediate visibility into their home security status
 * and provide easy access to the most commonly used features.
 * 
 * Key Features:
 * - System status overview with visual indicators
 * - Quick action buttons for common tasks
 * - Recent activity feed showing security events
 * - Responsive design with consistent styling
 * - Touch-friendly interface optimized for mobile
 * 
 * UI Components:
 * - Header: App branding and title
 * - Status Card: Current security system status with visual indicators
 * - Quick Actions: Touchable buttons for common security tasks
 * - Recent Activity: Timeline of recent security events and system activities
 * 
 * Data Integration (Future):
 * - Real-time system status from backend API
 * - Live activity feed with timestamps
 * - User preferences and settings
 * - Push notification integration
 * 
 * Navigation:
 * - Quick action buttons will navigate to specific screens
 * - Integration with React Navigation for seamless user experience
 * - Deep linking support for specific security features
 */
export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* App header with branding and subtitle */}
      <View style={styles.header}>
        <Text style={styles.title}>HomeGuard AI</Text>
        <Text style={styles.subtitle}>Your Smart Security System</Text>
      </View>

      {/* System status card showing current security state */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          {/* Green checkmark icon indicating system is active and secure */}
          <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
          <Text style={styles.statusText}>System Active</Text>
        </View>
        {/* Status description providing additional context */}
        <Text style={styles.statusSubtext}>All security systems are operational</Text>
      </View>

      {/* Quick actions section for common security tasks */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        {/* Live camera feed access button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="camera" size={24} color="#007AFF" />
          <Text style={styles.actionText}>View Live Feed</Text>
        </TouchableOpacity>

        {/* Recent alerts and notifications access button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications" size={24} color="#FF9500" />
          <Text style={styles.actionText}>Recent Alerts</Text>
        </TouchableOpacity>

        {/* System settings access button */}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="settings" size={24} color="#8E8E93" />
          <Text style={styles.actionText}>System Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Recent activity feed showing security events and system activities */}
      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {/* System check completion event */}
        <View style={styles.activityItem}>
          <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.activityText}>System check completed - 2 minutes ago</Text>
        </View>
        
        {/* Motion detection event */}
        <View style={styles.activityItem}>
          <Ionicons name="eye" size={20} color="#007AFF" />
          <Text style={styles.activityText}>Motion detected in living room - 15 minutes ago</Text>
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
  statusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 8,
  },
  statusSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  quickActions: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  recentActivity: {
    margin: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
  },
  activityText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginLeft: 8,
    flex: 1,
  },
});
