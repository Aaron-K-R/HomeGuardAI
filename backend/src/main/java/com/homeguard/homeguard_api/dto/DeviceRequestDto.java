package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.DeviceStatus;
import com.homeguard.homeguard_api.enums.DeviceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceRequestDto {
    
    @NotBlank
    @Size(max = 100)
    private String deviceId;
    
    @NotBlank
    @Size(max = 200)
    private String name;
    
    @NotNull
    private DeviceType deviceType;
    
    private DeviceStatus status = DeviceStatus.OFFLINE;
    
    @Size(max = 200)
    private String location;
    
    @Size(max = 50)
    private String ipAddress;
    
    @Size(max = 50)
    private String macAddress;
    
    @Size(max = 100)
    private String piSerialNumber;
    
    @Size(max = 50)
    private String piModel;
    
    @Size(max = 50)
    private String osVersion;
    
    private Double cpuTemperature;
    
    private Integer memoryUsage;
    
    private Integer storageUsage;
    
    @Size(max = 100)
    private String wifiSSID;
    
    private Integer wifiSignal;
    
    private String deviceCapabilities;
    
    private String deviceConfiguration;
    
    private String firmwareVersion;
}
