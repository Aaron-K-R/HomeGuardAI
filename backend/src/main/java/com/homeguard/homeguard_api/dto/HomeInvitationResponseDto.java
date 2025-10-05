package com.homeguard.homeguard_api.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HomeInvitationResponseDto {
    
    private String id;
    private String homeId;
    private String homeName;
    private String invitedByUserId;
    private String invitedByName;
    private String email;
    private String invitationToken;
    private LocalDateTime expiresAt;
    private Boolean isAccepted;
    private LocalDateTime acceptedAt;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
