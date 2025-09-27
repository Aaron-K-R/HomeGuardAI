package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.SecuritySettings;
import com.homeguard.homeguard_api.model.Home;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SecuritySettingsRepository extends JpaRepository<SecuritySettings, String> {
    
    Optional<SecuritySettings> findByHome(Home home);
    
    Optional<SecuritySettings> findByHomeId(String homeId);
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.motionDetectionEnabled = true")
    List<SecuritySettings> findByMotionDetectionEnabled();
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.doorSensorEnabled = true")
    List<SecuritySettings> findByDoorSensorEnabled();
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.windowSensorEnabled = true")
    List<SecuritySettings> findByWindowSensorEnabled();
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.cameraRecordingEnabled = true")
    List<SecuritySettings> findByCameraRecordingEnabled();
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.nightVisionEnabled = true")
    List<SecuritySettings> findByNightVisionEnabled();
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.emergencyContactsNotified = true")
    List<SecuritySettings> findByEmergencyContactsNotified();
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.policeNotificationEnabled = true")
    List<SecuritySettings> findByPoliceNotificationEnabled();
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.alarmSensitivityLevel >= :minLevel")
    List<SecuritySettings> findByAlarmSensitivityLevelGreaterThanEqual(@Param("minLevel") Integer minLevel);
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.autoArmTime IS NOT NULL")
    List<SecuritySettings> findByAutoArmTimeSet();
    
    @Query("SELECT s FROM SecuritySettings s WHERE s.autoDisarmTime IS NOT NULL")
    List<SecuritySettings> findByAutoDisarmTimeSet();
}
