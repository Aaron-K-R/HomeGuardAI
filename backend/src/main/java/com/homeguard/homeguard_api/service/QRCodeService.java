package com.homeguard.homeguard_api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.homeguard.homeguard_api.dto.QRCodeValidationRequestDto;
import com.homeguard.homeguard_api.dto.QRCodeValidationResponseDto;
import com.homeguard.homeguard_api.enums.AccessResult;
import com.homeguard.homeguard_api.enums.AccessType;
import com.homeguard.homeguard_api.model.AccessLog;
import com.homeguard.homeguard_api.model.Device;
import com.homeguard.homeguard_api.repository.DeviceRepository;
import com.homeguard.homeguard_api.repository.HomeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class QRCodeService {
    
    private final HomeRepository homeRepository;
    private final DeviceRepository deviceRepository;
    private final AccessLogService accessLogService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public QRCodeValidationResponseDto validateQRCode(QRCodeValidationRequestDto request) {
        QRCodeValidationResponseDto response = new QRCodeValidationResponseDto();
        response.setResult(AccessResult.DENIED);
        response.setValid(false);
        
        try {
            // Parse QR code JSON data
            @SuppressWarnings("unchecked")
            Map<String, Object> qrData = (Map<String, Object>) objectMapper.readValue(request.getQrData(), Map.class);
            
            String qrHomeId = (String) qrData.get("homeId");
            String qrUserId = (String) qrData.get("userId");
            String accessType = (String) qrData.get("accessType");
            Long expiresAt = qrData.get("expiresAt") != null ? 
                ((Number) qrData.get("expiresAt")).longValue() : null;
            String startDateTime = (String) qrData.get("startDateTime");
            String endDateTime = (String) qrData.get("endDateTime");
            
            // Validate home ID matches
            if (!request.getHomeId().equals(qrHomeId)) {
                response.setMessage("QR code is not valid for this home");
                logAccess(request, AccessResult.DENIED, "Wrong home ID");
                return response;
            }
            
            // Validate home exists
            if (!homeRepository.existsById(request.getHomeId())) {
                response.setMessage("Home not found");
                logAccess(request, AccessResult.DENIED, "Home not found");
                return response;
            }
            
            // Validate device exists and is active
            if (!deviceRepository.findByDeviceId(request.getDeviceId())
                    .map(d -> d.getIsActive() && d.getIsOnline())
                    .orElse(false)) {
                response.setMessage("Device not found or offline");
                logAccess(request, AccessResult.DENIED, "Device not available");
                return response;
            }
            
            // Check expiration
            long currentTime = System.currentTimeMillis();
            if (expiresAt != null && currentTime > expiresAt) {
                response.setMessage("QR code has expired");
                logAccess(request, AccessResult.DENIED, "QR code expired");
                return response;
            }
            
            // Check date/time range if applicable
            if (accessType != null && accessType.equals("datetime")) {
                if (startDateTime != null && endDateTime != null) {
                    // Parse date/time strings (format: "MM/DD/YYYY HH:mm")
                    long startTime = parseDateTime(startDateTime);
                    long endTime = parseDateTime(endDateTime);
                    
                    if (currentTime < startTime || currentTime > endTime) {
                        response.setMessage("QR code is not valid for current date/time");
                        logAccess(request, AccessResult.DENIED, "Outside valid time range");
                        return response;
                    }
                }
            }
            
            // All validations passed
            response.setValid(true);
            response.setResult(AccessResult.GRANTED);
            response.setMessage("Access granted");
            response.setHomeId(qrHomeId);
            response.setUserId(qrUserId);
            response.setAccessType(accessType);
            
            logAccess(request, AccessResult.GRANTED, "QR code validated successfully");
            
        } catch (Exception e) {
            log.error("Error validating QR code: {}", e.getMessage(), e);
            response.setMessage("Invalid QR code format");
            response.setResult(AccessResult.ERROR);
            logAccess(request, AccessResult.ERROR, "Invalid QR code format: " + e.getMessage());
        }
        
        return response;
    }
    
    private long parseDateTime(String dateTimeStr) {
        try {
            // Format: "MM/DD/YYYY HH:mm"
            String[] parts = dateTimeStr.split(" ");
            String[] dateParts = parts[0].split("/");
            String[] timeParts = parts[1].split(":");
            
            int month = Integer.parseInt(dateParts[0]) - 1; // Java months are 0-based
            int day = Integer.parseInt(dateParts[1]);
            int year = Integer.parseInt(dateParts[2]);
            int hour = Integer.parseInt(timeParts[0]);
            int minute = Integer.parseInt(timeParts[1]);
            
            return java.time.LocalDateTime.of(year, month + 1, day, hour, minute)
                .atZone(java.time.ZoneId.systemDefault())
                .toInstant()
                .toEpochMilli();
        } catch (Exception e) {
            log.error("Error parsing date/time: {}", dateTimeStr, e);
            return 0;
        }
    }
    
    private void logAccess(QRCodeValidationRequestDto request, AccessResult result, String reason) {
        try {
            Device device = deviceRepository.findByDeviceId(request.getDeviceId())
                .orElse(null);
            
            if (device != null) {
                AccessLog accessLog = new AccessLog();
                accessLog.setDevice(device);
                accessLog.setAccessType(AccessType.QR_CODE);
                accessLog.setResult(result);
                accessLog.setReason(reason);
                accessLogService.createAccessLog(accessLog);
            }
        } catch (Exception e) {
            log.error("Error creating access log: {}", e.getMessage(), e);
        }
    }
}

