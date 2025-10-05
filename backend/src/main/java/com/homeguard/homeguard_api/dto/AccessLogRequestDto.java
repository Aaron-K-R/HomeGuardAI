package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.AccessResult;
import com.homeguard.homeguard_api.enums.AccessType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccessLogRequestDto {
    
    @NotNull
    private String deviceId;
    
    private String userId;
    
    private String personId;
    
    @NotNull
    private AccessType accessType;
    
    @NotNull
    private AccessResult result;
    
    @Size(max = 500)
    private String reason;
    
    @Size(max = 500)
    private String imagePath;
    
    @Size(max = 200)
    private String location;
    
    private Double confidence;
    
    @Size(max = 100)
    private String faceId;
    
    @Size(max = 1000)
    private String additionalData;
}
