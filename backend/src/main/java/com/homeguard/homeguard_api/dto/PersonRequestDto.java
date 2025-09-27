package com.homeguard.homeguard_api.dto;

import com.homeguard.homeguard_api.enums.PersonType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonRequestDto {
    
    @NotBlank
    @Size(max = 200)
    private String name;
    
    @Size(max = 50)
    private String phone;
    
    @Email
    @Size(max = 100)
    private String email;
    
    @NotNull
    private PersonType personType;
    
    @Size(max = 1000)
    private String notes;
}
