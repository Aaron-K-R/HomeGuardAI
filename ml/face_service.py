"""
Face Recognition Service
Handles face embedding generation and recognition operations
"""

import face_recognition
import numpy as np
import cv2
from PIL import Image
import io
import base64
import json
import logging
from typing import List, Dict, Optional, Tuple

logger = logging.getLogger(__name__)

class FaceService:
    """Service class for face recognition operations"""
    
    def __init__(self, tolerance: float = 0.6):
        """
        Initialize the face service
        
        Args:
            tolerance: Face matching tolerance (lower = more strict)
        """
        self.tolerance = tolerance
    
    def load_image_from_url(self, image_url: str) -> np.ndarray:
        """Load image from URL and convert to numpy array"""
        try:
            import requests
            
            # Download image from URL
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            
            # Convert to PIL Image
            image = Image.open(io.BytesIO(response.content))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Convert to numpy array
            image_array = np.array(image)
            
            # PIL loads images as (width, height, channels) but face_recognition expects (height, width, channels)
            # Transpose the array to match OpenCV format
            if len(image_array.shape) == 3:
                image_array = np.transpose(image_array, (1, 0, 2))
                logger.info(f"Transposed URL image array shape: {image_array.shape}")
            
            return image_array
            
        except Exception as e:
            logger.error(f"Error loading image from URL {image_url}: {e}")
            raise

    def decode_base64_image(self, base64_string: str) -> np.ndarray:
        """Decode base64 string to numpy array image"""
        try:
            logger.info(f"Decoding base64 image (length: {len(base64_string)})")
            
            # Remove data URL prefix if present
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
                logger.info("Removed data URL prefix")
            
            # Decode base64
            logger.info("Decoding base64 data...")
            image_data = base64.b64decode(base64_string)
            logger.info(f"Decoded {len(image_data)} bytes")
            
            # Convert to PIL Image
            logger.info("Converting to PIL Image...")
            image = Image.open(io.BytesIO(image_data))
            logger.info(f"PIL Image size: {image.size}, mode: {image.mode}")
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                logger.info(f"Converting from {image.mode} to RGB")
                image = image.convert('RGB')
            
            # Convert to numpy array
            logger.info("Converting to numpy array...")
            image_array = np.array(image)
            logger.info(f"Numpy array shape: {image_array.shape}, dtype: {image_array.dtype}")
            
            # PIL loads images as (width, height, channels) but face_recognition expects (height, width, channels)
            # Transpose the array to match OpenCV format
            if len(image_array.shape) == 3:
                image_array = np.transpose(image_array, (1, 0, 2))
                logger.info(f"Transposed array shape: {image_array.shape}")
            
            return image_array
        except Exception as e:
            logger.error(f"Error decoding base64 image: {str(e)}")
            raise ValueError(f"Invalid image format: {str(e)}")
    
    def extract_face_embeddings(self, image_array: np.ndarray) -> List[List[float]]:
        """Extract face embeddings from an image"""
        try:
            logger.info(f"Starting face detection on image with shape {image_array.shape}")
            
            # Find face locations using HOG model (faster than CNN)
            logger.info("Searching for face locations using HOG model...")
            face_locations = face_recognition.face_locations(image_array, model="hog")
            logger.info(f"Found {len(face_locations)} face locations: {face_locations}")
            
            if not face_locations:
                logger.warning("No faces detected in image")
                return []
            
            # Extract face encodings
            logger.info("Extracting face encodings...")
            
            # Ensure image array is contiguous and has correct dtype
            if not image_array.flags.c_contiguous:
                image_array = np.ascontiguousarray(image_array)
                logger.info("Made image array contiguous")
            
            if image_array.dtype != np.uint8:
                image_array = image_array.astype(np.uint8)
                logger.info(f"Converted image array to uint8")
            
            face_encodings = face_recognition.face_encodings(image_array, face_locations)
            logger.info(f"Generated {len(face_encodings)} face encodings")
            
            # Convert numpy arrays to lists
            embeddings = [encoding.tolist() for encoding in face_encodings]
            logger.info(f"Converted to {len(embeddings)} embeddings, each with {len(embeddings[0]) if embeddings else 0} dimensions")
            
            return embeddings
        except Exception as e:
            logger.error(f"Error extracting face embeddings: {str(e)}")
            raise RuntimeError(f"Error processing image: {str(e)}")
    
    def process_images_for_person(self, person_id: str, images: List[str]) -> Dict:
        """
        Process multiple images for a person and return face embeddings
        
        Args:
            person_id: ID of the person
            images: List of image URLs (Supabase URLs)
            
        Returns:
            Dictionary with embeddings and metadata
        """
        try:
            logger.info(f"Processing face embeddings for person {person_id}")
            logger.info(f"Image URLs received: {images}")

            all_embeddings = []
            total_faces = 0
            processed_images = 0

            for i, image_input in enumerate(images):
                try:
                    # Check if input is base64 or URL
                    if image_input.startswith('data:image/') or (len(image_input) > 1000 and not image_input.startswith('http')):
                        # Base64 image
                        logger.info(f"Loading image {i+1} from base64 data...")
                        image_array = self.decode_base64_image(image_input)
                    else:
                        # URL image
                        logger.info(f"Loading image {i+1} from URL: {image_input[:100]}...")
                        image_array = self.load_image_from_url(image_input)
                    
                    logger.info(f"Image loaded successfully. Shape: {image_array.shape}, dtype: {image_array.dtype}")
                    
                    # Extract face embeddings
                    logger.info(f"Extracting face embeddings from image {i+1}...")
                    embeddings = self.extract_face_embeddings(image_array)
                    logger.info(f"Face embeddings extraction completed. Found {len(embeddings) if embeddings else 0} faces")
                    
                    if embeddings:
                        all_embeddings.extend(embeddings)
                        total_faces += len(embeddings)
                        processed_images += 1
                        logger.info(f"Found {len(embeddings)} face(s) in image {i+1}")
                    else:
                        logger.warning(f"No faces detected in image {i+1}")
                        
                except Exception as e:
                    logger.error(f"Error processing image {i+1}: {str(e)}")
                    continue
            
            return {
                "person_id": person_id,
                "face_embeddings": all_embeddings,
                "face_count": total_faces,
                "processed_images": processed_images,
                "total_images": len(images),
                "success": total_faces > 0,
                "message": f"Processed {total_faces} faces from {processed_images}/{len(images)} images"
            }
            
        except Exception as e:
            logger.error(f"Error in process_images_for_person: {str(e)}")
            raise RuntimeError(f"Error processing images: {str(e)}")
    
    def recognize_face(self, image: str, known_embeddings: List[Dict]) -> Dict:
        """
        Recognize a face by comparing it against known embeddings
        
        Args:
            image: Base64 encoded image
            known_embeddings: List of {person_id: str, embeddings: List[List[float]]}
            
        Returns:
            Dictionary with recognition results
        """
        try:
            logger.info("Processing face recognition request")
            
            # Decode the input image
            image_array = self.decode_base64_image(image)
            
            # Extract face embeddings from the input image
            input_embeddings = self.extract_face_embeddings(image_array)
            
            if not input_embeddings:
                return {
                    "person_id": None,
                    "confidence": 0.0,
                    "face_detected": False,
                    "success": False,
                    "message": "No face detected in the input image"
                }
            
            # Use the first detected face
            input_embedding = input_embeddings[0]
            
            best_match_id = None
            best_confidence = 0.0
            
            # Compare against known embeddings
            for person_data in known_embeddings:
                person_id = person_data.get("person_id")
                embeddings = person_data.get("embeddings", [])
                
                if not embeddings:
                    continue
                    
                # Compare with all embeddings for this person
                for known_embedding in embeddings:
                    try:
                        # Calculate face distance (lower = more similar)
                        face_distance = face_recognition.face_distance([known_embedding], input_embedding)[0]
                        
                        # Convert distance to confidence (0-1 scale)
                        confidence = max(0, 1 - face_distance)
                        
                        if confidence > best_confidence and face_distance <= self.tolerance:
                            best_confidence = confidence
                            best_match_id = person_id
                            
                    except Exception as e:
                        logger.error(f"Error comparing embeddings for person {person_id}: {str(e)}")
                        continue
            
            if best_match_id:
                logger.info(f"Face recognized as person {best_match_id} with confidence {best_confidence:.3f}")
                return {
                    "person_id": best_match_id,
                    "confidence": best_confidence,
                    "face_detected": True,
                    "success": True,
                    "message": f"Face recognized with {best_confidence:.1%} confidence"
                }
            else:
                logger.info("Face not recognized - no match found")
                return {
                    "person_id": None,
                    "confidence": 0.0,
                    "face_detected": True,
                    "success": True,
                    "message": "Face detected but no match found"
                }
                
        except Exception as e:
            logger.error(f"Error in recognize_face: {str(e)}")
            raise RuntimeError(f"Error recognizing face: {str(e)}")
    
    def validate_image(self, base64_string: str) -> bool:
        """
        Validate if a base64 string represents a valid image
        
        Args:
            base64_string: Base64 encoded image string
            
        Returns:
            True if valid image, False otherwise
        """
        try:
            self.decode_base64_image(base64_string)
            return True
        except:
            return False
    
    def get_face_count(self, image: str) -> int:
        """
        Get the number of faces in an image
        
        Args:
            image: Base64 encoded image string
            
        Returns:
            Number of faces detected
        """
        try:
            image_array = self.decode_base64_image(image)
            face_locations = face_recognition.face_locations(image_array)
            return len(face_locations)
        except:
            return 0

# Global instance
face_service = FaceService()
