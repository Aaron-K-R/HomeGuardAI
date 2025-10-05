package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.PersonType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PersonResponseDto {
    
    private String id;
    private String name;
    private String phone;
    private String email;
    private PersonType personType;
    private String profileImagePath;
    private Boolean isActive;
    private LocalDateTime lastSeen;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
