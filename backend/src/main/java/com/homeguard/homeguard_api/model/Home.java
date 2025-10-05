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

/**
 * Home Entity - Represents a property/home in the HomeGuard AI system
 * 
 * This entity represents a physical property that can be monitored by the security system.
 * Users can own multiple homes (e.g., main house, vacation home, rental property) and
 * each home can have its own security configuration and monitoring settings.
 * 
 * Key Features:
 * - Extends BaseEntity for automatic ID and audit fields (createdAt, updatedAt)
 * - Many-to-One relationship with User (many homes can belong to one user)
 * - Comprehensive location information including GPS coordinates
 * - Support for different property types (house, apartment, condo, etc.)
 * - Primary home designation for users with multiple properties
 * - Active/inactive status for managing property monitoring
 * - Security system type classification for different monitoring capabilities
 * 
 * Location Features:
 * - Full address information (street, city, state, zip, country)
 * - GPS coordinates (latitude, longitude) for precise location tracking
 * - Used for geofencing, emergency services, and location-based security features
 * 
 * Security Integration:
 * - Security system type determines available monitoring features
 * - Each home can have different security configurations
 * - Supports multiple security system tiers (basic, premium, custom)
 */
@Entity
@Table(name = "homes")
@Getter
@Setter
public class Home extends BaseEntity {

    /**
     * Many-to-One relationship with User entity
     * Each home belongs to exactly one user (the owner)
     * Uses LAZY loading for performance (user loaded only when accessed)
     * owner_id foreign key is stored in the homes table
     * This allows users to own multiple properties
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    /**
     * Display name for the home - helps users identify different properties
     * Examples: "Main House", "Vacation Home", "Rental Property", "Office"
     * Required field with maximum length of 200 characters
     * Used in UI displays and notifications
     */
    @NotBlank
    @Size(max = 200)
    @Column(name = "name", nullable = false)
    private String name; // e.g., "Main House", "Vacation Home"

    /**
     * Street address of the property
     * Required field with maximum length of 500 characters
     * Used for emergency services, location-based features, and identification
     * Should include street number, street name, and any unit/apartment numbers
     */
    @NotBlank
    @Size(max = 500)
    @Column(name = "address", nullable = false)
    private String address;

    /**
     * City where the property is located
     * Optional field with maximum length of 100 characters
     * Used for location-based features and regional settings
     */
    @Size(max = 100)
    @Column(name = "city")
    private String city;

    /**
     * State/province where the property is located
     * Optional field with maximum length of 50 characters
     * Used for location-based features and regional settings
     */
    @Size(max = 50)
    @Column(name = "state")
    private String state;

    /**
     * Postal/zip code of the property
     * Optional field with maximum length of 20 characters
     * Accommodates international postal code formats
     * Used for location-based features and regional settings
     */
    @Size(max = 20)
    @Column(name = "zip_code")
    private String zipCode;

    /**
     * Country where the property is located
     * Optional field with maximum length of 100 characters
     * Used for international properties and location-based features
     */
    @Size(max = 100)
    @Column(name = "country")
    private String country;

    /**
     * GPS latitude coordinate of the property
     * Optional field for precise location tracking
     * Used for geofencing, emergency services, and location-based security features
     * Stored as Double to support decimal precision
     */
    @Column(name = "latitude")
    private Double latitude;

    /**
     * GPS longitude coordinate of the property
     * Optional field for precise location tracking
     * Used for geofencing, emergency services, and location-based security features
     * Stored as Double to support decimal precision
     */
    @Column(name = "longitude")
    private Double longitude;

    /**
     * Type of property - helps categorize different kinds of homes
     * Examples: "house", "apartment", "condo", "townhouse", "mobile_home"
     * Optional field with maximum length of 50 characters
     * Used for property-specific security configurations and UI displays
     */
    @Size(max = 50)
    @Column(name = "home_type")
    private String homeType; // e.g., "house", "apartment", "condo"

    /**
     * Indicates if this is the user's primary residence
     * Defaults to false for new homes
     * Only one home per user should be marked as primary
     * Used for default settings, notifications, and UI prioritization
     */
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    /**
     * Indicates if this home is currently being monitored
     * Defaults to true for new homes
     * Inactive homes are not monitored but data is preserved
     * Used for temporarily disabling monitoring without deleting the home
     */
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    /**
     * Additional description or notes about the property
     * Optional field with maximum length of 1000 characters
     * Can include special instructions, access codes, or property details
     * Used for context in security monitoring and emergency situations
     */
    @Size(max = 1000)
    @Column(name = "description")
    private String description;

    /**
     * Type of security system installed at this property
     * Examples: "basic", "premium", "custom", "diy", "professional"
     * Optional field with maximum length of 100 characters
     * Determines available monitoring features and capabilities
     * Used for system configuration and feature availability
     */
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
