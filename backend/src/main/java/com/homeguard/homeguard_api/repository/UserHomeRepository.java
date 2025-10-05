package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.UserHome;
import com.homeguard.homeguard_api.enums.UserHomeRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserHomeRepository extends JpaRepository<UserHome, String> {
    
    List<UserHome> findByUserIdAndIsActiveTrue(String userId);
    
    List<UserHome> findByHomeIdAndIsActiveTrue(String homeId);
    
    Optional<UserHome> findByUserIdAndHomeId(String userId, String homeId);
    
    @Query("SELECT uh FROM UserHome uh WHERE uh.user.id = :userId AND uh.isActive = true")
    List<UserHome> findActiveHomesByUserId(@Param("userId") String userId);
    
    @Query("SELECT uh FROM UserHome uh WHERE uh.home.id = :homeId AND uh.isActive = true")
    List<UserHome> findActiveUsersByHomeId(@Param("homeId") String homeId);
    
    @Query("SELECT uh FROM UserHome uh WHERE uh.home.id = :homeId AND uh.role = :role AND uh.isActive = true")
    List<UserHome> findActiveUsersByHomeIdAndRole(@Param("homeId") String homeId, @Param("role") UserHomeRole role);
}
