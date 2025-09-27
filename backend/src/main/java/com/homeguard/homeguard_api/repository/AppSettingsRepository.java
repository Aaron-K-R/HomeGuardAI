package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.AppSettings;
import com.homeguard.homeguard_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppSettingsRepository extends JpaRepository<AppSettings, String> {
    
    Optional<AppSettings> findByUser(User user);
    
    Optional<AppSettings> findByUserId(String userId);
    
    @Query("SELECT a FROM AppSettings a WHERE a.theme = :theme")
    List<AppSettings> findByTheme(@Param("theme") String theme);
    
    @Query("SELECT a FROM AppSettings a WHERE a.language = :language")
    List<AppSettings> findByLanguage(@Param("language") String language);
    
    @Query("SELECT a FROM AppSettings a WHERE a.pushNotificationsEnabled = true")
    List<AppSettings> findByPushNotificationsEnabled();
    
    @Query("SELECT a FROM AppSettings a WHERE a.emailNotificationsEnabled = true")
    List<AppSettings> findByEmailNotificationsEnabled();
    
    @Query("SELECT a FROM AppSettings a WHERE a.smsNotificationsEnabled = true")
    List<AppSettings> findBySmsNotificationsEnabled();
    
    @Query("SELECT a FROM AppSettings a WHERE a.biometricLoginEnabled = true")
    List<AppSettings> findByBiometricLoginEnabled();
    
    @Query("SELECT a FROM AppSettings a WHERE a.dataUsageWifiOnly = true")
    List<AppSettings> findByDataUsageWifiOnly();
    
    @Query("SELECT a FROM AppSettings a WHERE a.locationTrackingEnabled = true")
    List<AppSettings> findByLocationTrackingEnabled();
    
    @Query("SELECT a FROM AppSettings a WHERE a.autoLockTimeout >= :minTimeout")
    List<AppSettings> findByAutoLockTimeoutGreaterThanEqual(@Param("minTimeout") Integer minTimeout);
}
