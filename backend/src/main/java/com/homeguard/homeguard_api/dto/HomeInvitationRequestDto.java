package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HomeInvitationRequestDto {
    
    @NotBlank
    @Email
    private String email;
    
    private String message; // Optional invitation message
}
