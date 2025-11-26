package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QRCodeValidationRequestDto {
    
    @NotBlank
    private String qrData;
    
    @NotBlank
    private String deviceId;
    
    @NotNull
    private String homeId;
}

