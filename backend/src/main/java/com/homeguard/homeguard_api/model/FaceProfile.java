package com.homeguard.homeguard_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "face_profiles")
@Getter
@Setter
public class FaceProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull
    private User user;

    @Column(name = "face_id", nullable = false, unique = true)
    private String faceId; // AI model face ID

    @Size(max = 500)
    @Column(name = "image_path")
    private String imagePath; // Reference photo

    @Column(name = "confidence")
    private Double confidence; // Recognition confidence score

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "last_recognized")
    private LocalDateTime lastRecognized;

    @Column(name = "recognition_count")
    private Integer recognitionCount = 0; // How many times recognized

    @Size(max = 1000)
    @Column(name = "face_features")
    private String faceFeatures; // Serialized face features for comparison

    @Size(max = 200)
    @Column(name = "enrollment_method")
    private String enrollmentMethod; // "MOBILE_APP", "WEB_UPLOAD", "CAMERA"
}
