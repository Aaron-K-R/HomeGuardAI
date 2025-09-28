package com.homeguard.homeguard_api.controller;

import com.homeguard.homeguard_api.dto.HomePersonRequestDto;
import com.homeguard.homeguard_api.dto.HomePersonResponseDto;
import com.homeguard.homeguard_api.service.HomePersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${base.path}/home-persons")
@RequiredArgsConstructor
public class HomePersonController {
    
    private final HomePersonService homePersonService;
    
    @PostMapping
    public ResponseEntity<HomePersonResponseDto> linkPersonToHome(@RequestBody HomePersonRequestDto request) {
        HomePersonResponseDto response = homePersonService.linkPersonToHome(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/home/{homeId}")
    public ResponseEntity<List<HomePersonResponseDto>> getPersonsByHomeId(@PathVariable String homeId) {
        List<HomePersonResponseDto> response = homePersonService.getPersonsByHomeId(homeId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<HomePersonResponseDto> updatePersonAccess(@PathVariable String id, @RequestBody HomePersonRequestDto request) {
        HomePersonResponseDto response = homePersonService.updatePersonAccess(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removePersonFromHome(@PathVariable String id) {
        homePersonService.removePersonFromHome(id);
        return ResponseEntity.noContent().build();
    }
}
