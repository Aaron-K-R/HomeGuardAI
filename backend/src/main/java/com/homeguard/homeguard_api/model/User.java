package com.homeguard.homeguard_api.model;

import com.homeguard.homeguard_api.enums.Role;
import com.homeguard.homeguard_api.enums.UserState;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * User Entity - Core user model for the HomeGuard AI system
 * 
 * This entity represents a user account in the HomeGuard AI security system.
 * It contains all the essential user information including personal details,
 * contact information, role-based access control, and relationships to other entities.
 * 
 * Key Features:
 * - Extends BaseEntity for automatic ID and audit fields (createdAt, updatedAt)
 * - Uses JPA validation annotations for data integrity (@Email, @NotBlank, @Size)
 * - Implements role-based access control with Role enum (USER, ADMIN)
 * - Tracks user state with UserState enum (ACTIVE, INACTIVE, LOCKED, etc.)
 * - Has one-to-one relationships with SecuritySettings and AppSettings
 * - Has one-to-many relationship with Home entities (users can own multiple homes)
 * 
 * Database Relationships:
 * - One-to-One with SecuritySettings: Each user has one security configuration
 * - One-to-One with AppSettings: Each user has one app preferences configuration  
 * - One-to-Many with Home: Each user can own multiple homes/properties
 * 
 * Security Considerations:
 * - Email is unique and serves as the primary identifier for login
 * - Role field controls access permissions throughout the application
 * - UserState field allows for account management (suspension, locking, etc.)
 * - Emergency contact information for security alerts and notifications
 */
@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {

    /**
     * User's email address - serves as the primary login identifier
     * Must be unique across all users and follows email format validation
     * Used for authentication, password reset, and notifications
     */
    @Email
    @NotBlank
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    /**
     * User's first name - required field for personalization and identification
     * Maximum length of 100 characters to prevent database overflow
     * Used in UI displays and notifications
     */
    @NotBlank
    @Size(max = 100)
    @Column(name = "first_name", nullable = false)
    private String firstName;

    /**
     * User's last name - required field for personalization and identification
     * Maximum length of 100 characters to prevent database overflow
     * Used in UI displays and notifications
     */
    @NotBlank
    @Size(max = 100)
    @Column(name = "last_name", nullable = false)
    private String lastName;

    /**
     * User's phone number - optional contact information
     * Maximum length of 20 characters to accommodate international formats
     * Used for SMS notifications and emergency contact purposes
     */
    @Size(max = 20)
    @Column(name = "phone_number")
    private String phoneNumber;

    /**
     * User's role in the system - controls access permissions
     * Defaults to USER role for new accounts
     * ADMIN role provides elevated privileges for system management
     * Stored as STRING in database for readability and flexibility
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.USER;

    /**
     * User's street address - optional location information
     * Maximum length of 500 characters to accommodate full addresses
     * Used for location-based security features and emergency services
     */
    @Size(max = 500)
    @Column(name = "address")
    private String address;

    /**
     * User's city - part of location information
     * Maximum length of 100 characters
     * Used for location-based features and regional settings
     */
    @Size(max = 100)
    @Column(name = "city")
    private String city;

    /**
     * User's state/province - part of location information
     * Maximum length of 50 characters
     * Used for location-based features and regional settings
     */
    @Size(max = 50)
    @Column(name = "state")
    private String state;

    /**
     * User's postal/zip code - part of location information
     * Maximum length of 20 characters to accommodate international formats
     * Used for location-based features and regional settings
     */
    @Size(max = 20)
    @Column(name = "zip_code")
    private String zipCode;

    /**
     * Current state of the user account - controls account access
     * Defaults to ACTIVE for new accounts
     * Allows for account management: suspension, locking, verification pending
     * Stored as STRING in database for readability
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "user_state", nullable = false)
    private UserState userState = UserState.ACTIVE;

    /**
     * Emergency contact information - critical for security alerts
     * Maximum length of 1000 characters to accommodate multiple contacts
     * Used for notifying trusted contacts during security incidents
     * Can include names, phone numbers, email addresses, and relationships
     */
    @Size(max = 1000)
    @Column(name = "emergency_contact")
    private String emergencyContact;

    /**
     * One-to-One relationship with SecuritySettings
     * Each user has exactly one security configuration
     * Uses LAZY loading for performance (loaded only when accessed)
     * CASCADE.ALL means security settings are deleted when user is deleted
     * mappedBy="user" indicates SecuritySettings owns the foreign key
     */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private SecuritySettings securitySettings;

    /**
     * One-to-One relationship with AppSettings
     * Each user has exactly one app preferences configuration
     * Uses LAZY loading for performance (loaded only when accessed)
     * CASCADE.ALL means app settings are deleted when user is deleted
     * mappedBy="user" indicates AppSettings owns the foreign key
     */
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private AppSettings appSettings;

    /**
     * One-to-Many relationship with Home entities
     * Each user can own multiple homes/properties
     * Uses LAZY loading for performance (homes loaded only when accessed)
     * CASCADE.ALL means homes are deleted when user is deleted
     * mappedBy="owner" indicates Home entity owns the foreign key (owner_id)
     */
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private java.util.List<Home> homes;
}
