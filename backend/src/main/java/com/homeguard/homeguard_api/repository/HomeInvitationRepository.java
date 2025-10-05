package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.HomeInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HomeInvitationRepository extends JpaRepository<HomeInvitation, String> {
    
    Optional<HomeInvitation> findByInvitationToken(String token);
    
    List<HomeInvitation> findByEmailAndIsActiveTrue(String email);
    
    List<HomeInvitation> findByHomeIdAndIsActiveTrue(String homeId);
    
    @Query("SELECT hi FROM HomeInvitation hi WHERE hi.email = :email AND hi.isActive = true AND hi.expiresAt > :now")
    List<HomeInvitation> findActiveInvitationsByEmail(@Param("email") String email, @Param("now") LocalDateTime now);
    
    @Query("SELECT hi FROM HomeInvitation hi WHERE hi.home.id = :homeId AND hi.isActive = true")
    List<HomeInvitation> findActiveInvitationsByHomeId(@Param("homeId") String homeId);
    
    @Query("SELECT hi FROM HomeInvitation hi WHERE hi.invitationToken = :token AND hi.isActive = true AND hi.expiresAt > :now")
    Optional<HomeInvitation> findValidInvitationByToken(@Param("token") String token, @Param("now") LocalDateTime now);
}
