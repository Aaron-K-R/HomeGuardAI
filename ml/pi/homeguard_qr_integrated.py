from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import StreamingResponse
import uvicorn
import RPi.GPIO as GPIO
import cv2
import time
from picamera2 import Picamera2
import pyzbar.pyzbar as pyzbar
import json
import requests
from typing import Optional

# ========= CONFIG =========
LOCK_PIN = 17
UNLOCK_DURATION = 3
API_KEY = "YOUR_SECRET_KEY"
BACKEND_URL = "http://172.20.10.3:8080/api/v1"
# ==========================

# ------------ GPIO SETUP ------------
GPIO.setmode(GPIO.BCM)
GPIO.setup(LOCK_PIN, GPIO.OUT)
# LOCK LOGIC: 1 = LOCKED, 0 = UNLOCKED
GPIO.output(LOCK_PIN, 1)
print("GPIO initialized (1 = locked)")

# ------------ CAMERA SETUP ------------
picam2 = None

def get_camera():
    # Lazy initialize the camera
    global picam2
    if picam2 is None:
        print("Initializing Picamera2...")
        picam2 = Picamera2()
        picam2.configure(
            picam2.create_preview_configuration(
                main={"size": (1280, 720), "format": "RGB888"}
            )
        )
        picam2.start()
        time.sleep(0.5)
        print("Picamera2 started!")
    return picam2

# ------------ FASTAPI APP ------------
app = FastAPI()

# ------------ AUTH CHECK ------------
def verify_key(key: str):
    if key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")

# ======================================================
#                      LOCK CONTROL
# ======================================================

@app.get("/unlock")
def unlock(key: str = Depends(verify_key)):
    print("Unlocking...")
    GPIO.output(LOCK_PIN, 0)        # unlock
    time.sleep(UNLOCK_DURATION)
    GPIO.output(LOCK_PIN, 1)        # lock back
    return {"status": "unlocked", "duration": UNLOCK_DURATION}

@app.get("/lock")
def lock(key: str = Depends(verify_key)):
    print("Locking...")
    GPIO.output(LOCK_PIN, 1)
    return {"status": "locked"}

@app.get("/status")
def status(key: str = Depends(verify_key)):
    locked = GPIO.input(LOCK_PIN) == 1
    print("Status:", "locked" if locked else "unlocked")
    return {"locked": locked}

# ======================================================
#                    QR CODE SCANNING
# ======================================================

# ------------ QR CODE SCAN FROM FRAME ------------
def scan_qr_code_from_frame(frame, timeout: float = 2.0) -> Optional[str]:
    # Scan QR code from a camera frame
    # Returns QR code data string if found, None otherwise
    try:
        # Convert frame to grayscale for better QR detection
        gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY) if len(frame.shape) == 3 else frame
        
        # Decode QR codes
        decoded_objects = pyzbar.decode(gray)
        
        for obj in decoded_objects:
            if obj.type == 'QRCODE':
                qr_data = obj.data.decode('utf-8')
                print(f"QR code detected: {qr_data[:50]}...")
                return qr_data
        
        return None
    except Exception as e:
        print(f"Error scanning QR code: {e}")
        return None

# ------------ SCAN QR CODE ENDPOINT ------------
@app.post("/scan-qr")
def scan_qr_code(
    device_id: str,
    home_id: str,
    timeout: int = 5,
    key: str = Depends(verify_key)
):
    # Scan QR code from camera and validate with backend
    print(f"Starting QR code scan (timeout: {timeout}s)...")
    
    cam = get_camera()
    start_time = time.time()
    qr_data = None
    
    # Scan for QR code within timeout
    while time.time() - start_time < timeout:
        try:
            frame = cam.capture_array()
            qr_data = scan_qr_code_from_frame(frame)
            
            if qr_data:
                break
                
            time.sleep(0.1)  # Small delay between scans
            
        except Exception as e:
            print(f"Error during QR scan: {e}")
            time.sleep(0.5)
    
    if not qr_data:
        return {
            "success": False,
            "message": "No QR code detected within timeout period",
            "unlocked": False
        }
    
    # Validate QR code with backend
    print(f"Validating QR code with backend...")
    try:
        validation_url = f"{BACKEND_URL}/qr-codes/validate"
        payload = {
            "qrData": qr_data,
            "deviceId": device_id,
            "homeId": home_id
        }
        
        response = requests.post(validation_url, json=payload, timeout=5)
        response.raise_for_status()
        validation_result = response.json()
        
        print(f"Validation result: {validation_result.get('result')}")
        
        if validation_result.get("valid"):
            # Unlock door
            print("Unlocking door...")
            GPIO.output(LOCK_PIN, 0)  # unlock
            time.sleep(UNLOCK_DURATION)
            GPIO.output(LOCK_PIN, 1)  # lock back
            
            return {
                "success": True,
                "message": "Access granted - door unlocked",
                "unlocked": True,
                "validation_result": validation_result
            }
        else:
            return {
                "success": False,
                "message": validation_result.get("message", "QR code validation failed"),
                "unlocked": False,
                "validation_result": validation_result
            }
            
    except requests.exceptions.RequestException as e:
        print(f"Backend validation error: {e}")
        return {
            "success": False,
            "message": f"Backend validation error: {str(e)}",
            "unlocked": False
        }
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {
            "success": False,
            "message": f"Error: {str(e)}",
            "unlocked": False
        }

