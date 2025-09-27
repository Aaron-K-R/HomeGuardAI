package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.Role;
import com.homeguard.homeguard_api.enums.UserState;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDto {
    
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Role role;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private UserState userState;
    private String emergencyContact;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional computed fields
    private String fullName;
    private boolean hasFaceProfile;
    private int deviceCount;
    private int homeCount;
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
