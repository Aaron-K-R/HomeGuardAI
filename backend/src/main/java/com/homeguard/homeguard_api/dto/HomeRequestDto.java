package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HomeRequestDto {
    
    @NotBlank
    @Size(max = 200)
    private String name; // "Main House", "Vacation Home"
    
    @NotBlank
    @Size(max = 500)
    private String address;
    
    @Size(max = 100)
    private String city;
    
    @Size(max = 50)
    private String state;
    
    @Size(max = 20)
    private String zipCode;
    
    @Size(max = 100)
    private String country;
    
    private Double latitude;
    
    private Double longitude;
    
    @Size(max = 50)
    private String homeType; // "house", "apartment", "condo"
    
    private Boolean isPrimary = false;
    
    @Size(max = 1000)
    private String description;
    
    @Size(max = 100)
    private String securitySystemType; // "basic", "premium", "custom"
}
