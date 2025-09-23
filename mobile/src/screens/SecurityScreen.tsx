import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Security Status</Text>
        <Text style={styles.subtitle}>Monitor your home security</Text>
      </View>

      <View style={styles.securityStatus}>
        <View style={styles.statusIndicator}>
          <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
          <Text style={styles.statusTitle}>SECURED</Text>
        </View>
        <Text style={styles.statusDescription}>
          All security systems are active and monitoring your home
        </Text>
      </View>

      <View style={styles.cameraGrid}>
        <Text style={styles.sectionTitle}>Live Cameras</Text>
        <View style={styles.cameraRow}>
          <TouchableOpacity style={styles.cameraCard}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={24} color="#8E8E93" />
              <Text style={styles.cameraLabel}>Front Door</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cameraCard}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={24} color="#8E8E93" />
              <Text style={styles.cameraLabel}>Backyard</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cameraRow}>
          <TouchableOpacity style={styles.cameraCard}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={24} color="#8E8E93" />
              <Text style={styles.cameraLabel}>Living Room</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cameraCard}>
            <View style={styles.cameraPlaceholder}>
              <Ionicons name="camera" size={24} color="#8E8E93" />
              <Text style={styles.cameraLabel}>Kitchen</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        <View style={styles.alertItem}>
          <Ionicons name="warning" size={20} color="#FF9500" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Motion Detected</Text>
            <Text style={styles.alertTime}>2 hours ago</Text>
          </View>
        </View>
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
