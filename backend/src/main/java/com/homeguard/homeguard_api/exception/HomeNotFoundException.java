package com.homeguard.homeguard_api.exception;

public class HomeNotFoundException extends RuntimeException {
    
    public HomeNotFoundException(String message) {
        super(message);
    }
    
    public HomeNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static HomeNotFoundException withId(String id) {
        return new HomeNotFoundException("Home not found with id: " + id);
    }
    
    public static HomeNotFoundException withName(String name) {
        return new HomeNotFoundException("Home not found with name: " + name);
    }
}
