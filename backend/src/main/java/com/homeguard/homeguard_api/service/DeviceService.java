package com.homeguard.homeguard_api.service;

import com.homeguard.homeguard_api.model.Device;
import com.homeguard.homeguard_api.repository.DeviceRepository;
import com.homeguard.homeguard_api.repository.HomeRepository;
import com.homeguard.homeguard_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DeviceService {
    
    private final DeviceRepository deviceRepository;
    private final HomeRepository homeRepository;
    private final UserRepository userRepository;
    
    public Device createDevice(Device device) {
        device.setId(UUID.randomUUID().toString());
        device.setCreatedAt(LocalDateTime.now());
        device.setUpdatedAt(LocalDateTime.now());
        return deviceRepository.save(device);
    }
    
    public Optional<Device> getDeviceById(String id) {
        return deviceRepository.findById(id);
    }
    
    public Optional<Device> getDeviceByDeviceId(String deviceId) {
        return deviceRepository.findByDeviceId(deviceId);
    }
    
    public List<Device> getDevicesByHomeId(String homeId) {
        return deviceRepository.findActiveDevicesByHomeId(homeId);
    }
    
    public List<Device> getDevicesByOwnerId(String ownerId) {
        return deviceRepository.findActiveDevicesByOwnerId(ownerId);
    }
    
    public Device updateDevice(Device device) {
        device.setUpdatedAt(LocalDateTime.now());
        return deviceRepository.save(device);
    }
    
    public void deleteDevice(String id) {
        Device device = deviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Device not found"));
        device.setIsActive(false);
        device.setUpdatedAt(LocalDateTime.now());
        deviceRepository.save(device);
    }
    
    public Device generatePairingCode(String deviceId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new RuntimeException("Device not found"));
        
        String pairingCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        device.setPairingCode(pairingCode);
        device.setPairingExpiresAt(LocalDateTime.now().plusHours(24)); // 24 hours expiry
        device.setUpdatedAt(LocalDateTime.now());
        
        return deviceRepository.save(device);
    }
    
    public Device completePairing(String deviceId, String homeId, String ownerId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new RuntimeException("Device not found"));
        
        device.setHome(homeRepository.findById(homeId)
            .orElseThrow(() -> new RuntimeException("Home not found")));
        device.setOwner(userRepository.findById(ownerId)
            .orElseThrow(() -> new RuntimeException("User not found")));
        device.setPairingCode(null);
        device.setPairingExpiresAt(null);
        device.setIsOnline(true);
        device.setLastHeartbeat(LocalDateTime.now());
        device.setUpdatedAt(LocalDateTime.now());
        
        return deviceRepository.save(device);
    }
    
    public Device updateHeartbeat(String deviceId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new RuntimeException("Device not found"));
        
        device.setLastHeartbeat(LocalDateTime.now());
        device.setIsOnline(true);
        device.setUpdatedAt(LocalDateTime.now());
        
        return deviceRepository.save(device);
    }
    
    public List<Device> getOfflineDevices(int hoursThreshold) {
        LocalDateTime threshold = LocalDateTime.now().minusHours(hoursThreshold);
        return deviceRepository.findOfflineDevices(threshold);
    }
    
    public List<Device> getDevicesByCapability(String homeId, String capability) {
        return deviceRepository.findDevicesByHomeIdAndCapability(homeId, capability);
    }
}
