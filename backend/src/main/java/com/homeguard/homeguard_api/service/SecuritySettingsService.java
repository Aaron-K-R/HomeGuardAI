package com.homeguard.homeguard_api.service;

import com.homeguard.homeguard_api.dto.SecuritySettingsRequestDto;
import com.homeguard.homeguard_api.dto.SecuritySettingsResponseDto;
import com.homeguard.homeguard_api.dto.SecuritySettingsUpdateDto;
import com.homeguard.homeguard_api.exception.SecuritySettingsNotFoundException;
import com.homeguard.homeguard_api.exception.HomeNotFoundException;
import com.homeguard.homeguard_api.model.SecuritySettings;
import com.homeguard.homeguard_api.model.Home;
import com.homeguard.homeguard_api.repository.SecuritySettingsRepository;
import com.homeguard.homeguard_api.repository.HomeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SecuritySettingsService {
    
    private final SecuritySettingsRepository securitySettingsRepository;
    private final HomeRepository homeRepository;
    
    public SecuritySettingsResponseDto createSecuritySettings(String homeId, SecuritySettingsRequestDto requestDto) {
        log.info("Creating security settings for home id: {}", homeId);
        
        // Find home
        Home home = homeRepository.findById(homeId)
            .orElseThrow(() -> HomeNotFoundException.withId(homeId));
        
        // Check if settings already exist - if they do, return existing settings
        if (securitySettingsRepository.findByHome(home).isPresent()) {
            log.info("Security settings already exist for home id: {}, returning existing settings", homeId);
            return getSecuritySettingsByHomeId(homeId);
        }
        
        // Create new security settings
        SecuritySettings settings = new SecuritySettings();
        settings.setHome(home);
        settings.setMotionDetectionEnabled(requestDto.getMotionDetectionEnabled());
        settings.setDoorSensorEnabled(requestDto.getDoorSensorEnabled());
        settings.setWindowSensorEnabled(requestDto.getWindowSensorEnabled());
        settings.setCameraRecordingEnabled(requestDto.getCameraRecordingEnabled());
        settings.setNightVisionEnabled(requestDto.getNightVisionEnabled());
        settings.setAlarmSensitivityLevel(requestDto.getAlarmSensitivityLevel());
        settings.setAutoArmTime(requestDto.getAutoArmTime());
        settings.setAutoDisarmTime(requestDto.getAutoDisarmTime());
        settings.setEmergencyContactsNotified(requestDto.getEmergencyContactsNotified());
        settings.setPoliceNotificationEnabled(requestDto.getPoliceNotificationEnabled());
        
        SecuritySettings savedSettings = securitySettingsRepository.save(settings);
        log.info("Security settings created successfully with id: {}", savedSettings.getId());
        
        return convertToResponseDto(savedSettings);
    }
    
    @Transactional(readOnly = true)
    public SecuritySettingsResponseDto getSecuritySettingsById(String id) {
        log.info("Fetching security settings with id: {}", id);
        
        SecuritySettings settings = securitySettingsRepository.findById(id)
            .orElseThrow(() -> SecuritySettingsNotFoundException.withId(id));
        
        return convertToResponseDto(settings);
    }
    
    @Transactional(readOnly = true)
    public SecuritySettingsResponseDto getSecuritySettingsByHomeId(String homeId) {
        log.info("Fetching security settings for home id: {}", homeId);
        
        SecuritySettings settings = securitySettingsRepository.findByHomeId(homeId)
            .orElseGet(() -> {
                log.info("No security settings found for home id: {}, creating default settings", homeId);
                return createDefaultSecuritySettings(homeId);
            });
        
        return convertToResponseDto(settings);
    }
    
    @Transactional(readOnly = true)
    public List<SecuritySettingsResponseDto> getAllSecuritySettings() {
        log.info("Fetching all security settings");
        
        return securitySettingsRepository.findAll().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SecuritySettingsResponseDto> getSecuritySettingsWithMotionDetection() {
        log.info("Fetching security settings with motion detection enabled");
        
        return securitySettingsRepository.findByMotionDetectionEnabled().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SecuritySettingsResponseDto> getSecuritySettingsWithNightVision() {
        log.info("Fetching security settings with night vision enabled");
        
        return securitySettingsRepository.findByNightVisionEnabled().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SecuritySettingsResponseDto> getSecuritySettingsWithEmergencyContacts() {
        log.info("Fetching security settings with emergency contacts enabled");
        
        return securitySettingsRepository.findByEmergencyContactsNotified().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public SecuritySettingsResponseDto updateSecuritySettings(String id, SecuritySettingsUpdateDto updateDto) {
        log.info("Updating security settings with id: {}", id);
        
        SecuritySettings settings = securitySettingsRepository.findById(id)
            .orElseThrow(() -> SecuritySettingsNotFoundException.withId(id));
        
        // Update fields if provided
        if (updateDto.getMotionDetectionEnabled() != null) {
            settings.setMotionDetectionEnabled(updateDto.getMotionDetectionEnabled());
        }
        if (updateDto.getDoorSensorEnabled() != null) {
            settings.setDoorSensorEnabled(updateDto.getDoorSensorEnabled());
        }
        if (updateDto.getWindowSensorEnabled() != null) {
            settings.setWindowSensorEnabled(updateDto.getWindowSensorEnabled());
        }
        if (updateDto.getCameraRecordingEnabled() != null) {
            settings.setCameraRecordingEnabled(updateDto.getCameraRecordingEnabled());
        }
        if (updateDto.getNightVisionEnabled() != null) {
            settings.setNightVisionEnabled(updateDto.getNightVisionEnabled());
        }
        if (updateDto.getAlarmSensitivityLevel() != null) {
            settings.setAlarmSensitivityLevel(updateDto.getAlarmSensitivityLevel());
        }
        if (updateDto.getAutoArmTime() != null) {
            settings.setAutoArmTime(updateDto.getAutoArmTime());
        }
        if (updateDto.getAutoDisarmTime() != null) {
            settings.setAutoDisarmTime(updateDto.getAutoDisarmTime());
        }
        if (updateDto.getEmergencyContactsNotified() != null) {
            settings.setEmergencyContactsNotified(updateDto.getEmergencyContactsNotified());
        }
        if (updateDto.getPoliceNotificationEnabled() != null) {
            settings.setPoliceNotificationEnabled(updateDto.getPoliceNotificationEnabled());
        }
        
        SecuritySettings updatedSettings = securitySettingsRepository.save(settings);
        log.info("Security settings updated successfully with id: {}", updatedSettings.getId());
        
        return convertToResponseDto(updatedSettings);
    }
    
    public SecuritySettingsResponseDto updateSecuritySettingsByHomeId(String homeId, SecuritySettingsUpdateDto updateDto) {
        log.info("Updating security settings for home id: {}", homeId);
        
        SecuritySettings settings = securitySettingsRepository.findByHomeId(homeId)
            .orElseThrow(() -> SecuritySettingsNotFoundException.withHomeId(homeId));
        
        return updateSecuritySettings(settings.getId(), updateDto);
    }
    
    public void deleteSecuritySettings(String id) {
        log.info("Deleting security settings with id: {}", id);
        
        SecuritySettings settings = securitySettingsRepository.findById(id)
            .orElseThrow(() -> SecuritySettingsNotFoundException.withId(id));
        
        securitySettingsRepository.delete(settings);
        log.info("Security settings deleted successfully with id: {}", id);
    }
    
    public void deleteSecuritySettingsByHomeId(String homeId) {
        log.info("Deleting security settings for home id: {}", homeId);
        
        SecuritySettings settings = securitySettingsRepository.findByHomeId(homeId)
            .orElseThrow(() -> SecuritySettingsNotFoundException.withHomeId(homeId));
        
        securitySettingsRepository.delete(settings);
        log.info("Security settings deleted successfully for home id: {}", homeId);
    }
    
    private SecuritySettingsResponseDto convertToResponseDto(SecuritySettings settings) {
        SecuritySettingsResponseDto responseDto = new SecuritySettingsResponseDto();
        responseDto.setId(settings.getId());
        responseDto.setHomeId(settings.getHome().getId());
        responseDto.setHomeName(settings.getHome().getName());
        responseDto.setHomeAddress(settings.getHome().getAddress());
        responseDto.setOwnerId(settings.getHome().getOwner().getId());
        responseDto.setOwnerName(settings.getHome().getOwner().getFirstName() + " " + settings.getHome().getOwner().getLastName());
        responseDto.setOwnerEmail(settings.getHome().getOwner().getEmail());
        
        // Security Features
        responseDto.setMotionDetectionEnabled(settings.getMotionDetectionEnabled());
        responseDto.setDoorSensorEnabled(settings.getDoorSensorEnabled());
        responseDto.setWindowSensorEnabled(settings.getWindowSensorEnabled());
        responseDto.setCameraRecordingEnabled(settings.getCameraRecordingEnabled());
        responseDto.setNightVisionEnabled(settings.getNightVisionEnabled());
        responseDto.setAlarmSensitivityLevel(settings.getAlarmSensitivityLevel());
        responseDto.setAutoArmTime(settings.getAutoArmTime());
        responseDto.setAutoDisarmTime(settings.getAutoDisarmTime());
        responseDto.setEmergencyContactsNotified(settings.getEmergencyContactsNotified());
        responseDto.setPoliceNotificationEnabled(settings.getPoliceNotificationEnabled());
        
        responseDto.setCreatedAt(settings.getCreatedAt());
        responseDto.setUpdatedAt(settings.getUpdatedAt());
        
        // Set computed fields
        responseDto.setHasAutoArming(responseDto.isHasAutoArming());
        responseDto.setSecurityLevel(responseDto.getSecurityLevel());
        
        return responseDto;
    }
    
    /**
     * Creates default security settings for a home if they don't exist
     */
    private SecuritySettings createDefaultSecuritySettings(String homeId) {
        Home home = homeRepository.findById(homeId)
            .orElseThrow(() -> HomeNotFoundException.withId(homeId));
        
        SecuritySettings settings = new SecuritySettings();
        settings.setHome(home);
        
        // Set default values (same as in HomeService)
        settings.setMotionDetectionEnabled(true);
        settings.setDoorSensorEnabled(true);
        settings.setWindowSensorEnabled(true);
        settings.setCameraRecordingEnabled(true);
        settings.setNightVisionEnabled(true);
        settings.setAlarmSensitivityLevel(5);
        settings.setAutoArmTime("22:00");
        settings.setAutoDisarmTime("07:00");
        settings.setEmergencyContactsNotified(true);
        settings.setPoliceNotificationEnabled(false);
        
        return securitySettingsRepository.save(settings);
    }
}
