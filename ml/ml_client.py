"""
ML Service Client
Client for communicating with the HomeGuard AI ML service
"""

import requests
import json
import logging
from typing import List, Dict, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class FaceEmbeddingResult:
    person_id: str
    face_embeddings: List[List[float]]
    face_count: int
    success: bool
    message: str

@dataclass
class FaceRecognitionResult:
    person_id: Optional[str]
    confidence: float
    face_detected: bool
    success: bool
    message: str

class MLServiceClient:
    """Client for communicating with the ML service"""
    
    def __init__(self, base_url: str = "http://localhost:8001"):
        """
        Initialize the ML service client
        
        Args:
            base_url: Base URL of the ML service
        """
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    
    def health_check(self) -> bool:
        """
        Check if the ML service is healthy
        
        Returns:
            True if healthy, False otherwise
        """
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=5)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return False
    
    def embed_faces(self, person_id: str, images: List[str]) -> FaceEmbeddingResult:
        """
        Generate face embeddings for a person from multiple images
        
        Args:
            person_id: ID of the person
            images: List of base64 encoded images
            
        Returns:
            FaceEmbeddingResult with embeddings and metadata
        """
        try:
            payload = {
                "person_id": person_id,
                "images": images
            }
            
            response = self.session.post(
                f"{self.base_url}/embed-faces",
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                raise Exception(f"ML service error: {response.status_code} - {response.text}")
            
            data = response.json()
            
            return FaceEmbeddingResult(
                person_id=data["person_id"],
                face_embeddings=data["face_embeddings"],
                face_count=data["face_count"],
                success=data["success"],
                message=data["message"]
            )
            
        except Exception as e:
            logger.error(f"Error embedding faces for person {person_id}: {str(e)}")
            return FaceEmbeddingResult(
                person_id=person_id,
                face_embeddings=[],
                face_count=0,
                success=False,
                message=f"Error: {str(e)}"
            )
    
    def recognize_face(self, image: str, known_embeddings: List[Dict]) -> FaceRecognitionResult:
        """
        Recognize a face by comparing it against known embeddings
        
        Args:
            image: Base64 encoded image
            known_embeddings: List of {person_id: str, embeddings: List[List[float]]}
            
        Returns:
            FaceRecognitionResult with recognition results
        """
        try:
            payload = {
                "image": image,
                "known_embeddings": known_embeddings
            }
            
            response = self.session.post(
                f"{self.base_url}/recognize-face",
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                raise Exception(f"ML service error: {response.status_code} - {response.text}")
            
            data = response.json()
            
            return FaceRecognitionResult(
                person_id=data["person_id"],
                confidence=data["confidence"],
                face_detected=data["face_detected"],
                success=data["success"],
                message=data["message"]
            )
            
        except Exception as e:
            logger.error(f"Error recognizing face: {str(e)}")
            return FaceRecognitionResult(
                person_id=None,
                confidence=0.0,
                face_detected=False,
                success=False,
                message=f"Error: {str(e)}"
            )
    
    def validate_image(self, image: str) -> bool:
        """
        Validate if a base64 string represents a valid image
        
        Args:
            image: Base64 encoded image string
            
        Returns:
            True if valid image, False otherwise
        """
        try:
            # Simple validation by trying to decode
            import base64
            base64.b64decode(image.split(',')[-1] if ',' in image else image)
            return True
        except:
            return False

# Global instance
ml_client = MLServiceClient()
