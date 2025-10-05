from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import logging
from config import Config
from face_service import face_service

# Configure logging
logging.basicConfig(level=getattr(logging, Config.LOG_LEVEL))
logger = logging.getLogger(__name__)

app = FastAPI(
    title="HomeGuard AI - Face Embedding Service",
    version="1.0.0",
    description="Service for generating face embeddings from images"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class FaceEmbeddingRequest(BaseModel):
    person_id: str
    images: List[str]  # Image URLs (Supabase URLs)

class FaceEmbeddingResponse(BaseModel):
    person_id: str
    face_embeddings: List[List[float]]
    face_count: int
    success: bool
    message: str

class HealthResponse(BaseModel):
    status: str
    message: str

# Remove the duplicate functions since they're now in face_service

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="HomeGuard AI Facial Recognition Service is running"
    )

@app.post("/embed-faces", response_model=FaceEmbeddingResponse)
async def embed_faces(request: FaceEmbeddingRequest):
    """
    Generate face embeddings from an array of images for a person
    """
    try:
        result = face_service.process_images_for_person(request.person_id, request.images)
        
        return FaceEmbeddingResponse(
            person_id=result["person_id"],
            face_embeddings=result["face_embeddings"],
            face_count=result["face_count"],
            success=result["success"],
            message=result["message"]
        )
        
    except Exception as e:
        logger.error(f"Error in embed_faces: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "service": "HomeGuard AI - Face Embedding Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "embed_faces": "/embed-faces"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=Config.HOST, port=Config.PORT)
