package com.homeguard.homeguard_api.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "homes")
@Getter
@Setter
public class Home extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @NotBlank
    @Size(max = 200)
    @Column(name = "name", nullable = false)
    private String name; // e.g., "Main House", "Vacation Home"

    @NotBlank
    @Size(max = 500)
    @Column(name = "address", nullable = false)
    private String address;

    @Size(max = 100)
    @Column(name = "city")
    private String city;

    @Size(max = 50)
    @Column(name = "state")
    private String state;

    @Size(max = 20)
    @Column(name = "zip_code")
    private String zipCode;

    @Size(max = 100)
    @Column(name = "country")
    private String country;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Size(max = 50)
    @Column(name = "home_type")
    private String homeType; // e.g., "house", "apartment", "condo"

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Size(max = 1000)
    @Column(name = "description")
    private String description;

    @Size(max = 100)
    @Column(name = "security_system_type")
    private String securitySystemType; // e.g., "basic", "premium", "custom"

    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private java.util.List<Device> devices;
    
    @OneToOne(mappedBy = "home", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private SecuritySettings securitySettings;

    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private java.util.List<UserHome> userHomes;

    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private java.util.List<HomePerson> homePersons;

    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private java.util.List<HomeInvitation> invitations;

    @OneToMany(mappedBy = "home", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private java.util.List<HomeActivity> activities;
}
