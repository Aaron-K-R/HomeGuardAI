package com.homeguard.homeguard_api.service;

import com.homeguard.homeguard_api.dto.HomeInvitationRequestDto;
import com.homeguard.homeguard_api.dto.HomeInvitationResponseDto;
import com.homeguard.homeguard_api.model.Home;
import com.homeguard.homeguard_api.model.HomeInvitation;
import com.homeguard.homeguard_api.model.User;
import com.homeguard.homeguard_api.repository.HomeInvitationRepository;
import com.homeguard.homeguard_api.repository.HomeRepository;
import com.homeguard.homeguard_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HomeInvitationService {
    
    private final HomeInvitationRepository homeInvitationRepository;
    private final HomeRepository homeRepository;
    private final UserRepository userRepository;
    
    public HomeInvitationResponseDto createInvitation(String homeId, String invitedByUserId, HomeInvitationRequestDto request) {
        Home home = homeRepository.findById(homeId)
            .orElseThrow(() -> new RuntimeException("Home not found"));
        
        User invitedBy = userRepository.findById(invitedByUserId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        HomeInvitation invitation = new HomeInvitation();
        invitation.setId(UUID.randomUUID().toString());
        invitation.setHome(home);
        invitation.setInvitedBy(invitedBy);
        invitation.setEmail(request.getEmail());
        invitation.setInvitationToken(generateInvitationToken());
        invitation.setExpiresAt(LocalDateTime.now().plusDays(7)); // 7 days expiry
        invitation.setIsAccepted(false);
        invitation.setIsActive(true);
        invitation.setCreatedAt(LocalDateTime.now());
        invitation.setUpdatedAt(LocalDateTime.now());
        
        HomeInvitation savedInvitation = homeInvitationRepository.save(invitation);
        return mapToResponseDto(savedInvitation);
    }
    
    public HomeInvitationResponseDto getInvitationByToken(String token) {
        HomeInvitation invitation = homeInvitationRepository.findValidInvitationByToken(token, LocalDateTime.now())
            .orElseThrow(() -> new RuntimeException("Invalid or expired invitation"));
        return mapToResponseDto(invitation);
    }
    
    public HomeInvitationResponseDto acceptInvitation(String token, String userId) {
        HomeInvitation invitation = homeInvitationRepository.findValidInvitationByToken(token, LocalDateTime.now())
            .orElseThrow(() -> new RuntimeException("Invalid or expired invitation"));
        
        invitation.setIsAccepted(true);
        invitation.setAcceptedAt(LocalDateTime.now());
        invitation.setUpdatedAt(LocalDateTime.now());
        
        HomeInvitation savedInvitation = homeInvitationRepository.save(invitation);
        return mapToResponseDto(savedInvitation);
    }
    
    public List<HomeInvitationResponseDto> getInvitationsByHomeId(String homeId) {
        return homeInvitationRepository.findActiveInvitationsByHomeId(homeId)
            .stream()
            .map(this::mapToResponseDto)
            .collect(Collectors.toList());
    }
    
    public List<HomeInvitationResponseDto> getInvitationsByEmail(String email) {
        return homeInvitationRepository.findActiveInvitationsByEmail(email, LocalDateTime.now())
            .stream()
            .map(this::mapToResponseDto)
            .collect(Collectors.toList());
    }
    
    public void cancelInvitation(String invitationId) {
        HomeInvitation invitation = homeInvitationRepository.findById(invitationId)
            .orElseThrow(() -> new RuntimeException("Invitation not found"));
        
        invitation.setIsActive(false);
        invitation.setUpdatedAt(LocalDateTime.now());
        homeInvitationRepository.save(invitation);
    }
    
    private String generateInvitationToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
    
    private HomeInvitationResponseDto mapToResponseDto(HomeInvitation invitation) {
        HomeInvitationResponseDto dto = new HomeInvitationResponseDto();
        dto.setId(invitation.getId());
        dto.setHomeId(invitation.getHome().getId());
        dto.setHomeName(invitation.getHome().getName());
        dto.setInvitedByUserId(invitation.getInvitedBy().getId());
        dto.setInvitedByName(invitation.getInvitedBy().getFirstName() + " " + invitation.getInvitedBy().getLastName());
        dto.setEmail(invitation.getEmail());
        dto.setInvitationToken(invitation.getInvitationToken());
        dto.setExpiresAt(invitation.getExpiresAt());
        dto.setIsAccepted(invitation.getIsAccepted());
        dto.setAcceptedAt(invitation.getAcceptedAt());
        dto.setIsActive(invitation.getIsActive());
        dto.setCreatedAt(invitation.getCreatedAt());
        return dto;
    }
}
