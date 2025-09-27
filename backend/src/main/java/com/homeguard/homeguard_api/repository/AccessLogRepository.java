package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.AccessLog;
import com.homeguard.homeguard_api.enums.AccessResult;
import com.homeguard.homeguard_api.enums.AccessType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, String> {
    
    Page<AccessLog> findByDeviceIdOrderByCreatedAtDesc(String deviceId, Pageable pageable);
    
    List<AccessLog> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<AccessLog> findByPersonIdOrderByCreatedAtDesc(String personId);
    
    List<AccessLog> findByAccessTypeOrderByCreatedAtDesc(AccessType accessType);
    
    List<AccessLog> findByResultOrderByCreatedAtDesc(AccessResult result);
    
    @Query("SELECT al FROM AccessLog al WHERE al.device.home.id = :homeId ORDER BY al.createdAt DESC")
    Page<AccessLog> findAccessLogsByHomeId(@Param("homeId") String homeId, Pageable pageable);
    
    @Query("SELECT al FROM AccessLog al WHERE al.device.home.id = :homeId AND al.createdAt BETWEEN :startTime AND :endTime ORDER BY al.createdAt DESC")
    List<AccessLog> findAccessLogsByHomeIdAndTimeRange(@Param("homeId") String homeId, 
                                                       @Param("startTime") LocalDateTime startTime, 
                                                       @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT al FROM AccessLog al WHERE al.device.home.id = :homeId AND al.result = :result ORDER BY al.createdAt DESC")
    List<AccessLog> findAccessLogsByHomeIdAndResult(@Param("homeId") String homeId, @Param("result") AccessResult result);
    
    @Query("SELECT al FROM AccessLog al WHERE al.device.home.id = :homeId AND al.accessType = :accessType ORDER BY al.createdAt DESC")
    List<AccessLog> findAccessLogsByHomeIdAndAccessType(@Param("homeId") String homeId, @Param("accessType") AccessType accessType);
}
