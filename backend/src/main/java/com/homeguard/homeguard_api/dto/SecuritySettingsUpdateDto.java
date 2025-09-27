package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SecuritySettingsUpdateDto {
    
    private Boolean motionDetectionEnabled;
    
    private Boolean doorSensorEnabled;
    
    private Boolean windowSensorEnabled;
    
    private Boolean cameraRecordingEnabled;
    
    private Boolean nightVisionEnabled;
    
    @Min(value = 1, message = "Alarm sensitivity level must be between 1 and 10")
    @Max(value = 10, message = "Alarm sensitivity level must be between 1 and 10")
    private Integer alarmSensitivityLevel;
    
    @Size(max = 10, message = "Auto arm time must be in HH:MM format")
    private String autoArmTime;
    
    @Size(max = 10, message = "Auto disarm time must be in HH:MM format")
    private String autoDisarmTime;
    
    private Boolean emergencyContactsNotified;
    
    private Boolean policeNotificationEnabled;
}
