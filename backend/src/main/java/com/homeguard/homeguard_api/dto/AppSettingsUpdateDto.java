package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppSettingsUpdateDto {
    
    @Size(max = 50, message = "Theme must not exceed 50 characters")
    private String theme;
    
    @Size(max = 10, message = "Language must not exceed 10 characters")
    private String language;
    
    private Boolean notificationsEnabled;
    
    private Boolean pushNotificationsEnabled;
    
    private Boolean emailNotificationsEnabled;
    
    private Boolean smsNotificationsEnabled;
    
    private Boolean locationTrackingEnabled;
    
    private Boolean biometricLoginEnabled;
    
    private Boolean twoFactorEnabled;
    
    @Min(value = 1, message = "Auto lock timeout must be at least 1 minute")
    @Max(value = 60, message = "Auto lock timeout must not exceed 60 minutes")
    private Integer autoLockTimeout;
    
    private Boolean dataUsageWifiOnly;
}
