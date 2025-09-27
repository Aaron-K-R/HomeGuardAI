package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.AccessResult;
import com.homeguard.homeguard_api.enums.AccessType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AccessLogResponseDto {
    
    private String id;
    private String userId;
    private String userName;
    private String personId;
    private String personName;
    private String deviceId;
    private String deviceName;
    private String homeId;
    private String homeName;
    private AccessType accessType;
    private AccessResult result;
    private String reason;
    private String imagePath;
    private String location;
    private Double confidence;
    private String faceId;
    private String additionalData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
