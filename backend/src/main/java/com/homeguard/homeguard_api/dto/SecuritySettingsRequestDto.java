package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SecuritySettingsRequestDto {
    
    private Boolean motionDetectionEnabled = true;
    
    private Boolean doorSensorEnabled = true;
    
    private Boolean windowSensorEnabled = true;
    
    private Boolean cameraRecordingEnabled = true;
    
    private Boolean nightVisionEnabled = true;
    
    @Min(value = 1, message = "Alarm sensitivity level must be between 1 and 10")
    @Max(value = 10, message = "Alarm sensitivity level must be between 1 and 10")
    private Integer alarmSensitivityLevel = 5;
    
    @Size(max = 10, message = "Auto arm time must be in HH:MM format")
    private String autoArmTime; // e.g., "22:00"
    
    @Size(max = 10, message = "Auto disarm time must be in HH:MM format")
    private String autoDisarmTime; // e.g., "07:00"
    
    private Boolean emergencyContactsNotified = true;
    
    private Boolean policeNotificationEnabled = false;
}
