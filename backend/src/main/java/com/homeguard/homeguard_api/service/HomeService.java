package com.homeguard.homeguard_api.service;

import com.homeguard.homeguard_api.dto.HomeRequestDto;
import com.homeguard.homeguard_api.dto.HomeResponseDto;
import com.homeguard.homeguard_api.dto.HomeUpdateDto;
import com.homeguard.homeguard_api.exception.HomeNotFoundException;
import com.homeguard.homeguard_api.exception.UserNotFoundException;
import com.homeguard.homeguard_api.model.Home;
import com.homeguard.homeguard_api.model.User;
import com.homeguard.homeguard_api.repository.HomeRepository;
import com.homeguard.homeguard_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HomeService {
    
    private final HomeRepository homeRepository;
    private final UserRepository userRepository;
    
    public HomeResponseDto createHome(String ownerId, HomeRequestDto requestDto) {
        log.info("Creating home '{}' for owner id: {}", requestDto.getName(), ownerId);
        
        // Find owner
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> UserNotFoundException.withId(ownerId));
        
        // If this is set as primary, unset other primary homes
        if (requestDto.getIsPrimary() != null && requestDto.getIsPrimary()) {
            homeRepository.findByOwner(owner).forEach(home -> {
                if (home.getIsPrimary()) {
                    home.setIsPrimary(false);
                    homeRepository.save(home);
                }
            });
        }
        
        // Create new home
        Home home = new Home();
        home.setOwner(owner);
        home.setName(requestDto.getName());
        home.setAddress(requestDto.getAddress());
        home.setCity(requestDto.getCity());
        home.setState(requestDto.getState());
        home.setZipCode(requestDto.getZipCode());
        home.setCountry(requestDto.getCountry());
        home.setLatitude(requestDto.getLatitude());
        home.setLongitude(requestDto.getLongitude());
        home.setHomeType(requestDto.getHomeType());
        home.setIsPrimary(requestDto.getIsPrimary());
        home.setDescription(requestDto.getDescription());
        home.setSecuritySystemType(requestDto.getSecuritySystemType());
        
        Home savedHome = homeRepository.save(home);
        log.info("Home created successfully with id: {}", savedHome.getId());
        
        return convertToResponseDto(savedHome);
    }
    
    @Transactional(readOnly = true)
    public HomeResponseDto getHomeById(String id) {
        log.info("Fetching home with id: {}", id);
        
        Home home = homeRepository.findById(id)
            .orElseThrow(() -> HomeNotFoundException.withId(id));
        
        return convertToResponseDto(home);
    }
    
    @Transactional(readOnly = true)
    public List<HomeResponseDto> getHomesByOwnerId(String ownerId) {
        log.info("Fetching homes for owner id: {}", ownerId);
        
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> UserNotFoundException.withId(ownerId));
        
        return homeRepository.findByOwner(owner).stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public HomeResponseDto getPrimaryHomeByOwnerId(String ownerId) {
        log.info("Fetching primary home for owner id: {}", ownerId);
        
        User owner = userRepository.findById(ownerId)
            .orElseThrow(() -> UserNotFoundException.withId(ownerId));
        
        Home home = homeRepository.findPrimaryHomeByOwner(owner)
            .orElseThrow(() -> new HomeNotFoundException("No primary home found for owner id: " + ownerId));
        
        return convertToResponseDto(home);
    }
    
    @Transactional(readOnly = true)
    public List<HomeResponseDto> getAllHomes() {
        log.info("Fetching all homes");
        
        return homeRepository.findAll().stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<HomeResponseDto> getAllHomes(Pageable pageable) {
        log.info("Fetching homes with pagination");
        
        return homeRepository.findAll(pageable)
            .map(this::convertToResponseDto);
    }
    
    @Transactional(readOnly = true)
    public List<HomeResponseDto> getHomesByCity(String city) {
        log.info("Fetching homes in city: {}", city);
        
        return homeRepository.findByCity(city).stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<HomeResponseDto> getHomesByState(String state) {
        log.info("Fetching homes in state: {}", state);
        
        return homeRepository.findByState(state).stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<HomeResponseDto> getHomesByHomeType(String homeType) {
        log.info("Fetching homes of type: {}", homeType);
        
        return homeRepository.findByHomeType(homeType).stream()
            .map(this::convertToResponseDto)
            .collect(Collectors.toList());
    }
    
    public HomeResponseDto updateHome(String id, HomeUpdateDto updateDto) {
        log.info("Updating home with id: {}", id);
        
        Home home = homeRepository.findById(id)
            .orElseThrow(() -> HomeNotFoundException.withId(id));
        
        // If setting as primary, unset other primary homes for this owner
        if (updateDto.getIsPrimary() != null && updateDto.getIsPrimary()) {
            homeRepository.findByOwner(home.getOwner()).forEach(h -> {
                if (h.getIsPrimary() && !h.getId().equals(id)) {
                    h.setIsPrimary(false);
                    homeRepository.save(h);
                }
            });
        }
        
        // Update fields if provided
        if (updateDto.getName() != null) {
            home.setName(updateDto.getName());
        }
        if (updateDto.getAddress() != null) {
            home.setAddress(updateDto.getAddress());
        }
        if (updateDto.getCity() != null) {
            home.setCity(updateDto.getCity());
        }
        if (updateDto.getState() != null) {
            home.setState(updateDto.getState());
        }
        if (updateDto.getZipCode() != null) {
            home.setZipCode(updateDto.getZipCode());
        }
        if (updateDto.getCountry() != null) {
            home.setCountry(updateDto.getCountry());
        }
        if (updateDto.getLatitude() != null) {
            home.setLatitude(updateDto.getLatitude());
        }
        if (updateDto.getLongitude() != null) {
            home.setLongitude(updateDto.getLongitude());
        }
        if (updateDto.getHomeType() != null) {
            home.setHomeType(updateDto.getHomeType());
        }
        if (updateDto.getIsPrimary() != null) {
            home.setIsPrimary(updateDto.getIsPrimary());
        }
        if (updateDto.getIsActive() != null) {
            home.setIsActive(updateDto.getIsActive());
        }
        if (updateDto.getDescription() != null) {
            home.setDescription(updateDto.getDescription());
        }
        if (updateDto.getSecuritySystemType() != null) {
            home.setSecuritySystemType(updateDto.getSecuritySystemType());
        }
        
        Home updatedHome = homeRepository.save(home);
        log.info("Home updated successfully with id: {}", updatedHome.getId());
        
        return convertToResponseDto(updatedHome);
    }
    
    public void deleteHome(String id) {
        log.info("Deleting home with id: {}", id);
        
        Home home = homeRepository.findById(id)
            .orElseThrow(() -> HomeNotFoundException.withId(id));
        
        homeRepository.delete(home);
        log.info("Home deleted successfully with id: {}", id);
    }
    
    public HomeResponseDto setPrimaryHome(String id) {
        log.info("Setting home as primary with id: {}", id);
        
        Home home = homeRepository.findById(id)
            .orElseThrow(() -> HomeNotFoundException.withId(id));
        
        // Unset other primary homes for this owner
        homeRepository.findByOwner(home.getOwner()).forEach(h -> {
            if (h.getIsPrimary()) {
                h.setIsPrimary(false);
                homeRepository.save(h);
            }
        });
        
        // Set this home as primary
        home.setIsPrimary(true);
        Home updatedHome = homeRepository.save(home);
        
        return convertToResponseDto(updatedHome);
    }
    
    public HomeResponseDto activateHome(String id) {
        log.info("Activating home with id: {}", id);
        
        Home home = homeRepository.findById(id)
            .orElseThrow(() -> HomeNotFoundException.withId(id));
        
        home.setIsActive(true);
        Home updatedHome = homeRepository.save(home);
        
        return convertToResponseDto(updatedHome);
    }
    
    public HomeResponseDto deactivateHome(String id) {
        log.info("Deactivating home with id: {}", id);
        
        Home home = homeRepository.findById(id)
            .orElseThrow(() -> HomeNotFoundException.withId(id));
        
        home.setIsActive(false);
        Home updatedHome = homeRepository.save(home);
        
        return convertToResponseDto(updatedHome);
    }
    
    private HomeResponseDto convertToResponseDto(Home home) {
        HomeResponseDto responseDto = new HomeResponseDto();
        responseDto.setId(home.getId());
        responseDto.setName(home.getName());
        responseDto.setAddress(home.getAddress());
        responseDto.setCity(home.getCity());
        responseDto.setState(home.getState());
        responseDto.setZipCode(home.getZipCode());
        responseDto.setCountry(home.getCountry());
        responseDto.setLatitude(home.getLatitude());
        responseDto.setLongitude(home.getLongitude());
        responseDto.setHomeType(home.getHomeType());
        responseDto.setIsPrimary(home.getIsPrimary());
        responseDto.setIsActive(home.getIsActive());
        responseDto.setDescription(home.getDescription());
        responseDto.setSecuritySystemType(home.getSecuritySystemType());
        responseDto.setCreatedAt(home.getCreatedAt());
        responseDto.setUpdatedAt(home.getUpdatedAt());
        
        // Set owner information
        responseDto.setOwnerId(home.getOwner().getId());
        responseDto.setOwnerName(home.getOwner().getFirstName() + " " + home.getOwner().getLastName());
        responseDto.setOwnerEmail(home.getOwner().getEmail());
        
        // Set computed fields
        responseDto.setFullAddress(responseDto.getFullAddress());
        responseDto.setDeviceCount(home.getDevices() != null ? home.getDevices().size() : 0);
        responseDto.setHasCoordinates(responseDto.isHasCoordinates());
        
        return responseDto;
    }
}
