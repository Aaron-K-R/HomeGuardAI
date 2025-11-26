package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceControlRequestDto {
    
    @NotBlank
    private String deviceId;
    
    @NotNull
    private Boolean lock; // true to lock, false to unlock
    
    private String reason;
}

