package com.homeguard.homeguard_api.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class MLServiceClient {
    
    @Value("${ml.service.url}")
    private String mlServiceUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public MLServiceClient() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Generate face embeddings for a person from their images
     * 
     * @param personId The person's ID
     * @param imageUrls List of image URLs (Supabase URLs)
     * @return List of face embeddings (List of List of Double)
     */
    public List<List<Double>> generateFaceEmbeddings(String personId, List<String> imageUrls) {
        try {
            log.info("Generating face embeddings for person {} with {} images", personId, imageUrls.size());
            
            // Prepare request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("person_id", personId);
            requestBody.put("images", imageUrls);
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // Call ML service
            String url = mlServiceUrl + "/embed-faces";
            ResponseEntity<Map> response = restTemplate.exchange(
                url, 
                HttpMethod.POST, 
                request, 
                Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                
                Boolean success = (Boolean) responseBody.get("success");
                if (success != null && success) {
                    List<List<Double>> embeddings = objectMapper.convertValue(
                        responseBody.get("face_embeddings"), 
                        new TypeReference<List<List<Double>>>() {}
                    );
                    
                    Integer faceCount = (Integer) responseBody.get("face_count");
                    log.info("Successfully generated {} face embeddings for person {}", faceCount, personId);
                    
                    return embeddings;
                } else {
                    String message = (String) responseBody.get("message");
                    log.warn("ML service returned failure for person {}: {}", personId, message);
                    return null;
                }
            } else {
                log.error("ML service returned error status: {}", response.getStatusCode());
                return null;
            }
            
        } catch (Exception e) {
            log.error("Error calling ML service for person {}: {}", personId, e.getMessage(), e);
            return null;
        }
    }
    
    /**
     * Check if ML service is healthy
     * 
     * @return true if healthy, false otherwise
     */
    public boolean isHealthy() {
        try {
            String url = mlServiceUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.warn("ML service health check failed: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Convert face embeddings to JSON string for storage
     * 
     * @param embeddings List of face embeddings
     * @return JSON string representation
     */
    public String embeddingsToJson(List<List<Double>> embeddings) {
        try {
            return objectMapper.writeValueAsString(embeddings);
        } catch (Exception e) {
            log.error("Error converting embeddings to JSON: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Parse face embeddings from JSON string
     * 
     * @param jsonString JSON string representation
     * @return List of face embeddings
     */
    public List<List<Double>> embeddingsFromJson(String jsonString) {
        try {
            return objectMapper.readValue(jsonString, new TypeReference<List<List<Double>>>() {});
        } catch (Exception e) {
            log.error("Error parsing embeddings from JSON: {}", e.getMessage());
            return null;
        }
    }
}
