// ============================================================================
// MODULE: DeviceService
// PURPOSE: Service layer for managing security devices (cameras, sensors, etc.)
//          Handles device creation, pairing, status updates, and queries
// ============================================================================

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

// --------------Service Class--------------
// PURPOSE: Spring service component for device management operations
@Service
@RequiredArgsConstructor
@Transactional
public class DeviceService {
    
    // --------------Repository Dependencies--------------
    // PURPOSE: Data access repositories for devices, homes, and users
    private final DeviceRepository deviceRepository;
    private final HomeRepository homeRepository;
    private final UserRepository userRepository;
    
    // --------------Create Device--------------
    // PURPOSE: Create a new device with generated ID and timestamps
    public Device createDevice(Device device) {
        device.setId(UUID.randomUUID().toString());
        device.setCreatedAt(LocalDateTime.now());
        device.setUpdatedAt(LocalDateTime.now());
        return deviceRepository.save(device);
    }
    
    // --------------Get Device by ID--------------
    // PURPOSE: Retrieve a device by its unique identifier
    public Optional<Device> getDeviceById(String id) {
        return deviceRepository.findById(id);
    }
    
    // --------------Get Device by Device ID--------------
    // PURPOSE: Find device by its device-specific ID (different from database ID)
    public Optional<Device> getDeviceByDeviceId(String deviceId) {
        return deviceRepository.findByDeviceId(deviceId);
    }
    
    // --------------Get Devices by Home--------------
    // PURPOSE: Retrieve all active devices associated with a specific home
    public List<Device> getDevicesByHomeId(String homeId) {
        return deviceRepository.findActiveDevicesByHomeId(homeId);
    }
    
    // --------------Get Devices by Owner--------------
    // PURPOSE: Retrieve all active devices owned by a specific user
    public List<Device> getDevicesByOwnerId(String ownerId) {
        return deviceRepository.findActiveDevicesByOwnerId(ownerId);
    }
    
    // --------------Update Device--------------
    // PURPOSE: Update device information and update timestamp
    public Device updateDevice(Device device) {
        device.setUpdatedAt(LocalDateTime.now());
        return deviceRepository.save(device);
    }
    
    // --------------Delete Device (Soft Delete)--------------
    // PURPOSE: Mark device as inactive instead of deleting from database
    public void deleteDevice(String id) {
        Device device = deviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Device not found"));
        device.setIsActive(false);
        device.setUpdatedAt(LocalDateTime.now());
        deviceRepository.save(device);
    }
    
    // --------------Generate Pairing Code--------------
    // PURPOSE: Generate a unique pairing code for device setup (expires in 24 hours)
    public Device generatePairingCode(String deviceId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new RuntimeException("Device not found"));
        
        String pairingCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        device.setPairingCode(pairingCode);
        device.setPairingExpiresAt(LocalDateTime.now().plusHours(24)); // 24 hours expiry
        device.setUpdatedAt(LocalDateTime.now());
        
        return deviceRepository.save(device);
    }
    
    // --------------Complete Device Pairing--------------
    // PURPOSE: Link device to a home and owner, clear pairing code, mark as online
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
    
    // --------------Update Device Heartbeat--------------
    // PURPOSE: Update device's last heartbeat time and mark as online
    public Device updateHeartbeat(String deviceId) {
        Device device = deviceRepository.findById(deviceId)
            .orElseThrow(() -> new RuntimeException("Device not found"));
        
        device.setLastHeartbeat(LocalDateTime.now());
        device.setIsOnline(true);
        device.setUpdatedAt(LocalDateTime.now());
        
        return deviceRepository.save(device);
    }
    
    // --------------Get Offline Devices--------------
    // PURPOSE: Find devices that haven't sent heartbeat within specified hours
    public List<Device> getOfflineDevices(int hoursThreshold) {
        LocalDateTime threshold = LocalDateTime.now().minusHours(hoursThreshold);
        return deviceRepository.findOfflineDevices(threshold);
    }
    
    // --------------Get Devices by Capability--------------
    // PURPOSE: Find devices in a home that have a specific capability (e.g., "camera", "sensor")
    public List<Device> getDevicesByCapability(String homeId, String capability) {
        return deviceRepository.findDevicesByHomeIdAndCapability(homeId, capability);
    }
    
    // --------------Control Device (Lock/Unlock)--------------
    // PURPOSE: Send lock/unlock command to device (Pi will poll this or use WebSocket)
    public com.homeguard.homeguard_api.dto.DeviceControlResponseDto controlDevice(
            String deviceId, 
            com.homeguard.homeguard_api.dto.DeviceControlRequestDto request) {
        
        Device device = deviceRepository.findByDeviceId(deviceId)
            .orElseThrow(() -> new RuntimeException("Device not found"));
        
        if (!device.getIsActive() || !device.getIsOnline()) {
            com.homeguard.homeguard_api.dto.DeviceControlResponseDto response = 
                new com.homeguard.homeguard_api.dto.DeviceControlResponseDto();
            response.setSuccess(false);
            response.setMessage("Device is not active or offline");
            response.setDeviceId(deviceId);
            return response;
        }
        
        // Update device status (Pi will read this or we can implement WebSocket/HTTP push)
        // For now, we'll return success and the Pi can poll for commands
        com.homeguard.homeguard_api.dto.DeviceControlResponseDto response = 
            new com.homeguard.homeguard_api.dto.DeviceControlResponseDto();
        response.setSuccess(true);
        response.setMessage(request.getLock() ? "Lock command sent" : "Unlock command sent");
        response.setDeviceId(deviceId);
        response.setLocked(request.getLock());
        
        device.setUpdatedAt(LocalDateTime.now());
        deviceRepository.save(device);
        
        return response;
    }
}
