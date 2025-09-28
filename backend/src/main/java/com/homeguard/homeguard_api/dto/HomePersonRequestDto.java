package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.AccessLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HomePersonRequestDto {
    
    @NotBlank
    private String homeId;
    
    @NotBlank
    private String personId;
    
    @NotNull
    private AccessLevel accessLevel;
    
    private String accessExpiresAt;
    
    private String notes;
}
