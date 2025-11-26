package com.homeguard.homeguard_api.controller;

import com.homeguard.homeguard_api.model.Device;
import com.homeguard.homeguard_api.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("${base.path}/devices")
@RequiredArgsConstructor
public class DeviceController {
    
    private final DeviceService deviceService;
    
    @PostMapping
    public ResponseEntity<Device> createDevice(@RequestBody Device device) {
        Device response = deviceService.createDevice(device);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable String id) {
        Optional<Device> device = deviceService.getDeviceById(id);
        return device.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/device-id/{deviceId}")
    public ResponseEntity<Device> getDeviceByDeviceId(@PathVariable String deviceId) {
        Optional<Device> device = deviceService.getDeviceByDeviceId(deviceId);
        return device.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/homes/{homeId}")
    public ResponseEntity<List<Device>> getDevicesByHomeId(@PathVariable String homeId) {
        List<Device> devices = deviceService.getDevicesByHomeId(homeId);
        return ResponseEntity.ok(devices);
    }
    
    @GetMapping("/owners/{ownerId}")
    public ResponseEntity<List<Device>> getDevicesByOwnerId(@PathVariable String ownerId) {
        List<Device> devices = deviceService.getDevicesByOwnerId(ownerId);
        return ResponseEntity.ok(devices);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Device> updateDevice(@PathVariable String id, @RequestBody Device device) {
        device.setId(id);
        Device response = deviceService.updateDevice(device);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable String id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{deviceId}/pairing-code")
    public ResponseEntity<Device> generatePairingCode(@PathVariable String deviceId) {
        Device response = deviceService.generatePairingCode(deviceId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{deviceId}/pairing")
    public ResponseEntity<Device> completePairing(
            @PathVariable String deviceId,
            @RequestParam String homeId,
            @RequestParam String ownerId) {
        Device response = deviceService.completePairing(deviceId, homeId, ownerId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{deviceId}/heartbeat")
    public ResponseEntity<Device> updateHeartbeat(@PathVariable String deviceId) {
        Device response = deviceService.updateHeartbeat(deviceId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/offline")
    public ResponseEntity<List<Device>> getOfflineDevices(@RequestParam(defaultValue = "24") int hours) {
        List<Device> devices = deviceService.getOfflineDevices(hours);
        return ResponseEntity.ok(devices);
    }
    
    @GetMapping("/homes/{homeId}/capability/{capability}")
    public ResponseEntity<List<Device>> getDevicesByCapability(
            @PathVariable String homeId,
            @PathVariable String capability) {
        List<Device> devices = deviceService.getDevicesByCapability(homeId, capability);
        return ResponseEntity.ok(devices);
    }
    
    @PostMapping("/{deviceId}/control")
    public ResponseEntity<com.homeguard.homeguard_api.dto.DeviceControlResponseDto> controlDevice(
            @PathVariable String deviceId,
            @RequestBody com.homeguard.homeguard_api.dto.DeviceControlRequestDto request) {
        com.homeguard.homeguard_api.dto.DeviceControlResponseDto response = deviceService.controlDevice(deviceId, request);
        return ResponseEntity.ok(response);
    }
}
