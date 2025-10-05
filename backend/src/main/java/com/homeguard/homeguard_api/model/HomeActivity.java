package com.homeguard.homeguard_api.model;

import com.homeguard.homeguard_api.enums.ActivityPriority;
import com.homeguard.homeguard_api.enums.ActivityType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "home_activities")
@Getter
@Setter
public class HomeActivity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_id", nullable = false)
    @NotNull
    private Home home;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // null if system-generated

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id")
    private Person person; // null if not person-related

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id")
    private Device device; // null if not device-related

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    @NotNull
    private ActivityType activityType;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    @NotNull
    private ActivityPriority priority = ActivityPriority.MEDIUM;

    @Size(max = 500)
    @Column(name = "title", nullable = false)
    @NotNull
    private String title; // "John Doe opened front door"

    @Size(max = 1000)
    @Column(name = "description")
    private String description; // Detailed description

    @Size(max = 500)
    @Column(name = "location")
    private String location; // "Front Door", "Living Room"

    @Size(max = 500)
    @Column(name = "image_path")
    private String imagePath; // Photo/video of the activity

    @Column(name = "confidence")
    private Double confidence; // For AI-related activities

    @Column(name = "is_acknowledged", nullable = false)
    private Boolean isAcknowledged = false;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    @Column(name = "acknowledged_by_user_id")
    private String acknowledgedByUserId;

    @Size(max = 1000)
    @Column(name = "additional_data")
    private String additionalData; // JSON for extra metadata

    @Column(name = "activity_timestamp", nullable = false)
    @NotNull
    private LocalDateTime activityTimestamp; // When the activity actually occurred

    @Column(name = "is_resolved", nullable = false)
    private Boolean isResolved = false;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolved_by_user_id")
    private String resolvedByUserId;
}