# ------------ CONTINUOUS QR SCANNING ENDPOINT ------------
@app.get("/scan-qr-continuous")
def scan_qr_continuous(
    device_id: str,
    home_id: str,
    key: str = Depends(verify_key)
):
    # Continuously scan for QR codes and unlock when valid code is detected
    # Returns streaming response with scan status
    print(f"Starting continuous QR code scanning...")
    
    cam = get_camera()
    last_unlock_time = 0
    UNLOCK_COOLDOWN = 5  # Minimum seconds between unlocks
    
    def generate_scan_status():
        nonlocal last_unlock_time
        
        while True:
            try:
                frame = cam.capture_array()
                qr_data = scan_qr_code_from_frame(frame)
                
                if qr_data:
                    now = time.time()
                    
                    # Check cooldown
                    if now - last_unlock_time < UNLOCK_COOLDOWN:
                        status_msg = f"Cooldown active ({int(UNLOCK_COOLDOWN - (now - last_unlock_time))}s remaining)"
                        yield f"data: {json.dumps({'status': 'cooldown', 'message': status_msg})}\n\n"
                        time.sleep(0.5)
                        continue
                    
                    # Validate with backend
                    try:
                        validation_url = f"{BACKEND_URL}/qr-codes/validate"
                        payload = {
                            "qrData": qr_data,
                            "deviceId": device_id,
                            "homeId": home_id
                        }
                        
                        response = requests.post(validation_url, json=payload, timeout=3)
                        response.raise_for_status()
                        validation_result = response.json()
                        
                        if validation_result.get("valid"):
                            # Unlock door
                            GPIO.output(LOCK_PIN, 0)
                            time.sleep(UNLOCK_DURATION)
                            GPIO.output(LOCK_PIN, 1)
                            
                            last_unlock_time = now
                            yield f"data: {json.dumps({'status': 'unlocked', 'message': 'Access granted - door unlocked'})}\n\n"
                        else:
                            yield f"data: {json.dumps({'status': 'denied', 'message': validation_result.get('message', 'Invalid QR code')})}\n\n"
                            
                    except Exception as e:
                        yield f"data: {json.dumps({'status': 'error', 'message': f'Validation error: {str(e)}'})}\n\n"
                else:
                    yield f"data: {json.dumps({'status': 'scanning', 'message': 'Scanning for QR code...'})}\n\n"
                
                time.sleep(0.2)  # Small delay between scans
                
            except Exception as e:
                yield f"data: {json.dumps({'status': 'error', 'message': f'Scan error: {str(e)}'})}\n\n"
                time.sleep(1)
    
    return StreamingResponse(
        generate_scan_status(),
        media_type="text/event-stream"
    )

# ======================================================
#                    CAMERA STREAM
# ======================================================

@app.get("/stream")
def stream(key: str = Depends(verify_key)):
    print("Stream requested")
    cam = get_camera()
    
    def generate_frames():
        frame_count = 0
        while True:
            frame = cam.capture_array()
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            ok, buffer = cv2.imencode(".jpg", frame)
            if not ok:
                print("JPEG encode failed")
                continue
            frame_bytes = buffer.tobytes()
            frame_count += 1
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" +
                frame_bytes +
                b"\r\n"
            )
    
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

# ======================================================
#                    CLEANUP ON SHUTDOWN
# ======================================================

@app.on_event("shutdown")
def shutdown_event():
    print("Cleaning up...")
    GPIO.output(LOCK_PIN, 1)
    GPIO.cleanup()
    global picam2
    if picam2:
        picam2.stop()
    print("Cleanup done")

# ======================================================
#                       UVICORN
# ======================================================

if __name__ == "__main__":
    print("Starting HomeGuard server with QR code support...")
    print(f"Backend URL: {BACKEND_URL}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
