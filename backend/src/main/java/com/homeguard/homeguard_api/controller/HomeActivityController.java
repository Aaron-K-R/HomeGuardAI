package com.homeguard.homeguard_api.controller;

import com.homeguard.homeguard_api.dto.HomeActivityRequestDto;
import com.homeguard.homeguard_api.dto.HomeActivityResponseDto;
import com.homeguard.homeguard_api.service.HomeActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${base.path}/home-activities")
@RequiredArgsConstructor
public class HomeActivityController {
    
    private final HomeActivityService homeActivityService;
    
    @PostMapping
    public ResponseEntity<HomeActivityResponseDto> createActivity(@RequestBody HomeActivityRequestDto request) {
        HomeActivityResponseDto response = homeActivityService.createActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/homes/{homeId}")
    public ResponseEntity<Page<HomeActivityResponseDto>> getActivitiesByHomeId(
            @PathVariable String homeId,
            Pageable pageable) {
        Page<HomeActivityResponseDto> response = homeActivityService.getActivitiesByHomeId(homeId, pageable);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/homes/{homeId}/recent")
    public ResponseEntity<List<HomeActivityResponseDto>> getRecentActivitiesByHomeId(
            @PathVariable String homeId,
            @RequestParam(defaultValue = "24") int hours) {
        List<HomeActivityResponseDto> response = homeActivityService.getRecentActivitiesByHomeId(homeId, hours);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/homes/{homeId}/unacknowledged")
    public ResponseEntity<List<HomeActivityResponseDto>> getUnacknowledgedActivitiesByHomeId(@PathVariable String homeId) {
        List<HomeActivityResponseDto> response = homeActivityService.getUnacknowledgedActivitiesByHomeId(homeId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/homes/{homeId}/critical")
    public ResponseEntity<List<HomeActivityResponseDto>> getCriticalActivitiesByHomeId(@PathVariable String homeId) {
        List<HomeActivityResponseDto> response = homeActivityService.getCriticalActivitiesByHomeId(homeId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{activityId}/acknowledge")
    public ResponseEntity<HomeActivityResponseDto> acknowledgeActivity(
            @PathVariable String activityId,
            @RequestParam String userId) {
        HomeActivityResponseDto response = homeActivityService.acknowledgeActivity(activityId, userId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{activityId}/resolve")
    public ResponseEntity<HomeActivityResponseDto> resolveActivity(
            @PathVariable String activityId,
            @RequestParam String userId) {
        HomeActivityResponseDto response = homeActivityService.resolveActivity(activityId, userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/homes/{homeId}/counts")
    public ResponseEntity<Object> getActivityCountsByHomeId(@PathVariable String homeId) {
        Long unacknowledgedCount = homeActivityService.getUnacknowledgedCountByHomeId(homeId);
        Long unresolvedCount = homeActivityService.getUnresolvedCountByHomeId(homeId);
        
        return ResponseEntity.ok(new Object() {
            public final Long unacknowledged = unacknowledgedCount;
            public final Long unresolved = unresolvedCount;
        });
    }
}
