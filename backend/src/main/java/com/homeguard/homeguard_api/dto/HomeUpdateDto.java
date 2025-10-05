package com.homeguard.homeguard_api.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HomeUpdateDto {
    
    @Size(max = 200)
    private String name;
    
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
    private String homeType;
    
    private Boolean isPrimary;
    
    private Boolean isActive;
    
    @Size(max = 1000)
    private String description;
    
    @Size(max = 100)
    private String securitySystemType;
}
