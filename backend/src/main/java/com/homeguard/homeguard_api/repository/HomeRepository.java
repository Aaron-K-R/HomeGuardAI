package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.Home;
import com.homeguard.homeguard_api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomeRepository extends JpaRepository<Home, String> {
    
    List<Home> findByOwner(User owner);
    
    List<Home> findByIsActiveTrue();
    
    List<Home> findByIsActiveFalse();
    
    @Query("SELECT h FROM Home h WHERE h.owner = :owner AND h.isPrimary = true")
    Optional<Home> findPrimaryHomeByOwner(@Param("owner") User owner);
    
    @Query("SELECT h FROM Home h WHERE h.owner = :owner AND h.isActive = true")
    List<Home> findActiveHomesByOwner(@Param("owner") User owner);
    
    @Query("SELECT h FROM Home h WHERE h.name LIKE %:name%")
    List<Home> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT h FROM Home h WHERE h.city = :city")
    List<Home> findByCity(@Param("city") String city);
    
    @Query("SELECT h FROM Home h WHERE h.state = :state")
    List<Home> findByState(@Param("state") String state);
    
    @Query("SELECT h FROM Home h WHERE h.zipCode = :zipCode")
    List<Home> findByZipCode(@Param("zipCode") String zipCode);
    
    @Query("SELECT h FROM Home h WHERE h.homeType = :homeType")
    List<Home> findByHomeType(@Param("homeType") String homeType);
    
    @Query("SELECT h FROM Home h WHERE h.securitySystemType = :securitySystemType")
    List<Home> findBySecuritySystemType(@Param("securitySystemType") String securitySystemType);
    
    @Query("SELECT COUNT(h) FROM Home h WHERE h.owner = :owner")
    long countByOwner(@Param("owner") User owner);
    
    @Query("SELECT COUNT(h) FROM Home h WHERE h.isActive = true")
    long countActiveHomes();
    
    @Query("SELECT h FROM Home h WHERE h.latitude IS NOT NULL AND h.longitude IS NOT NULL")
    List<Home> findHomesWithCoordinates();
}
