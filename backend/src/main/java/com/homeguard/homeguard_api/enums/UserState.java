package com.homeguard.homeguard_api.enums;

/**
 * UserState Enum - Defines the current state/status of user accounts
 * 
 * This enum represents the different states that a user account can be in within the HomeGuard AI system.
 * User state controls account access, functionality, and security policies.
 * 
 * State Transitions:
 * - PENDING_VERIFICATION → ACTIVE (after email/phone verification)
 * - ACTIVE → INACTIVE (user deactivates account)
 * - ACTIVE → LOCKED (temporary lock due to security concerns)
 * - ACTIVE → SUSPENDED (administrative action)
 * - LOCKED → ACTIVE (after security verification)
 * - SUSPENDED → ACTIVE (after administrative review)
 * 
 * Security Implications:
 * - Only ACTIVE users can access the security system
 * - Different states have different access restrictions
 * - State changes should be logged for audit purposes
 * - Emergency access may be available for certain states
 * 
 * Usage in Database:
 * - Stored as STRING in the database for readability
 * - Default state for new users is ACTIVE
 * - State changes require proper authorization and logging
 */
public enum UserState {
    /**
     * Active user account with full system access
     * 
     * Characteristics:
     * - Account is fully verified and operational
     * - User can access all permitted features based on their role
     * - Security system monitoring is active
     * - All notifications and alerts are enabled
     * - This is the normal operational state for users
     * 
     * Can transition to:
     * - INACTIVE (user-initiated deactivation)
     * - LOCKED (security-triggered temporary lock)
     * - SUSPENDED (administrative action)
     */
    ACTIVE,
    
    /**
     * Inactive user account - user-initiated deactivation
     * 
     * Characteristics:
     * - Account is temporarily disabled by user choice
     * - Security system monitoring is paused
     * - User cannot log in or access the system
     * - Data is preserved and can be reactivated
     * - Notifications are disabled
     * 
     * Common use cases:
     * - User taking a break from the service
     * - Temporary account suspension by user
     * - Account maintenance or updates
     * 
     * Can transition to:
     * - ACTIVE (user reactivates account)
     */
    INACTIVE,
    
    /**
     * Temporarily locked account due to security concerns
     * 
     * Characteristics:
     * - Account is locked due to suspicious activity or security violations
     * - Security system monitoring may be paused or limited
     * - User cannot log in until security verification is completed
     * - Data is preserved and secure
     * - Emergency access may be available
     * 
     * Common triggers:
     * - Multiple failed login attempts
     * - Suspicious security system activity
     * - Potential security breach detection
     * - Unusual access patterns
     * 
     * Can transition to:
     * - ACTIVE (after security verification)
     * - SUSPENDED (if security issues persist)
     */
    LOCKED,
    
    /**
     * Suspended account due to administrative action
     * 
     * Characteristics:
     * - Account is suspended by administrators
     * - Security system monitoring is completely disabled
     * - User cannot log in or access any features
     * - Data is preserved but access is restricted
     * - Requires administrative intervention to restore
     * 
     * Common reasons:
     * - Terms of service violations
     * - Payment issues or billing problems
     * - Security policy violations
     * - Administrative review required
     * 
     * Can transition to:
     * - ACTIVE (after administrative review and approval)
     * - INACTIVE (if user chooses to deactivate)
     */
    SUSPENDED,
    
    /**
     * Account pending verification (email, phone, or identity verification)
     * 
     * Characteristics:
     * - Account is created but not yet fully verified
     * - Limited access to system features
     * - Security system monitoring is not active
     * - User must complete verification process
     * - Temporary state during account setup
     * 
     * Verification requirements:
     * - Email address verification
     * - Phone number verification (if provided)
     * - Identity verification (for premium features)
     * - Terms of service acceptance
     * 
     * Can transition to:
     * - ACTIVE (after successful verification)
     * - INACTIVE (if verification fails or times out)
     */
    PENDING_VERIFICATION
}
