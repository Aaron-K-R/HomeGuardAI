package com.homeguard.homeguard_api.exception;

public class SecuritySettingsNotFoundException extends RuntimeException {
    
    public SecuritySettingsNotFoundException(String message) {
        super(message);
    }
    
    public SecuritySettingsNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static SecuritySettingsNotFoundException withId(String id) {
        return new SecuritySettingsNotFoundException("Security settings not found with id: " + id);
    }
    
    public static SecuritySettingsNotFoundException withUserId(String userId) {
        return new SecuritySettingsNotFoundException("Security settings not found for user id: " + userId);
    }
    
    public static SecuritySettingsNotFoundException withHomeId(String homeId) {
        return new SecuritySettingsNotFoundException("Security settings not found for home id: " + homeId);
    }
}
