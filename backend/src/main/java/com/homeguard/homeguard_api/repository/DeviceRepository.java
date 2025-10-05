package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.Device;
import com.homeguard.homeguard_api.enums.DeviceStatus;
import com.homeguard.homeguard_api.enums.DeviceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String> {
    
    List<Device> findByHomeIdAndIsActiveTrue(String homeId);
    
    List<Device> findByOwnerIdAndIsActiveTrue(String ownerId);
    
    List<Device> findByDeviceTypeAndIsActiveTrue(DeviceType deviceType);
    
    List<Device> findByStatusAndIsActiveTrue(DeviceStatus status);
    
    List<Device> findByIsOnlineTrue();
    
    List<Device> findByIsOnlineFalse();
    
    Optional<Device> findByDeviceId(String deviceId);
    
    Optional<Device> findByPairingCode(String pairingCode);
    
    @Query("SELECT d FROM Device d WHERE d.home.id = :homeId AND d.isActive = true")
    List<Device> findActiveDevicesByHomeId(@Param("homeId") String homeId);
    
    @Query("SELECT d FROM Device d WHERE d.owner.id = :ownerId AND d.isActive = true")
    List<Device> findActiveDevicesByOwnerId(@Param("ownerId") String ownerId);
    
    @Query("SELECT d FROM Device d WHERE d.pairingCode = :pairingCode AND d.pairingExpiresAt > :now")
    Optional<Device> findValidPairingDevice(@Param("pairingCode") String pairingCode, @Param("now") LocalDateTime now);
    
    @Query("SELECT d FROM Device d WHERE d.lastHeartbeat < :threshold")
    List<Device> findOfflineDevices(@Param("threshold") LocalDateTime threshold);
    
    @Query("SELECT d FROM Device d WHERE d.home.id = :homeId AND d.deviceCapabilities LIKE %:capability%")
    List<Device> findDevicesByHomeIdAndCapability(@Param("homeId") String homeId, @Param("capability") String capability);
}
