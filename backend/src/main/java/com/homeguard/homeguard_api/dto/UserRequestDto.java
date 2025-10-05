package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.Role;
import com.homeguard.homeguard_api.enums.UserState;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequestDto {
    
    private String id;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    @Size(max = 100)
    private String firstName;
    
    @NotBlank
    @Size(max = 100)
    private String lastName;
    
    @Size(max = 20)
    private String phoneNumber;
    
    private Role role = Role.USER;
    
    @Size(max = 500)
    private String address;
    
    @Size(max = 100)
    private String city;
    
    @Size(max = 50)
    private String state;
    
    @Size(max = 20)
    private String zipCode;
    
    private UserState userState = UserState.ACTIVE;
    
    @Size(max = 1000)
    private String emergencyContact;
}
