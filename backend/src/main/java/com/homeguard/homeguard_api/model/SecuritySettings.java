package com.homeguard.homeguard_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * SecuritySettings Entity - User security system configuration and preferences
 * 
 * This entity stores user-specific security system settings and monitoring preferences for the HomeGuard AI system.
 * Each user has exactly one SecuritySettings record that controls their security system behavior including
 * sensor configurations, alarm settings, automated scheduling, and emergency response protocols.
 * 
 * Key Features:
 * - Extends BaseEntity for automatic ID and audit fields (createdAt, updatedAt)
 * - One-to-One relationship with User (each user has one security settings record)
 * - Granular sensor control (motion, door, window sensors)
 * - Camera and recording preferences
 * - Alarm sensitivity and scheduling configuration
 * - Emergency response and notification settings
 * 
 * Sensor Management:
 * - Individual control for motion detection, door sensors, window sensors
 * - Camera recording and night vision preferences
 * - Alarm sensitivity levels for fine-tuning detection
 * 
 * Automation Features:
 * - Auto-arm and auto-disarm scheduling
 * - Time-based security system activation
 * - Reduces manual intervention for routine security management
 * 
 * Emergency Response:
 * - Emergency contact notification preferences
 * - Police notification settings for critical events
 * - Configurable response protocols for different threat levels
 */
@Entity
@Table(name = "security_settings")
@Getter
@Setter
public class SecuritySettings extends BaseEntity {

    /**
     * One-to-One relationship with Home entity
     * Each home has exactly one security settings configuration
     * Uses LAZY loading for performance (home loaded only when accessed)
     * home_id foreign key is stored in the security_settings table
     * @NotNull ensures the relationship is always established
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_id", nullable = false)
    @NotNull
    private Home home;

    /**
     * Motion detection sensor enable/disable preference
     * Defaults to true for new users
     * Controls whether motion sensors are active and monitoring
     * Used for detecting movement within monitored areas
     */
    @Column(name = "motion_detection_enabled", nullable = false)
    private Boolean motionDetectionEnabled = true;

    /**
     * Door sensor enable/disable preference
     * Defaults to true for new users
     * Controls whether door/window contact sensors are active
     * Used for detecting unauthorized entry through doors
     */
    @Column(name = "door_sensor_enabled", nullable = false)
    private Boolean doorSensorEnabled = true;

    /**
     * Window sensor enable/disable preference
     * Defaults to true for new users
     * Controls whether window contact sensors are active
     * Used for detecting unauthorized entry through windows
     */
    @Column(name = "window_sensor_enabled", nullable = false)
    private Boolean windowSensorEnabled = true;

    /**
     * Camera recording enable/disable preference
     * Defaults to true for new users
     * Controls whether security cameras record video when triggered
     * Used for evidence collection and monitoring verification
     */
    @Column(name = "camera_recording_enabled", nullable = false)
    private Boolean cameraRecordingEnabled = true;

    /**
     * Night vision enable/disable preference
     * Defaults to true for new users
     * Controls whether cameras use night vision mode in low light
     * Used for 24/7 monitoring capability in all lighting conditions
     */
    @Column(name = "night_vision_enabled", nullable = false)
    private Boolean nightVisionEnabled = true;

    /**
     * Alarm sensitivity level on a scale of 1-10
     * Defaults to 5 (medium sensitivity) for new users
     * Higher values = more sensitive (more false alarms, catches more events)
     * Lower values = less sensitive (fewer false alarms, might miss some events)
     * Used for fine-tuning the security system's responsiveness
     */
    @Column(name = "alarm_sensitivity_level")
    private Integer alarmSensitivityLevel = 5; // 1-10 scale

    /**
     * Automatic system arming time in HH:MM format
     * Optional field - when set, system automatically arms at this time
     * Examples: "22:00" (10 PM), "23:30" (11:30 PM)
     * Used for automated security scheduling (e.g., arm at bedtime)
     */
    @Column(name = "auto_arm_time")
    private String autoArmTime; // HH:MM format

    /**
     * Automatic system disarming time in HH:MM format
     * Optional field - when set, system automatically disarms at this time
     * Examples: "07:00" (7 AM), "08:30" (8:30 AM)
     * Used for automated security scheduling (e.g., disarm in the morning)
     */
    @Column(name = "auto_disarm_time")
    private String autoDisarmTime; // HH:MM format

    /**
     * Emergency contact notification preference
     * Defaults to true for new users
     * Controls whether emergency contacts are notified during security events
     * Used for alerting trusted contacts during security incidents
     */
    @Column(name = "emergency_contacts_notified", nullable = false)
    private Boolean emergencyContactsNotified = true;

    /**
     * Police notification preference for critical security events
     * Defaults to false for new users (requires explicit opt-in)
     * Controls whether police are automatically notified during security breaches
     * Used for immediate emergency response to serious security threats
     * Note: This should be used carefully and only for verified threats
     */
    @Column(name = "police_notification_enabled", nullable = false)
    private Boolean policeNotificationEnabled = false;
}
