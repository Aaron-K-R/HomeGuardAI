package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.HomeActivity;
import com.homeguard.homeguard_api.enums.ActivityPriority;
import com.homeguard.homeguard_api.enums.ActivityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HomeActivityRepository extends JpaRepository<HomeActivity, String> {
    
    // Get activities for a specific home
    Page<HomeActivity> findByHomeIdOrderByActivityTimestampDesc(String homeId, Pageable pageable);
    
    // Get activities by type
    List<HomeActivity> findByHomeIdAndActivityTypeOrderByActivityTimestampDesc(String homeId, ActivityType activityType);
    
    // Get activities by priority
    List<HomeActivity> findByHomeIdAndPriorityOrderByActivityTimestampDesc(String homeId, ActivityPriority priority);
    
    // Get unacknowledged activities
    List<HomeActivity> findByHomeIdAndIsAcknowledgedFalseOrderByActivityTimestampDesc(String homeId);
    
    // Get unresolved activities
    List<HomeActivity> findByHomeIdAndIsResolvedFalseOrderByActivityTimestampDesc(String homeId);
    
    // Get activities within time range
    @Query("SELECT ha FROM HomeActivity ha WHERE ha.home.id = :homeId AND ha.activityTimestamp BETWEEN :startTime AND :endTime ORDER BY ha.activityTimestamp DESC")
    List<HomeActivity> findActivitiesByHomeIdAndTimeRange(@Param("homeId") String homeId, 
                                                         @Param("startTime") LocalDateTime startTime, 
                                                         @Param("endTime") LocalDateTime endTime);
    
    // Get recent activities (last 24 hours)
    @Query("SELECT ha FROM HomeActivity ha WHERE ha.home.id = :homeId AND ha.activityTimestamp >= :since ORDER BY ha.activityTimestamp DESC")
    List<HomeActivity> findRecentActivitiesByHomeId(@Param("homeId") String homeId, @Param("since") LocalDateTime since);
    
    // Get activities by person
    List<HomeActivity> findByHomeIdAndPersonIdOrderByActivityTimestampDesc(String homeId, String personId);
    
    // Get activities by device
    List<HomeActivity> findByHomeIdAndDeviceIdOrderByActivityTimestampDesc(String homeId, String deviceId);
    
    // Get critical activities
    @Query("SELECT ha FROM HomeActivity ha WHERE ha.home.id = :homeId AND ha.priority = 'CRITICAL' ORDER BY ha.activityTimestamp DESC")
    List<HomeActivity> findCriticalActivitiesByHomeId(@Param("homeId") String homeId);
    
    // Count unacknowledged activities
    @Query("SELECT COUNT(ha) FROM HomeActivity ha WHERE ha.home.id = :homeId AND ha.isAcknowledged = false")
    Long countUnacknowledgedActivitiesByHomeId(@Param("homeId") String homeId);
    
    // Count unresolved activities
    @Query("SELECT COUNT(ha) FROM HomeActivity ha WHERE ha.home.id = :homeId AND ha.isResolved = false")
    Long countUnresolvedActivitiesByHomeId(@Param("homeId") String homeId);
}
