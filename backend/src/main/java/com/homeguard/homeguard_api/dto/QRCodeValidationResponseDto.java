package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.AccessResult;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QRCodeValidationResponseDto {
    
    private boolean valid;
    
    private AccessResult result;
    
    private String message;
    
    private String homeId;
    
    private String userId;
    
    private String accessType;
}

