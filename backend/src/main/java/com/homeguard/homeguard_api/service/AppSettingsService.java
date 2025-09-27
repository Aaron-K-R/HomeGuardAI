package com.homeguard.homeguard_api.service;

import com.homeguard.homeguard_api.dto.AppSettingsRequestDto;
import com.homeguard.homeguard_api.dto.AppSettingsResponseDto;
import com.homeguard.homeguard_api.dto.AppSettingsUpdateDto;
import com.homeguard.homeguard_api.exception.AppSettingsNotFoundException;
import com.homeguard.homeguard_api.exception.UserNotFoundException;
import com.homeguard.homeguard_api.model.AppSettings;
import com.homeguard.homeguard_api.model.User;
import com.homeguard.homeguard_api.repository.AppSettingsRepository;
import com.homeguard.homeguard_api.repository.UserRepository;
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
public class AppSettingsService {
    
    private final AppSettingsRepository appSettingsRepository;
    private final UserRepository userRepository;
    
    public AppSettingsResponseDto createAppSettings(String userId, AppSettingsRequestDto requestDto) {
        log.info("Creating app settings for user id: {}", userId);
        
        // Find user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> UserNotFoundException.withId(userId));
        
        // Check if settings already exist
        if (appSettingsRepository.findByUser(user).isPresent()) {
            throw new AppSettingsNotFoundException("App settings already exist for user id: " + userId);
        }
        
        // Create new app settings
        AppSettings settings = new AppSettings();
        settings.setUser(user);
        settings.setTheme(requestDto.getTheme());
        settings.setLanguage(requestDto.getLanguage());
        settings.setNotificationsEnabled(requestDto.getNotificationsEnabled());
        settings.setPushNotificationsEnabled(requestDto.getPushNotificationsEnabled());
        settings.setEmailNotificationsEnabled(requestDto.getEmailNotificationsEnabled());
        settings.setSmsNotificationsEnabled(requestDto.getSmsNotificationsEnabled());
        settings.setLocationTrackingEnabled(requestDto.getLocationTrackingEnabled());
        settings.setBiometricLoginEnabled(requestDto.getBiometricLoginEnabled());
        settings.setTwoFactorEnabled(requestDto.getTwoFactorEnabled());
        settings.setAutoLockTimeout(requestDto.getAutoLockTimeout());
        settings.setDataUsageWifiOnly(requestDto.getDataUsageWifiOnly());
        
        AppSettings savedSettings = appSettingsRepository.save(settings);
        log.info("App settings created successfully with id: {}", savedSettings.getId());
        
        return convertToResponseDto(savedSettings);
    }
    
    @Transactional(readOnly = true)
    public AppSettingsResponseDto getAppSettingsById(String id) {
        log.info("Fetching app settings with id: {}", id);
        
        AppSettings settings = appSettingsRepository.findById(id)
            .orElseThrow(() -> AppSettingsNotFoundException.withId(id));
        
        return convertToResponseDto(settings);
    }
    
    @Transactional(readOnly = true)
    public AppSettingsResponseDto getAppSettingsByUserId(String userId) {
        log.info("Fetching app settings for user id: {}", userId);
        
        AppSettings settings = appSettingsRepository.findByUserId(userId)
            .orElseGet(() -> {
                log.info("No app settings found for user id: {}, creating default settings", userId);
                return createDefaultAppSettings(userId);
            });
        
        return convertToResponseDto(settings);
    }
    
