package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.HomePerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomePersonRepository extends JpaRepository<HomePerson, String> {
    
    List<HomePerson> findByHomeIdAndIsActiveTrue(String homeId);
    
    List<HomePerson> findByPersonIdAndIsActiveTrue(String personId);
    
    Optional<HomePerson> findByHomeIdAndPersonId(String homeId, String personId);
    
    @Query("SELECT hp FROM HomePerson hp WHERE hp.home.id = :homeId AND hp.isActive = true")
    List<HomePerson> findActivePersonsByHomeId(@Param("homeId") String homeId);
    
    @Query("SELECT hp FROM HomePerson hp WHERE hp.person.id = :personId AND hp.isActive = true")
    List<HomePerson> findActiveHomesByPersonId(@Param("personId") String personId);
}
