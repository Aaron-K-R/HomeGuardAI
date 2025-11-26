package com.homeguard.homeguard_api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceControlResponseDto {
    
    private boolean success;
    
    private String message;
    
    private String deviceId;
    
    private boolean isLocked;
}

