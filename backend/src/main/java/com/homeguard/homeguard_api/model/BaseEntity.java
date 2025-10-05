package com.homeguard.homeguard_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

/**
 * BaseEntity - Abstract base class for all JPA entities
 * 
 * This class provides common fields and functionality that all entities in the HomeGuard AI system share:
 * - Primary key (id) with auto-increment strategy
 * - Audit fields (createdAt, updatedAt) for tracking when records are created/modified
 * - Automatic timestamp management using JPA lifecycle callbacks
 * 
 * Key Features:
 * - @MappedSuperclass: This class is not a table itself, but provides fields to subclasses
 * - @PrePersist: Automatically sets timestamps when entity is first saved to database
 * - @PreUpdate: Automatically updates the updatedAt timestamp when entity is modified
 * - Uses OffsetDateTime for timezone-aware timestamps (better than LocalDateTime for global apps)
 * 
 * All entities in the system (User, Home, AppSettings, SecuritySettings) extend this class
 * to inherit consistent ID and audit field behavior.
 */
@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {

    /**
     * Primary key for all entities
     * Uses IDENTITY strategy which relies on database auto-increment (AUTO_INCREMENT in MySQL, SERIAL in PostgreSQL)
     * This is the most portable and efficient strategy for most databases
     */
    @Id
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    /**
     * Timestamp when the record was first created
     * Set automatically by @PrePersist lifecycle callback
     * Uses OffsetDateTime for timezone-aware timestamps (recommended for global applications)
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the record was last updated
     * Set automatically by @PreUpdate lifecycle callback
     * Updated every time the entity is modified and saved
     */
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * JPA lifecycle callback that runs before the entity is persisted (saved for the first time)
     * Automatically sets both createdAt and updatedAt to the current timestamp
     * This ensures we never have null timestamps and maintains data integrity
     */
    @PrePersist
    protected void onCreate() {
        if (this.id == null || this.id.isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    /**
     * JPA lifecycle callback that runs before the entity is updated (modified and saved again)
     * Automatically updates the updatedAt timestamp to reflect when the record was last modified
     * This helps with auditing and tracking changes over time
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}


