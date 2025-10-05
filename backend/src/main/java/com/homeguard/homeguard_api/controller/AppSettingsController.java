package com.homeguard.homeguard_api.controller;

import com.homeguard.homeguard_api.dto.AppSettingsRequestDto;
import com.homeguard.homeguard_api.dto.AppSettingsResponseDto;
import com.homeguard.homeguard_api.dto.AppSettingsUpdateDto;
import com.homeguard.homeguard_api.service.AppSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${base.path}/app-settings")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AppSettingsController {
    
    private final AppSettingsService appSettingsService;
    
    @PostMapping("/user/{userId}")
    public ResponseEntity<AppSettingsResponseDto> createAppSettings(@PathVariable String userId, 
                                                                    @Valid @RequestBody AppSettingsRequestDto requestDto) {
        log.info("Creating app settings for user id: {}", userId);
        AppSettingsResponseDto responseDto = appSettingsService.createAppSettings(userId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AppSettingsResponseDto> getAppSettingsById(@PathVariable String id) {
        log.info("Fetching app settings with id: {}", id);
        AppSettingsResponseDto responseDto = appSettingsService.getAppSettingsById(id);
        return ResponseEntity.ok(responseDto);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<AppSettingsResponseDto> getAppSettingsByUserId(@PathVariable String userId) {
        log.info("Fetching app settings for user id: {}", userId);
        AppSettingsResponseDto responseDto = appSettingsService.getAppSettingsByUserId(userId);
        return ResponseEntity.ok(responseDto);
    }
    
    @GetMapping
    public ResponseEntity<List<AppSettingsResponseDto>> getAllAppSettings() {
        log.info("Fetching all app settings");
        List<AppSettingsResponseDto> responseDtos = appSettingsService.getAllAppSettings();
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/theme/{theme}")
    public ResponseEntity<List<AppSettingsResponseDto>> getAppSettingsByTheme(@PathVariable String theme) {
        log.info("Fetching app settings with theme: {}", theme);
        List<AppSettingsResponseDto> responseDtos = appSettingsService.getAppSettingsByTheme(theme);
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/language/{language}")
    public ResponseEntity<List<AppSettingsResponseDto>> getAppSettingsByLanguage(@PathVariable String language) {
        log.info("Fetching app settings with language: {}", language);
        List<AppSettingsResponseDto> responseDtos = appSettingsService.getAppSettingsByLanguage(language);
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/push-notifications")
    public ResponseEntity<List<AppSettingsResponseDto>> getAppSettingsWithPushNotifications() {
        log.info("Fetching app settings with push notifications enabled");
        List<AppSettingsResponseDto> responseDtos = appSettingsService.getAppSettingsWithPushNotifications();
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/biometric-login")
    public ResponseEntity<List<AppSettingsResponseDto>> getAppSettingsWithBiometricLogin() {
        log.info("Fetching app settings with biometric login enabled");
        List<AppSettingsResponseDto> responseDtos = appSettingsService.getAppSettingsWithBiometricLogin();
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/wifi-only")
    public ResponseEntity<List<AppSettingsResponseDto>> getAppSettingsWithWifiOnly() {
        log.info("Fetching app settings with WiFi-only data usage enabled");
        List<AppSettingsResponseDto> responseDtos = appSettingsService.getAppSettingsWithWifiOnly();
        return ResponseEntity.ok(responseDtos);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AppSettingsResponseDto> updateAppSettings(@PathVariable String id, 
                                                                    @Valid @RequestBody AppSettingsUpdateDto updateDto) {
        log.info("Updating app settings with id: {}", id);
        AppSettingsResponseDto responseDto = appSettingsService.updateAppSettings(id, updateDto);
        return ResponseEntity.ok(responseDto);
    }
    
    @PutMapping("/user/{userId}")
    public ResponseEntity<AppSettingsResponseDto> updateAppSettingsByUserId(@PathVariable String userId, 
                                                                            @Valid @RequestBody AppSettingsUpdateDto updateDto) {
        log.info("Updating app settings for user id: {}", userId);
        AppSettingsResponseDto responseDto = appSettingsService.updateAppSettingsByUserId(userId, updateDto);
        return ResponseEntity.ok(responseDto);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppSettings(@PathVariable String id) {
        log.info("Deleting app settings with id: {}", id);
        appSettingsService.deleteAppSettings(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAppSettingsByUserId(@PathVariable String userId) {
        log.info("Deleting app settings for user id: {}", userId);
        appSettingsService.deleteAppSettingsByUserId(userId);
        return ResponseEntity.noContent().build();
    }
}
