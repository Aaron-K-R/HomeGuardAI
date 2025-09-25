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
 * AppSettings Entity - User application preferences and configuration
 * 
 * This entity stores user-specific application settings and preferences for the HomeGuard AI mobile app.
 * Each user has exactly one AppSettings record that controls their app experience including
 * UI preferences, notification settings, security features, and data usage policies.
 * 
 * Key Features:
 * - Extends BaseEntity for automatic ID and audit fields (createdAt, updatedAt)
 * - One-to-One relationship with User (each user has one app settings record)
 * - Comprehensive UI customization options (theme, language)
 * - Granular notification control (push, email, SMS)
 * - Security and privacy settings (biometric login, 2FA, location tracking)
 * - Data usage and performance preferences
 * 
 * UI Customization:
 * - Theme selection (light, dark, auto) for user preference
 * - Language selection for internationalization support
 * - Auto-lock timeout for security and battery optimization
 * 
 * Notification Management:
 * - Master notification toggle for all alerts
 * - Individual channel control (push, email, SMS)
 * - Allows users to customize their alert preferences
 * 
 * Security & Privacy:
 * - Biometric login support for enhanced security
 * - Two-factor authentication toggle
 * - Location tracking control for privacy
 * - Data usage restrictions (WiFi only) for cost control
 */
@Entity
@Table(name = "app_settings")
@Getter
@Setter
public class AppSettings extends BaseEntity {

    /**
     * One-to-One relationship with User entity
     * Each user has exactly one app settings configuration
     * Uses LAZY loading for performance (user loaded only when accessed)
     * user_id foreign key is stored in the app_settings table
     * @NotNull ensures the relationship is always established
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    /**
     * UI theme preference for the mobile application
     * Defaults to "light" theme for new users
     * Supported values: "light", "dark", "auto" (follows system setting)
     * Used to customize the app's visual appearance
     */
    @Column(name = "theme", nullable = false)
    private String theme = "light"; // light, dark, auto

    /**
     * Language preference for the mobile application
     * Defaults to "en" (English) for new users
     * Uses standard language codes: "en", "es", "fr", "de", etc.
     * Used for internationalization and localization
     */
    @Column(name = "language", nullable = false)
    private String language = "en"; // en, es, fr, etc.

    /**
     * Master toggle for all notification types
     * Defaults to true for new users
     * When false, disables all notifications regardless of individual settings
     * Used as a global notification control
     */
    @Column(name = "notifications_enabled", nullable = false)
    private Boolean notificationsEnabled = true;

    /**
     * Push notification preference for mobile alerts
     * Defaults to true for new users
     * Controls in-app and system push notifications
     * Used for real-time security alerts and system updates
     */
    @Column(name = "push_notifications_enabled", nullable = false)
    private Boolean pushNotificationsEnabled = true;

    /**
     * Email notification preference
     * Defaults to true for new users
     * Controls email alerts and system notifications
     * Used for important security events and account updates
     */
    @Column(name = "email_notifications_enabled", nullable = false)
    private Boolean emailNotificationsEnabled = true;

    /**
     * SMS notification preference
     * Defaults to false for new users (requires opt-in)
     * Controls text message alerts for critical security events
     * Used for emergency notifications and critical alerts
     */
    @Column(name = "sms_notifications_enabled", nullable = false)
    private Boolean smsNotificationsEnabled = false;

    /**
     * Location tracking preference for geofencing features
     * Defaults to true for new users
     * Controls whether the app can access device location
     * Used for location-based security features and geofencing
     */
    @Column(name = "location_tracking_enabled", nullable = false)
    private Boolean locationTrackingEnabled = true;

    /**
     * Biometric authentication preference (fingerprint, face ID)
     * Defaults to false for new users (requires opt-in)
     * Controls whether biometric login is enabled
     * Used for enhanced security and convenience
     */
    @Column(name = "biometric_login_enabled", nullable = false)
    private Boolean biometricLoginEnabled = false;

    /**
     * Two-factor authentication preference
     * Defaults to false for new users (requires opt-in)
     * Controls whether 2FA is enabled for account security
     * Used for enhanced account protection
     */
    @Column(name = "two_factor_enabled", nullable = false)
    private Boolean twoFactorEnabled = false;

    /**
     * Auto-lock timeout in minutes for app security
     * Defaults to 5 minutes for new users
     * Controls how long the app stays unlocked before requiring re-authentication
     * Used for security and battery optimization
     */
    @Column(name = "auto_lock_timeout")
    private Integer autoLockTimeout = 5; // minutes

    /**
     * Data usage restriction preference
     * Defaults to true for new users
     * When true, app only uses data over WiFi (not cellular)
     * Used for cost control and data usage management
     */
    @Column(name = "data_usage_wifi_only", nullable = false)
    private Boolean dataUsageWifiOnly = true;
}
