package com.homeguard.homeguard_api.enums;

public enum AccessLevel {
    FULL_ACCESS,        // 24/7 access
    LIMITED_HOURS,      // Time-based (9 AM - 5 PM)
    WEEKDAYS_ONLY,      // Monday-Friday
    TEMPORARY,          // Expires after X days
    EMERGENCY_ONLY      // Only during emergencies
}
