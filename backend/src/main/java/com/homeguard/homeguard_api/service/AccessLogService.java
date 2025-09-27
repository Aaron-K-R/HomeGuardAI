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

@Service
@RequiredArgsConstructor
@Transactional
public class AccessLogService {
    
    private final AccessLogRepository accessLogRepository;
    
    public AccessLog createAccessLog(AccessLog accessLog) {
        accessLog.setId(UUID.randomUUID().toString());
        accessLog.setCreatedAt(LocalDateTime.now());
        accessLog.setUpdatedAt(LocalDateTime.now());
        return accessLogRepository.save(accessLog);
    }
    
    public Page<AccessLog> getAccessLogsByHomeId(String homeId, Pageable pageable) {
        return accessLogRepository.findAccessLogsByHomeId(homeId, pageable);
    }
    
    public List<AccessLog> getAccessLogsByDeviceId(String deviceId) {
        return accessLogRepository.findByDeviceIdOrderByCreatedAtDesc(deviceId, Pageable.unpaged()).getContent();
    }
    
    public List<AccessLog> getAccessLogsByUserId(String userId) {
        return accessLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<AccessLog> getAccessLogsByPersonId(String personId) {
        return accessLogRepository.findByPersonIdOrderByCreatedAtDesc(personId);
    }
    
    public List<AccessLog> getAccessLogsByHomeIdAndTimeRange(String homeId, LocalDateTime startTime, LocalDateTime endTime) {
        return accessLogRepository.findAccessLogsByHomeIdAndTimeRange(homeId, startTime, endTime);
    }
}
