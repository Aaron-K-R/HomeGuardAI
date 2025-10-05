package com.homeguard.homeguard_api.enums;

public enum ActivityType {
    // Access Activities
    DOOR_OPENED,
    DOOR_CLOSED,
    ACCESS_GRANTED,
    ACCESS_DENIED,
    
    // Person Activities
    PERSON_DETECTED,
    PERSON_RECOGNIZED,
    PERSON_UNKNOWN,
    PERSON_ADDED,
    PERSON_REMOVED,
    
    // Device Activities
    DEVICE_ONLINE,
    DEVICE_OFFLINE,
    DEVICE_PAIRING,
    DEVICE_ERROR,
    
    // Security Activities
    MOTION_DETECTED,
    ALARM_TRIGGERED,
    ALARM_DISARMED,
    SECURITY_BREACH,
    
    // User Activities
    USER_LOGIN,
    USER_LOGOUT,
    USER_INVITED,
    USER_JOINED,
    
    // System Activities
    SETTINGS_CHANGED,
    CONFIGURATION_UPDATED,
    FIRMWARE_UPDATED,
    
    // Emergency Activities
    EMERGENCY_ALERT,
    PANIC_BUTTON,
    FIRE_ALARM,
    INTRUSION_DETECTED
}
