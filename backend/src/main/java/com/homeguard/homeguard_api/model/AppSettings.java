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

@Entity
@Table(name = "app_settings")
@Getter
@Setter
public class AppSettings extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @Column(name = "theme", nullable = false)
    private String theme = "light"; // light, dark, auto

    @Column(name = "language", nullable = false)
    private String language = "en"; // en, es, fr, etc.

    @Column(name = "notifications_enabled", nullable = false)
    private Boolean notificationsEnabled = true;

    @Column(name = "push_notifications_enabled", nullable = false)
    private Boolean pushNotificationsEnabled = true;

    @Column(name = "email_notifications_enabled", nullable = false)
    private Boolean emailNotificationsEnabled = true;

    @Column(name = "sms_notifications_enabled", nullable = false)
    private Boolean smsNotificationsEnabled = false;

    @Column(name = "location_tracking_enabled", nullable = false)
    private Boolean locationTrackingEnabled = true;

    @Column(name = "biometric_login_enabled", nullable = false)
    private Boolean biometricLoginEnabled = false;

    @Column(name = "two_factor_enabled", nullable = false)
    private Boolean twoFactorEnabled = false;

    @Column(name = "auto_lock_timeout")
    private Integer autoLockTimeout = 5; // minutes

    @Column(name = "data_usage_wifi_only", nullable = false)
    private Boolean dataUsageWifiOnly = true;
}
