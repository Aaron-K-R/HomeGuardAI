package com.homeguard.homeguard_api.model;

import com.homeguard.homeguard_api.enums.DeviceStatus;
import com.homeguard.homeguard_api.enums.DeviceType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "devices")
@Getter
@Setter
public class Device extends BaseEntity {

    @NotBlank
    @Size(max = 100)
    @Column(name = "device_id", nullable = false, unique = true)
    private String deviceId; // Unique hardware ID

    @NotBlank
    @Size(max = 200)
    @Column(name = "name", nullable = false)
    private String name; // "Front Door Lock", "Garage Camera"

    @Enumerated(EnumType.STRING)
    @Column(name = "device_type", nullable = false)
    private DeviceType deviceType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeviceStatus status = DeviceStatus.OFFLINE;

    @Size(max = 200)
    @Column(name = "location")
    private String location; // "Front Door", "Backyard"

    @Size(max = 50)
    @Column(name = "ip_address")
    private String ipAddress;

    @Size(max = 50)
    @Column(name = "mac_address")
    private String macAddress;

    @Size(max = 100)
    @Column(name = "pi_serial_number")
    private String piSerialNumber; // Pi's unique serial

    @Size(max = 50)
    @Column(name = "pi_model")
    private String piModel; // "Pi 4B", "Pi Zero W"

    @Size(max = 50)
    @Column(name = "os_version")
    private String osVersion; // Raspberry Pi OS version

    @Column(name = "cpu_temperature")
    private Double cpuTemperature; // Pi temperature monitoring

    @Column(name = "memory_usage")
    private Integer memoryUsage; // RAM usage percentage

    @Column(name = "storage_usage")
    private Integer storageUsage; // SD card usage percentage

    @Size(max = 100)
    @Column(name = "wifi_ssid")
    private String wifiSSID; // Connected WiFi network

    @Column(name = "wifi_signal")
    private Integer wifiSignal; // Signal strength

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "home_id", nullable = false)
    private Home home;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // New fields for Pi device capabilities
    @Column(name = "device_capabilities", columnDefinition = "TEXT")
    private String deviceCapabilities; // JSON array of capabilities

    @Size(max = 50)
    @Column(name = "pairing_code")
    private String pairingCode;

    @Column(name = "pairing_expires_at")
    private java.time.LocalDateTime pairingExpiresAt;

    @Size(max = 50)
    @Column(name = "firmware_version")
    private String firmwareVersion;

    @Column(name = "device_configuration", columnDefinition = "TEXT")
    private String deviceConfiguration; // JSON config

    @Column(name = "last_heartbeat")
    private java.time.LocalDateTime lastHeartbeat;

    @Column(name = "is_online", nullable = false)
    private Boolean isOnline = false;
}
