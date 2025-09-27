package com.homeguard.homeguard_api.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AppSettingsResponseDto {
    
    private String id;
    private String userId;
    private String userEmail;
    private String userName;
    
    // UI/UX Settings
    private String theme;
    private String language;
    
    // Notification Settings
    private Boolean notificationsEnabled;
    private Boolean pushNotificationsEnabled;
    private Boolean emailNotificationsEnabled;
    private Boolean smsNotificationsEnabled;
    
    // Security Settings
    private Boolean biometricLoginEnabled;
    private Boolean twoFactorEnabled;
    private Integer autoLockTimeout;
    
    // Performance Settings
    private Boolean dataUsageWifiOnly;
    private Boolean locationTrackingEnabled;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Computed fields
    private boolean hasNotificationsEnabled;
    private boolean hasLocationFeaturesEnabled;
    private String accessibilityLevel; // "basic", "enhanced", "full"
    
    public boolean isHasNotificationsEnabled() {
        return notificationsEnabled && (pushNotificationsEnabled || emailNotificationsEnabled || smsNotificationsEnabled);
    }
    
    public boolean isHasLocationFeaturesEnabled() {
        return locationTrackingEnabled;
    }
    
    public String getAccessibilityLevel() {
        int features = 0;
        if (biometricLoginEnabled) features++;
        if (twoFactorEnabled) features++;
        if (dataUsageWifiOnly) features++;
        if (locationTrackingEnabled) features++;
        
        if (features >= 3) return "full";
        if (features >= 2) return "enhanced";
        return "basic";
    }
}
