package com.homeguard.homeguard_api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "rfid_cards")
@Getter
@Setter
public class RFIDCard extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Size(max = 100)
    @Column(name = "card_id", nullable = false, unique = true)
    private String cardId; // Physical card ID

    @Size(max = 50)
    @Column(name = "card_type")
    private String cardType; // "MIFARE", "NFC", "EM4102"

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "last_used")
    private LocalDateTime lastUsed;

    @Size(max = 200)
    @Column(name = "assigned_by")
    private String assignedBy; // Admin who assigned card

    @Size(max = 500)
    @Column(name = "description")
    private String description; // "Main card", "Guest card", "Emergency card"

    @Column(name = "usage_count")
    private Integer usageCount = 0; // How many times used
}
