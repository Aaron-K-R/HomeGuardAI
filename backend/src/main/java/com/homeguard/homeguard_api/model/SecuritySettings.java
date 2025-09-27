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
@Table(name = "security_settings")
@Getter
@Setter
public class SecuritySettings extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_id", nullable = false)
    @NotNull
    private Home home;

    @Column(name = "motion_detection_enabled", nullable = false)
    private Boolean motionDetectionEnabled = true;

    @Column(name = "door_sensor_enabled", nullable = false)
    private Boolean doorSensorEnabled = true;

    @Column(name = "window_sensor_enabled", nullable = false)
    private Boolean windowSensorEnabled = true;

    @Column(name = "camera_recording_enabled", nullable = false)
    private Boolean cameraRecordingEnabled = true;

    @Column(name = "night_vision_enabled", nullable = false)
    private Boolean nightVisionEnabled = true;

    @Column(name = "alarm_sensitivity_level")
    private Integer alarmSensitivityLevel = 5; // 1-10 scale

    @Column(name = "auto_arm_time")
    private String autoArmTime; // HH:MM format

    @Column(name = "auto_disarm_time")
    private String autoDisarmTime; // HH:MM format

    @Column(name = "emergency_contacts_notified", nullable = false)
    private Boolean emergencyContactsNotified = true;

    @Column(name = "police_notification_enabled", nullable = false)
    private Boolean policeNotificationEnabled = false;
}
