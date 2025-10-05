"""
Configuration for HomeGuard AI ML Service
"""

import os
from typing import List

class Config:
    """Configuration class for ML service"""
    
    # Server Configuration
    HOST = os.getenv("ML_HOST", "192.168.254.46")
    PORT = int(os.getenv("ML_PORT", "8001"))
    WORKERS = int(os.getenv("ML_WORKERS", "1"))
    
    # Face Recognition Configuration
    FACE_TOLERANCE = float(os.getenv("FACE_TOLERANCE", "0.6"))
    FACE_DETECTION_MODEL = os.getenv("FACE_DETECTION_MODEL", "hog")
    
    # Logging Configuration
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    # CORS Configuration
    ALLOWED_ORIGINS = os.getenv(
        "ALLOWED_ORIGINS", 
        "http://localhost:3000,http://localhost:8080,http://192.168.254.46:8080"
    ).split(",")
    
    # API Configuration
    API_TITLE = "HomeGuard AI - Facial Recognition Service"
    API_VERSION = "1.0.0"
    API_DESCRIPTION = """
    HomeGuard AI Facial Recognition Service
    
    This service provides facial recognition capabilities for the HomeGuard system:
    - Generate face embeddings from images
    - Recognize faces by comparing against known embeddings
    - Support for multiple faces per person
    - Configurable tolerance levels
    """
    
    @classmethod
    def get_cors_origins(cls) -> List[str]:
        """Get CORS allowed origins"""
        return cls.ALLOWED_ORIGINS
