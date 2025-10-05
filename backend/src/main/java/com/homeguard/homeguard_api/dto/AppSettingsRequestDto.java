package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppSettingsRequestDto {
    
    @Size(max = 50, message = "Theme must not exceed 50 characters")
    private String theme = "light"; // "light", "dark", "auto"
    
    @Size(max = 10, message = "Language must not exceed 10 characters")
    private String language = "en"; // "en", "es", "fr"
    
    private Boolean notificationsEnabled = true;
    
    private Boolean pushNotificationsEnabled = true;
    
    private Boolean emailNotificationsEnabled = true;
    
    private Boolean smsNotificationsEnabled = false;
    
    private Boolean locationTrackingEnabled = true;
    
    private Boolean biometricLoginEnabled = false;
    
    private Boolean twoFactorEnabled = false;
    
    @Min(value = 1, message = "Auto lock timeout must be at least 1 minute")
    @Max(value = 60, message = "Auto lock timeout must not exceed 60 minutes")
    private Integer autoLockTimeout = 5; // minutes
    
    private Boolean dataUsageWifiOnly = true;
}
