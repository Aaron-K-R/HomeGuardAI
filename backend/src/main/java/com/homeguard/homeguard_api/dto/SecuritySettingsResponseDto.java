package com.homeguard.homeguard_api.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SecuritySettingsResponseDto {
    
    private String id;
    private String homeId;
    private String homeName;
    private String homeAddress;
    private String ownerId;
    private String ownerName;
    private String ownerEmail;
    
    // Security Features
    private Boolean motionDetectionEnabled;
    private Boolean doorSensorEnabled;
    private Boolean windowSensorEnabled;
    private Boolean cameraRecordingEnabled;
    private Boolean nightVisionEnabled;
    private Integer alarmSensitivityLevel;
    private String autoArmTime;
    private String autoDisarmTime;
    private Boolean emergencyContactsNotified;
    private Boolean policeNotificationEnabled;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Computed fields
    private boolean hasAutoArming;
    private boolean hasCustomAlert;
    private String securityLevel; // "basic", "standard", "premium"
    
    public boolean isHasAutoArming() {
        return autoArmTime != null && autoDisarmTime != null;
    }
    
    
    public String getSecurityLevel() {
        int features = 0;
        if (motionDetectionEnabled) features++;
        if (doorSensorEnabled) features++;
        if (windowSensorEnabled) features++;
        if (cameraRecordingEnabled) features++;
        if (nightVisionEnabled) features++;
        if (emergencyContactsNotified) features++;
        if (policeNotificationEnabled) features++;
        
        if (features >= 6) return "premium";
        if (features >= 4) return "standard";
        return "basic";
    }
}
