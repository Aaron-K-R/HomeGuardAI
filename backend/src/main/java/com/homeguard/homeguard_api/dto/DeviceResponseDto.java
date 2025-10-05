package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.DeviceStatus;
import com.homeguard.homeguard_api.enums.DeviceType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DeviceResponseDto {
    
    private String id;
    private String deviceId;
    private String name;
    private DeviceType deviceType;
    private DeviceStatus status;
    private String location;
    private String ipAddress;
    private String macAddress;
    private String piSerialNumber;
    private String piModel;
    private String osVersion;
    private Double cpuTemperature;
    private Integer memoryUsage;
    private Integer storageUsage;
    private String wifiSSID;
    private Integer wifiSignal;
    private String deviceCapabilities;
    private String pairingCode;
    private LocalDateTime pairingExpiresAt;
    private String firmwareVersion;
    private String deviceConfiguration;
    private LocalDateTime lastHeartbeat;
    private Boolean isOnline;
    private Boolean isActive;
    private String homeId;
    private String homeName;
    private String ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
