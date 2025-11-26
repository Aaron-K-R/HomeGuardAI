// ============================================================================
// MODULE: AccessLogService
// PURPOSE: Service layer for managing access logs - records of all entry/exit
//          events including who accessed, when, and through which device
// ============================================================================

package com.homeguard.homeguard_api.service;

import com.homeguard.homeguard_api.model.AccessLog;
import com.homeguard.homeguard_api.repository.AccessLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// --------------Service Class--------------
// PURPOSE: Spring service component for access log management operations
@Service
@RequiredArgsConstructor
@Transactional
public class AccessLogService {
    
    // --------------Repository Dependency--------------
    // PURPOSE: Data access repository for access logs
    private final AccessLogRepository accessLogRepository;
    
    // --------------Create Access Log--------------
    // PURPOSE: Create a new access log entry with generated ID and timestamps
    public AccessLog createAccessLog(AccessLog accessLog) {
        accessLog.setId(UUID.randomUUID().toString());
        accessLog.setCreatedAt(LocalDateTime.now());
        accessLog.setUpdatedAt(LocalDateTime.now());
        return accessLogRepository.save(accessLog);
    }
    
    // --------------Get Access Logs by Home (Paginated)--------------
    // PURPOSE: Retrieve paginated list of access logs for a specific home
    public Page<AccessLog> getAccessLogsByHomeId(String homeId, Pageable pageable) {
        return accessLogRepository.findAccessLogsByHomeId(homeId, pageable);
    }
    
    // --------------Get Access Logs by Device--------------
    // PURPOSE: Retrieve all access logs for a specific device, ordered by most recent
    public List<AccessLog> getAccessLogsByDeviceId(String deviceId) {
        return accessLogRepository.findByDeviceIdOrderByCreatedAtDesc(deviceId, Pageable.unpaged()).getContent();
    }
    
    // --------------Get Access Logs by User--------------
    // PURPOSE: Retrieve all access logs for a specific user, ordered by most recent
    public List<AccessLog> getAccessLogsByUserId(String userId) {
        return accessLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    // --------------Get Access Logs by Person--------------
    // PURPOSE: Retrieve all access logs for a specific person (face profile), ordered by most recent
    public List<AccessLog> getAccessLogsByPersonId(String personId) {
        return accessLogRepository.findByPersonIdOrderByCreatedAtDesc(personId);
    }
    
    // --------------Get Access Logs by Time Range--------------
    // PURPOSE: Retrieve access logs for a home within a specific time period
    public List<AccessLog> getAccessLogsByHomeIdAndTimeRange(String homeId, LocalDateTime startTime, LocalDateTime endTime) {
        return accessLogRepository.findAccessLogsByHomeIdAndTimeRange(homeId, startTime, endTime);
    }
}
