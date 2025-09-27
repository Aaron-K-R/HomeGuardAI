package com.homeguard.homeguard_api.service;

import com.homeguard.homeguard_api.dto.PersonRequestDto;
import com.homeguard.homeguard_api.dto.PersonResponseDto;
import com.homeguard.homeguard_api.model.Person;
import com.homeguard.homeguard_api.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonService {
    
    private final PersonRepository personRepository;
    
    public PersonResponseDto createPerson(PersonRequestDto request) {
        Person person = new Person();
        person.setId(UUID.randomUUID().toString());
        person.setName(request.getName());
        person.setPhone(request.getPhone());
        person.setEmail(request.getEmail());
        person.setPersonType(request.getPersonType());
        person.setNotes(request.getNotes());
        person.setIsActive(true);
        person.setCreatedAt(LocalDateTime.now());
        person.setUpdatedAt(LocalDateTime.now());
        
        Person savedPerson = personRepository.save(person);
        return mapToResponseDto(savedPerson);
    }
    
    public PersonResponseDto getPersonById(String id) {
        Person person = personRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Person not found"));
        return mapToResponseDto(person);
    }
    
    public List<PersonResponseDto> getAllActivePersons() {
        return personRepository.findByIsActiveTrue()
            .stream()
            .map(this::mapToResponseDto)
            .collect(Collectors.toList());
    }
    
    public PersonResponseDto updatePerson(String id, PersonRequestDto request) {
        Person person = personRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Person not found"));
        
        person.setName(request.getName());
        person.setPhone(request.getPhone());
        person.setEmail(request.getEmail());
        person.setPersonType(request.getPersonType());
        person.setNotes(request.getNotes());
        person.setUpdatedAt(LocalDateTime.now());
        
        Person savedPerson = personRepository.save(person);
        return mapToResponseDto(savedPerson);
    }
    
    public void deletePerson(String id) {
        Person person = personRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Person not found"));
        
        person.setIsActive(false);
        person.setUpdatedAt(LocalDateTime.now());
        personRepository.save(person);
    }
    
    private PersonResponseDto mapToResponseDto(Person person) {
        PersonResponseDto dto = new PersonResponseDto();
        dto.setId(person.getId());
        dto.setName(person.getName());
        dto.setPhone(person.getPhone());
        dto.setEmail(person.getEmail());
        dto.setPersonType(person.getPersonType());
        dto.setProfileImagePath(person.getProfileImagePath());
        dto.setIsActive(person.getIsActive());
        dto.setLastSeen(person.getLastSeen());
        dto.setNotes(person.getNotes());
        dto.setCreatedAt(person.getCreatedAt());
        dto.setUpdatedAt(person.getUpdatedAt());
        return dto;
    }
}
