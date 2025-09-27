package com.homeguard.homeguard_api.repository;

import com.homeguard.homeguard_api.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, String> {
    
    List<Person> findByIsActiveTrue();
    
    List<Person> findByNameContainingIgnoreCase(String name);
    
    Optional<Person> findByEmail(String email);
    
    @Query("SELECT p FROM Person p WHERE p.personType = :personType AND p.isActive = true")
    List<Person> findByPersonTypeAndActive(@Param("personType") String personType);
}
