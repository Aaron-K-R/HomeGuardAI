package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.enums.Role;
import com.homeguard.homeguard_api.enums.UserState;
import com.homeguard.homeguard_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByUserState(UserState userState);
    
    @Query("SELECT u FROM User u WHERE u.userState = 'ACTIVE'")
    List<User> findActiveUsers();
    
    @Query("SELECT u FROM User u JOIN u.homes h WHERE h.id = :homeId")
    List<User> findByHomeId(@Param("homeId") String homeId);
    
    @Query("SELECT u FROM User u JOIN u.homes h WHERE h.id = :homeId AND u.userState = :userState")
    List<User> findByHomeIdAndUserState(@Param("homeId") String homeId, @Param("userState") UserState userState);
    
    @Query("SELECT u FROM User u WHERE u.email LIKE %:email%")
    List<User> findByEmailContaining(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.userState = :userState")
    long countByUserState(@Param("userState") UserState userState);
}
