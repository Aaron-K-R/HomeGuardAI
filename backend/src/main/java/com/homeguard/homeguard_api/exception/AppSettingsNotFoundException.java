package com.homeguard.homeguard_api.exception;

public class AppSettingsNotFoundException extends RuntimeException {
    
    public AppSettingsNotFoundException(String message) {
        super(message);
    }
    
    public AppSettingsNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static AppSettingsNotFoundException withId(String id) {
        return new AppSettingsNotFoundException("App settings not found with id: " + id);
    }
    
    public static AppSettingsNotFoundException withUserId(String userId) {
        return new AppSettingsNotFoundException("App settings not found for user id: " + userId);
    }
}
