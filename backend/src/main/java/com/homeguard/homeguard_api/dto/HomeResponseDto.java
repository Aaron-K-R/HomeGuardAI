package com.homeguard.homeguard_api.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HomeResponseDto {
    
    private String id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private Double latitude;
    private Double longitude;
    private String homeType;
    private Boolean isPrimary;
    private Boolean isActive;
    private String description;
    private String securitySystemType;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Owner information
    private String ownerId;
    private String ownerName;
    private String ownerEmail;
    
    // Computed fields
    private String fullAddress;
    private int deviceCount;
    private int userCount;
    private boolean hasCoordinates;
    
    public String getFullAddress() {
        StringBuilder address = new StringBuilder();
        if (this.address != null) address.append(this.address);
        if (this.city != null) address.append(", ").append(this.city);
        if (this.state != null) address.append(", ").append(this.state);
        if (this.zipCode != null) address.append(" ").append(this.zipCode);
        if (this.country != null) address.append(", ").append(this.country);
        return address.toString();
    }
    
    public boolean isHasCoordinates() {
        return latitude != null && longitude != null;
    }
}
