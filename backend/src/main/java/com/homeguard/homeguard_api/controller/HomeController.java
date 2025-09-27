package com.homeguard.homeguard_api.controller;

import com.homeguard.homeguard_api.dto.HomeRequestDto;
import com.homeguard.homeguard_api.dto.HomeResponseDto;
import com.homeguard.homeguard_api.dto.HomeUpdateDto;
import com.homeguard.homeguard_api.service.HomeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${base.path}/homes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class HomeController {
    
    private final HomeService homeService;
    
    @PostMapping("/owner/{ownerId}")
    public ResponseEntity<HomeResponseDto> createHome(@PathVariable String ownerId, 
                                                     @Valid @RequestBody HomeRequestDto requestDto) {
        log.info("Creating home for owner id: {}", ownerId);
        HomeResponseDto responseDto = homeService.createHome(ownerId, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<HomeResponseDto> getHomeById(@PathVariable String id) {
        log.info("Fetching home with id: {}", id);
        HomeResponseDto responseDto = homeService.getHomeById(id);
        return ResponseEntity.ok(responseDto);
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<HomeResponseDto>> getHomesByOwnerId(@PathVariable String ownerId) {
        log.info("Fetching homes for owner id: {}", ownerId);
        List<HomeResponseDto> responseDtos = homeService.getHomesByOwnerId(ownerId);
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/owner/{ownerId}/primary")
    public ResponseEntity<HomeResponseDto> getPrimaryHomeByOwnerId(@PathVariable String ownerId) {
        log.info("Fetching primary home for owner id: {}", ownerId);
        HomeResponseDto responseDto = homeService.getPrimaryHomeByOwnerId(ownerId);
        return ResponseEntity.ok(responseDto);
    }
    
    @GetMapping
    public ResponseEntity<List<HomeResponseDto>> getAllHomes() {
        log.info("Fetching all homes");
        List<HomeResponseDto> responseDtos = homeService.getAllHomes();
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/page")
    public ResponseEntity<Page<HomeResponseDto>> getAllHomes(Pageable pageable) {
        log.info("Fetching homes with pagination");
        Page<HomeResponseDto> responseDtos = homeService.getAllHomes(pageable);
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/city/{city}")
    public ResponseEntity<List<HomeResponseDto>> getHomesByCity(@PathVariable String city) {
        log.info("Fetching homes in city: {}", city);
        List<HomeResponseDto> responseDtos = homeService.getHomesByCity(city);
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/state/{state}")
    public ResponseEntity<List<HomeResponseDto>> getHomesByState(@PathVariable String state) {
        log.info("Fetching homes in state: {}", state);
        List<HomeResponseDto> responseDtos = homeService.getHomesByState(state);
        return ResponseEntity.ok(responseDtos);
    }
    
    @GetMapping("/type/{homeType}")
    public ResponseEntity<List<HomeResponseDto>> getHomesByHomeType(@PathVariable String homeType) {
        log.info("Fetching homes of type: {}", homeType);
        List<HomeResponseDto> responseDtos = homeService.getHomesByHomeType(homeType);
        return ResponseEntity.ok(responseDtos);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HomeResponseDto> updateHome(@PathVariable String id, 
                                                     @Valid @RequestBody HomeUpdateDto updateDto) {
        log.info("Updating home with id: {}", id);
        HomeResponseDto responseDto = homeService.updateHome(id, updateDto);
        return ResponseEntity.ok(responseDto);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHome(@PathVariable String id) {
        log.info("Deleting home with id: {}", id);
        homeService.deleteHome(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/primary")
    public ResponseEntity<HomeResponseDto> setPrimaryHome(@PathVariable String id) {
        log.info("Setting home as primary with id: {}", id);
        HomeResponseDto responseDto = homeService.setPrimaryHome(id);
        return ResponseEntity.ok(responseDto);
    }
    
    @PatchMapping("/{id}/activate")
    public ResponseEntity<HomeResponseDto> activateHome(@PathVariable String id) {
        log.info("Activating home with id: {}", id);
        HomeResponseDto responseDto = homeService.activateHome(id);
        return ResponseEntity.ok(responseDto);
    }
    
    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<HomeResponseDto> deactivateHome(@PathVariable String id) {
        log.info("Deactivating home with id: {}", id);
        HomeResponseDto responseDto = homeService.deactivateHome(id);
        return ResponseEntity.ok(responseDto);
    }
}
