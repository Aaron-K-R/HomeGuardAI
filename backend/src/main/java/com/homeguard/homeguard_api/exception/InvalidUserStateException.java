package com.homeguard.homeguard_api.exception;

import com.homeguard.homeguard_api.enums.UserState;

public class InvalidUserStateException extends RuntimeException {
    
    public InvalidUserStateException(String message) {
        super(message);
    }
    
    public InvalidUserStateException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static InvalidUserStateException forState(UserState state) {
        return new InvalidUserStateException("Invalid user state: " + state);
    }
    
    public static InvalidUserStateException forOperation(String operation, UserState currentState) {
        return new InvalidUserStateException(
            String.format("Cannot perform operation '%s' on user with state: %s", operation, currentState)
        );
    }
}
