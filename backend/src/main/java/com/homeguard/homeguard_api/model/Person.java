package com.homeguard.homeguard_api.model;

import com.homeguard.homeguard_api.enums.PersonType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "persons")
@Getter
@Setter
public class Person extends BaseEntity {

    @NotBlank
    @Size(max = 200)
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 50)
    @Column(name = "phone")
    private String phone;

    @Size(max = 100)
    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "person_type", nullable = false)
    private PersonType personType;

    @Size(max = 500)
    @Column(name = "profile_image_path")
    private String profileImagePath;

    @Column(name = "face_vector", columnDefinition = "TEXT")
    private String faceVector; // JSON array of ML face embedding

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "last_seen")
    private java.time.LocalDateTime lastSeen;

    @Size(max = 1000)
    @Column(name = "notes")
    private String notes;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, fetch = jakarta.persistence.FetchType.LAZY)
    private java.util.List<RFIDCard> rfidCards;
}