    @Transactional(readOnly = true)
    public List<AppSettingsResponseDto> getAllAppSettings() {
        log.info("Fetching all app settings");
        
        return appSettingsRepository.findAll().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AppSettingsResponseDto> getAppSettingsByTheme(String theme) {
        log.info("Fetching app settings with theme: {}", theme);
        
        return appSettingsRepository.findByTheme(theme).stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AppSettingsResponseDto> getAppSettingsByLanguage(String language) {
        log.info("Fetching app settings with language: {}", language);
        
        return appSettingsRepository.findByLanguage(language).stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AppSettingsResponseDto> getAppSettingsWithPushNotifications() {
        log.info("Fetching app settings with push notifications enabled");
        
        return appSettingsRepository.findByPushNotificationsEnabled().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AppSettingsResponseDto> getAppSettingsWithBiometricLogin() {
        log.info("Fetching app settings with biometric login enabled");
        
        return appSettingsRepository.findByBiometricLoginEnabled().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AppSettingsResponseDto> getAppSettingsWithWifiOnly() {
        log.info("Fetching app settings with WiFi-only data usage enabled");
        
        return appSettingsRepository.findByDataUsageWifiOnly().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public AppSettingsResponseDto updateAppSettings(String id, AppSettingsUpdateDto updateDto) {
        log.info("Updating app settings with id: {}", id);
        
        AppSettings settings = appSettingsRepository.findById(id)
            .orElseThrow(() -> AppSettingsNotFoundException.withId(id));
        
        // Update fields if provided
        if (updateDto.getTheme() != null) {
            settings.setTheme(updateDto.getTheme());
        }
        if (updateDto.getLanguage() != null) {
            settings.setLanguage(updateDto.getLanguage());
        }
        if (updateDto.getNotificationsEnabled() != null) {
            settings.setNotificationsEnabled(updateDto.getNotificationsEnabled());
        }
        if (updateDto.getPushNotificationsEnabled() != null) {
            settings.setPushNotificationsEnabled(updateDto.getPushNotificationsEnabled());
        }
        if (updateDto.getEmailNotificationsEnabled() != null) {
            settings.setEmailNotificationsEnabled(updateDto.getEmailNotificationsEnabled());
        }
        if (updateDto.getSmsNotificationsEnabled() != null) {
            settings.setSmsNotificationsEnabled(updateDto.getSmsNotificationsEnabled());
        }
        if (updateDto.getLocationTrackingEnabled() != null) {
            settings.setLocationTrackingEnabled(updateDto.getLocationTrackingEnabled());
        }
        if (updateDto.getBiometricLoginEnabled() != null) {
            settings.setBiometricLoginEnabled(updateDto.getBiometricLoginEnabled());
        }
        if (updateDto.getTwoFactorEnabled() != null) {
            settings.setTwoFactorEnabled(updateDto.getTwoFactorEnabled());
        }
        if (updateDto.getAutoLockTimeout() != null) {
            settings.setAutoLockTimeout(updateDto.getAutoLockTimeout());
        }
        if (updateDto.getDataUsageWifiOnly() != null) {
            settings.setDataUsageWifiOnly(updateDto.getDataUsageWifiOnly());
        }
        
        AppSettings updatedSettings = appSettingsRepository.save(settings);
        log.info("App settings updated successfully with id: {}", updatedSettings.getId());
        
        return convertToResponseDto(updatedSettings);
    }
    
    public AppSettingsResponseDto updateAppSettingsByUserId(String userId, AppSettingsUpdateDto updateDto) {
        log.info("Updating app settings for user id: {}", userId);
        
        AppSettings settings = appSettingsRepository.findByUserId(userId)
            .orElseThrow(() -> AppSettingsNotFoundException.withUserId(userId));
        
        return updateAppSettings(settings.getId(), updateDto);
    }
    
    public void deleteAppSettings(String id) {
        log.info("Deleting app settings with id: {}", id);
        
        AppSettings settings = appSettingsRepository.findById(id)
            .orElseThrow(() -> AppSettingsNotFoundException.withId(id));
        
        appSettingsRepository.delete(settings);
        log.info("App settings deleted successfully with id: {}", id);
    }
    
    public void deleteAppSettingsByUserId(String userId) {
        log.info("Deleting app settings for user id: {}", userId);
        
        AppSettings settings = appSettingsRepository.findByUserId(userId)
            .orElseThrow(() -> AppSettingsNotFoundException.withUserId(userId));
        
        appSettingsRepository.delete(settings);
        log.info("App settings deleted successfully for user id: {}", userId);
    }
    
    private AppSettings createDefaultAppSettings(String userId) {
        log.info("Creating default app settings for user id: {}", userId);
        
        // Find user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> UserNotFoundException.withId(userId));
        
        // Create new app settings with default values
        AppSettings settings = new AppSettings();
        settings.setUser(user);
        // All other fields will use the default values defined in the AppSettings model
        
        AppSettings savedSettings = appSettingsRepository.save(settings);
        log.info("Default app settings created successfully with id: {}", savedSettings.getId());
        
        return savedSettings;
    }
    
    private AppSettingsResponseDto convertToResponseDto(AppSettings settings) {
        AppSettingsResponseDto responseDto = new AppSettingsResponseDto();
        responseDto.setId(settings.getId());
        responseDto.setUserId(settings.getUser().getId());
        responseDto.setUserEmail(settings.getUser().getEmail());
        responseDto.setUserName(settings.getUser().getFirstName() + " " + settings.getUser().getLastName());
        
        // UI/UX Settings
        responseDto.setTheme(settings.getTheme());
        responseDto.setLanguage(settings.getLanguage());
        
        // Notification Settings
        responseDto.setNotificationsEnabled(settings.getNotificationsEnabled());
        responseDto.setPushNotificationsEnabled(settings.getPushNotificationsEnabled());
        responseDto.setEmailNotificationsEnabled(settings.getEmailNotificationsEnabled());
        responseDto.setSmsNotificationsEnabled(settings.getSmsNotificationsEnabled());
        
        // Security Settings
        responseDto.setBiometricLoginEnabled(settings.getBiometricLoginEnabled());
        responseDto.setTwoFactorEnabled(settings.getTwoFactorEnabled());
        responseDto.setAutoLockTimeout(settings.getAutoLockTimeout());
        
        // Performance Settings
        responseDto.setDataUsageWifiOnly(settings.getDataUsageWifiOnly());
        responseDto.setLocationTrackingEnabled(settings.getLocationTrackingEnabled());
        
        responseDto.setCreatedAt(settings.getCreatedAt());
        responseDto.setUpdatedAt(settings.getUpdatedAt());
        
        // Set computed fields
        responseDto.setHasNotificationsEnabled(responseDto.isHasNotificationsEnabled());
        responseDto.setHasLocationFeaturesEnabled(responseDto.isHasLocationFeaturesEnabled());
        responseDto.setAccessibilityLevel(responseDto.getAccessibilityLevel());
        
        return responseDto;
    }
}
