package com.homeguard.homeguard_api.controller;

import com.homeguard.homeguard_api.dto.SecuritySettingsRequestDto;
import com.homeguard.homeguard_api.dto.SecuritySettingsResponseDto;
import com.homeguard.homeguard_api.dto.SecuritySettingsUpdateDto;
import com.homeguard.homeguard_api.service.SecuritySettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/security-settings")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class SecuritySettingsController {
    
    private final SecuritySettingsService securitySettingsService;
    
    @PostMapping("/home/{homeId}")
    public ResponseEntity<SecuritySettingsResponseDto> createSecuritySettings(@PathVariable String homeId, 
                                                                              @Valid @RequestBody SecuritySettingsRequestDto requestDto) {
        log.info("Creating security settings for home id: {}", homeId);
        SecuritySettingsResponseDto responseDto = securitySettingsService.createSecuritySettings(homeId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SecuritySettingsResponseDto> getSecuritySettingsById(@PathVariable String id) {
        log.info("Fetching security settings with id: {}", id);
        SecuritySettingsResponseDto responseDto = securitySettingsService.getSecuritySettingsById(id);
        return ResponseEntity.ok(responseDto);
    }
    
    @GetMapping("/home/{homeId}")
    public ResponseEntity<SecuritySettingsResponseDto> getSecuritySettingsByHomeId(@PathVariable String homeId) {
        log.info("Fetching security settings for home id: {}", homeId);
        SecuritySettingsResponseDto responseDto = securitySettingsService.getSecuritySettingsByHomeId(homeId);
        return ResponseEntity.ok(responseDto);
    }
    
    @GetMapping
    public ResponseEntity<List<SecuritySettingsResponseDto>> getAllSecuritySettings() {
        log.info("Fetching all security settings");
        List<SecuritySettingsResponseDto> responseDtos = securitySettingsService.getAllSecuritySettings();
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/motion-detection")
    public ResponseEntity<List<SecuritySettingsResponseDto>> getSecuritySettingsWithMotionDetection() {
        log.info("Fetching security settings with motion detection enabled");
        List<SecuritySettingsResponseDto> responseDtos = securitySettingsService.getSecuritySettingsWithMotionDetection();
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/night-vision")
    public ResponseEntity<List<SecuritySettingsResponseDto>> getSecuritySettingsWithNightVision() {
        log.info("Fetching security settings with night vision enabled");
        List<SecuritySettingsResponseDto> responseDtos = securitySettingsService.getSecuritySettingsWithNightVision();
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/emergency-contacts")
    public ResponseEntity<List<SecuritySettingsResponseDto>> getSecuritySettingsWithEmergencyContacts() {
        log.info("Fetching security settings with emergency contacts enabled");
        List<SecuritySettingsResponseDto> responseDtos = securitySettingsService.getSecuritySettingsWithEmergencyContacts();
        return ResponseEntity.ok(responseDtos);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SecuritySettingsResponseDto> updateSecuritySettings(@PathVariable String id, 
                                                                              @Valid @RequestBody SecuritySettingsUpdateDto updateDto) {
        log.info("Updating security settings with id: {}", id);
        SecuritySettingsResponseDto responseDto = securitySettingsService.updateSecuritySettings(id, updateDto);
        return ResponseEntity.ok(responseDto);
    }
    
    @PutMapping("/home/{homeId}")
    public ResponseEntity<SecuritySettingsResponseDto> updateSecuritySettingsByHomeId(@PathVariable String homeId, 
                                                                                      @Valid @RequestBody SecuritySettingsUpdateDto updateDto) {
        log.info("Updating security settings for home id: {}", homeId);
        SecuritySettingsResponseDto responseDto = securitySettingsService.updateSecuritySettingsByHomeId(homeId, updateDto);
        return ResponseEntity.ok(responseDto);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSecuritySettings(@PathVariable String id) {
        log.info("Deleting security settings with id: {}", id);
        securitySettingsService.deleteSecuritySettings(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/home/{homeId}")
    public ResponseEntity<Void> deleteSecuritySettingsByHomeId(@PathVariable String homeId) {
        log.info("Deleting security settings for home id: {}", homeId);
        securitySettingsService.deleteSecuritySettingsByHomeId(homeId);
        return ResponseEntity.noContent().build();
    }
}
