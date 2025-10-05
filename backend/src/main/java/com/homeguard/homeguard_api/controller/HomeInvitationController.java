package com.homeguard.homeguard_api.controller;

import com.homeguard.homeguard_api.dto.HomeInvitationRequestDto;
import com.homeguard.homeguard_api.dto.HomeInvitationResponseDto;
import com.homeguard.homeguard_api.service.HomeInvitationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${base.path}/home-invitations")
@RequiredArgsConstructor
public class HomeInvitationController {
    
    private final HomeInvitationService homeInvitationService;
    
    @PostMapping("/homes/{homeId}/invite")
    public ResponseEntity<HomeInvitationResponseDto> createInvitation(
            @PathVariable String homeId,
            @RequestParam String invitedByUserId,
            @RequestBody HomeInvitationRequestDto request) {
        HomeInvitationResponseDto response = homeInvitationService.createInvitation(homeId, invitedByUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/token/{token}")
    public ResponseEntity<HomeInvitationResponseDto> getInvitationByToken(@PathVariable String token) {
        HomeInvitationResponseDto response = homeInvitationService.getInvitationByToken(token);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/token/{token}/accept")
    public ResponseEntity<HomeInvitationResponseDto> acceptInvitation(
            @PathVariable String token,
            @RequestParam String userId) {
        HomeInvitationResponseDto response = homeInvitationService.acceptInvitation(token, userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/homes/{homeId}")
    public ResponseEntity<List<HomeInvitationResponseDto>> getInvitationsByHomeId(@PathVariable String homeId) {
        List<HomeInvitationResponseDto> response = homeInvitationService.getInvitationsByHomeId(homeId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<List<HomeInvitationResponseDto>> getInvitationsByEmail(@PathVariable String email) {
        List<HomeInvitationResponseDto> response = homeInvitationService.getInvitationsByEmail(email);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{invitationId}")
    public ResponseEntity<Void> cancelInvitation(@PathVariable String invitationId) {
        homeInvitationService.cancelInvitation(invitationId);
        return ResponseEntity.noContent().build();
    }
}
