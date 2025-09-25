package com.homeguard.homeguard_api.enums;

/**
 * Role Enum - Defines user access levels in the HomeGuard AI system
 * 
 * This enum represents the different roles that users can have within the HomeGuard AI security system.
 * Roles determine what actions users can perform and what data they can access.
 * 
 * Role Hierarchy:
 * - USER: Standard user with basic security monitoring capabilities
 * - ADMIN: Administrative user with full system access and management capabilities
 * 
 * Security Implications:
 * - Role-based access control (RBAC) is implemented throughout the application
 * - Different API endpoints and features are restricted based on user role
 * - Database queries and data access are filtered by user role
 * - UI components and functionality are conditionally rendered based on role
 * 
 * Usage in Database:
 * - Stored as STRING in the database for readability and flexibility
 * - Default role for new users is USER
 * - Role changes require proper authorization and audit logging
 */
public enum Role {
    /**
     * Standard user role with basic security monitoring capabilities
     * 
     * Permissions include:
     * - View and manage their own security settings
     * - Monitor their own homes and properties
     * - Receive security alerts and notifications
     * - Manage their own app preferences
     * - View their own security history and logs
     * 
     * Cannot:
     * - Access other users' data or settings
     * - Modify system-wide configurations
     * - Access administrative functions
     * - Manage other users' accounts
     */
    USER,
    
    /**
     * Administrative user role with full system access and management capabilities
     * 
     * Permissions include:
     * - All USER permissions plus:
     * - View and manage all users and their data
     * - Access system-wide configurations and settings
     * - View system logs and analytics
     * - Manage user accounts and roles
     * - Access administrative dashboards and reports
     * - Configure system-wide security policies
     * - Manage system integrations and APIs
     * 
     * Security Considerations:
     * - Should be granted sparingly and only to trusted personnel
     * - All admin actions should be logged and audited
     * - Consider implementing additional authentication for admin functions
     */
    ADMIN
}
