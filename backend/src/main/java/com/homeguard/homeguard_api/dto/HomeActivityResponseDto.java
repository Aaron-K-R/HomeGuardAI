package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.ActivityPriority;
import com.homeguard.homeguard_api.enums.ActivityType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HomeActivityResponseDto {
    
    private String id;
    private String homeId;
    private String homeName;
    private String userId;
    private String userName;
    private String personId;
    private String personName;
    private String deviceId;
    private String deviceName;
    private ActivityType activityType;
    private ActivityPriority priority;
    private String title;
    private String description;
    private String location;
    private String imagePath;
    private Double confidence;
    private Boolean isAcknowledged;
    private LocalDateTime acknowledgedAt;
    private String acknowledgedByUserId;
    private String acknowledgedByName;
    private String additionalData;
    private LocalDateTime activityTimestamp;
    private Boolean isResolved;
    private LocalDateTime resolvedAt;
    private String resolvedByUserId;
    private String resolvedByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
