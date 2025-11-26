"""
QR Code Service for HomeGuard AI
Handles QR code scanning and validation for door access
"""

import cv2
import pyzbar.pyzbar as pyzbar
import json
import logging
import requests
from typing import Optional, Dict
from config import Config

logger = logging.getLogger(__name__)

class QRCodeService:
    """Service for scanning and validating QR codes"""
    
    def __init__(self, backend_url: str = None):
        """
        Initialize QR code service
        
        Args:
            backend_url: Base URL for the Spring Boot backend API
        """
        self.backend_url = backend_url or "http://localhost:8080/api/v1"
        self.camera = None
    
    def initialize_camera(self, camera_index: int = 0):
        """
        Initialize camera for QR code scanning
        
        Args:
            camera_index: Camera device index (default 0)
        """
        try:
            self.camera = cv2.VideoCapture(camera_index)
            if not self.camera.isOpened():
                logger.error(f"Failed to open camera {camera_index}")
                return False
            logger.info(f"Camera {camera_index} initialized successfully")
            return True
        except Exception as e:
            logger.error(f"Error initializing camera: {str(e)}")
            return False
    
    def scan_qr_code(self, timeout: int = 5) -> Optional[str]:
        """
        Scan QR code from camera feed
        
        Args:
            timeout: Maximum time to wait for QR code (seconds)
            
        Returns:
            QR code data string if found, None otherwise
        """
        if not self.camera or not self.camera.isOpened():
            logger.error("Camera not initialized")
            return None
        
        import time
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            ret, frame = self.camera.read()
            if not ret:
                continue
            
            # Decode QR codes
            decoded_objects = pyzbar.decode(frame)
            
            for obj in decoded_objects:
                if obj.type == 'QRCODE':
                    qr_data = obj.data.decode('utf-8')
                    logger.info(f"QR code detected: {qr_data[:50]}...")
                    return qr_data
            
            # Optional: Display frame for debugging
            # cv2.imshow('QR Code Scanner', frame)
            # if cv2.waitKey(1) & 0xFF == ord('q'):
            #     break
        
        logger.warning("No QR code detected within timeout period")
        return None
    
    def scan_qr_from_image(self, image_path: str) -> Optional[str]:
        """
        Scan QR code from an image file
        
        Args:
            image_path: Path to image file
            
        Returns:
            QR code data string if found, None otherwise
        """
        try:
            image = cv2.imread(image_path)
            if image is None:
                logger.error(f"Failed to load image: {image_path}")
                return None
            
            decoded_objects = pyzbar.decode(image)
            
            for obj in decoded_objects:
                if obj.type == 'QRCODE':
                    qr_data = obj.data.decode('utf-8')
                    logger.info(f"QR code detected in image: {qr_data[:50]}...")
                    return qr_data
            
            logger.warning(f"No QR code found in image: {image_path}")
            return None
        except Exception as e:
            logger.error(f"Error scanning QR code from image: {str(e)}")
            return None
    
    def validate_qr_code(self, qr_data: str, device_id: str, home_id: str) -> Dict:
        """
        Validate QR code with backend API
        
        Args:
            qr_data: QR code data string (JSON)
            device_id: Device ID of the Pi
            home_id: Home ID to validate against
            
        Returns:
            Validation response dictionary
        """
        try:
            url = f"{self.backend_url}/qr-codes/validate"
            payload = {
                "qrData": qr_data,
                "deviceId": device_id,
                "homeId": home_id
            }
            
            response = requests.post(url, json=payload, timeout=5)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"QR code validation result: {result.get('result')}")
            return result
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error validating QR code with backend: {str(e)}")
            return {
                "valid": False,
                "result": "ERROR",
                "message": f"Backend validation error: {str(e)}"
            }
        except Exception as e:
            logger.error(f"Unexpected error validating QR code: {str(e)}")
            return {
                "valid": False,
                "result": "ERROR",
                "message": f"Validation error: {str(e)}"
            }
    
    def unlock_door(self, device_id: str, reason: str = "QR code access") -> bool:
        """
        Send unlock command to backend
        
        Args:
            device_id: Device ID of the lock
            reason: Reason for unlocking
            
        Returns:
            True if unlock command was successful
        """
        try:
            url = f"{self.backend_url}/devices/{device_id}/control"
            payload = {
                "deviceId": device_id,
                "lock": False,  # False = unlock
                "reason": reason
            }
            
            response = requests.post(url, json=payload, timeout=5)
            response.raise_for_status()
            
            result = response.json()
            logger.info(f"Door unlock result: {result.get('message')}")
            return result.get("success", False)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error unlocking door: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error unlocking door: {str(e)}")
            return False
    
    def process_qr_scan(self, device_id: str, home_id: str, timeout: int = 5) -> Dict:
        """
        Complete QR code scanning and validation flow
        
        Args:
            device_id: Device ID of the Pi
            home_id: Home ID to validate against
            timeout: Maximum time to wait for QR code (seconds)
            
        Returns:
            Result dictionary with validation and unlock status
        """
        # Scan QR code
        qr_data = self.scan_qr_code(timeout=timeout)
        
        if not qr_data:
            return {
                "success": False,
                "message": "No QR code detected",
                "unlocked": False
            }
        
        # Validate QR code
        validation_result = self.validate_qr_code(qr_data, device_id, home_id)
        
        if not validation_result.get("valid"):
            return {
                "success": False,
                "message": validation_result.get("message", "QR code validation failed"),
                "unlocked": False,
                "validation_result": validation_result
            }
        
        # Unlock door if validation successful
        unlock_success = self.unlock_door(device_id, "QR code validated")
        
        return {
            "success": True,
            "message": "Access granted",
            "unlocked": unlock_success,
            "validation_result": validation_result
        }
    
    def cleanup(self):
        """Release camera resources"""
        if self.camera:
            self.camera.release()
            cv2.destroyAllWindows()
            logger.info("Camera resources released")

