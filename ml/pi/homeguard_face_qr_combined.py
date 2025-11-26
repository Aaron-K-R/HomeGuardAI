#!/usr/bin/env python3
# HomeGuard - Combined Face Recognition + QR Code System
# Loads embeddings from backend, performs face recognition,
# scans QR codes, and calls remote lock/unlock APIs

import cv2
import numpy as np
import json
import requests
import time
import face_recognition
from picamera2 import Picamera2
import pyzbar.pyzbar as pyzbar
import RPi.GPIO as GPIO

# ===============================
# CONFIG
# ===============================
EMBEDDING_URL = "http://172.20.10.3:8080/api/v1/persons/home/22e0d413-bf1c-47a5-8a00-cc18d9c6abd6/"
LOCK_URL = "http://172.20.10.2:8000/lock"
UNLOCK_URL = "http://172.20.10.2:8000/unlock"
BACKEND_URL = "http://172.20.10.3:8080/api/v1"
SECRET_KEY = "YOUR_SECRET_KEY"
DEVICE_ID = "your-device-id"
HOME_ID = "22e0d413-bf1c-47a5-8a00-cc18d9c6abd6"

FACE_TOLERANCE = 0.55
RETRY_SECONDS = 5
UNLOCK_COOLDOWN = 5
UNLOCK_TIME = 3

# ------------ GPIO SETUP ------------
LOCK_PIN = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(LOCK_PIN, GPIO.OUT)
GPIO.output(LOCK_PIN, 1)  # Start locked

# ===============================
# PARSE EMBEDDING
# ===============================
def parse_face_vector(face_vector_str):
    try:
        data = json.loads(face_vector_str)
        if isinstance(data, list) and len(data) == 1:
            return np.array(data[0], dtype=np.float32)
        return np.array(data, dtype=np.float32)
    except Exception as e:
        print(f"Error parsing faceVector: {e}")
        return None

# ===============================
# LOCK / UNLOCK API CALLS
# ===============================
def call_lock():
    print("Sending LOCK request...")
    try:
        r = requests.get(LOCK_URL, params={"key": SECRET_KEY}, timeout=4)
        print(f"   {r.status_code}: {r.text}")
    except Exception as e:
        print(f"Lock request failed: {e}")

def call_unlock_then_relock():
    # Unlock for exactly 3 seconds, then relock
    print("Sending UNLOCK request...")
    try:
        r = requests.get(UNLOCK_URL, params={"key": SECRET_KEY}, timeout=4)
        print(f"   {r.status_code}: {r.text}")
    except Exception as e:
        print(f"Unlock request failed: {e}")
        return
    
    print(f"Door unlocked for {UNLOCK_TIME} seconds...")
    time.sleep(UNLOCK_TIME)
    call_lock()
    print("Door relocked after unlock window")

def unlock_door_gpio():
    # Unlock door directly via GPIO
    print("Unlocking door via GPIO...")
    GPIO.output(LOCK_PIN, 0)  # unlock
    time.sleep(UNLOCK_TIME)
    GPIO.output(LOCK_PIN, 1)  # lock back
    print("Door relocked")

# ===============================
# QR CODE SCANNING
# ===============================
def scan_qr_code_from_frame(frame):
    # Scan QR code from a camera frame
    try:
        gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY) if len(frame.shape) == 3 else frame
        decoded_objects = pyzbar.decode(gray)
        
        for obj in decoded_objects:
            if obj.type == 'QRCODE':
                qr_data = obj.data.decode('utf-8')
                return qr_data
        return None
    except Exception as e:
        print(f"Error scanning QR code: {e}")
        return None

def validate_qr_code(qr_data):
    # Validate QR code with backend
    try:
        validation_url = f"{BACKEND_URL}/qr-codes/validate"
        payload = {
            "qrData": qr_data,
            "deviceId": DEVICE_ID,
            "homeId": HOME_ID
        }
        
        response = requests.post(validation_url, json=payload, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"QR validation error: {e}")
        return {"valid": False, "message": str(e)}

# ===============================
# EMBEDDING FETCHER
# ===============================
def fetch_embeddings():
    print(f"Fetching embeddings from: {EMBEDDING_URL}")
    while True:
        try:
            r = requests.get(EMBEDDING_URL, timeout=5)
            r.raise_for_status()
            data = r.json()
            known = {}
            
            print("Received embeddings:")
            for person in data:
                name = person.get("name", "Unknown")
                pid = person["personId"]
                vector_str = person["faceVector"]
                embedding = parse_face_vector(vector_str)
                
                if embedding is None:
                    continue
                
                known[name] = {
                    "id": pid,
                    "embedding": embedding,
                    "color": (0, 255, 0)
                }
                print(f"   {name} ({pid[:8]}...) len={len(embedding)}")
            
            return known
        except Exception as e:
            print(f"Error downloading embeddings: {e}")
            print(f"Retrying in {RETRY_SECONDS}s...")
            time.sleep(RETRY_SECONDS)

# ===============================
# CAMERA INITIALIZATION
# ===============================
def init_camera():
    print("Initializing camera...")
    try:
        picam = Picamera2()
        cfg = picam.create_preview_configuration(main={"size": (640, 480)})
        picam.configure(cfg)
        picam.start()
        print("Using PiCamera2 (CSI Ribbon)")
        return ("picam", picam)
    except Exception as e:
        print(f"PiCamera2 failed: {e}")
    
    for idx in [0, 1, 2]:
        print(f"   Trying USB camera {idx}...")
        cap = cv2.VideoCapture(idx)
        if cap.isOpened():
            ret, frame = cap.read()
            if ret:
                print(f"Using USB camera index {idx}")
                return ("usb", cap)
        if cap:
            cap.release()
    
    print("No working camera found")
    exit(1)

# ===============================
# FACE MATCHING
# ===============================
def match_face(face_encoding, known_faces, tolerance):
    best_name = "Unknown"
    best_distance = 999
    for name, data in known_faces.items():
        dist = face_recognition.face_distance([data["embedding"]], face_encoding)[0]
        if dist < best_distance:
            best_distance = dist
            best_name = name
    if best_distance <= tolerance:
        return best_name, best_distance
    return "Unknown", best_distance

# ===============================
# MAIN LOOP
# ===============================
def run_homeguard():
    print("\n===============================")
    print("HOMEGUARD SYSTEM BOOTING")
    print("Face Recognition + QR Code")
    print("===============================\n")
    
    known_faces = fetch_embeddings()
    cam_type, cam = init_camera()
    last_unlock_time = 0
    
    print(f"Face tolerance: {FACE_TOLERANCE}")
    print(f"QR code scanning enabled")
    print(f"Home ID: {HOME_ID}")
    print(f"Device ID: {DEVICE_ID}\n")
    
    frame_count = 0
    
    while True:
        # Capture frame
        if cam_type == "picam":
            frame = cam.capture_array()
        else:
            ret, frame = cam.read()
            if not ret:
                print("Frame read failed")
                continue
        
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Check for QR code every 10 frames (to reduce processing)
        if frame_count % 10 == 0:
            qr_data = scan_qr_code_from_frame(rgb)
            if qr_data:
                print(f"QR code detected: {qr_data[:50]}...")
                validation_result = validate_qr_code(qr_data)
                
                if validation_result.get("valid"):
                    now = time.time()
                    if now - last_unlock_time >= UNLOCK_COOLDOWN:
                        print("QR code validated - unlocking door")
                        unlock_door_gpio()
                        last_unlock_time = now
                    else:
                        print(f"Cooldown active ({int(UNLOCK_COOLDOWN - (now - last_unlock_time))}s remaining)")
                else:
                    print(f"QR code validation failed: {validation_result.get('message')}")
        
        # Face recognition
        locations = face_recognition.face_locations(rgb, model="hog")
        if len(locations) > 0:
            encodings = face_recognition.face_encodings(rgb, locations)
            
            for enc in encodings:
                name, dist = match_face(enc, known_faces, FACE_TOLERANCE)
                print(f"Detected: {name} | Dist={dist:.3f}")
                
                if name != "Unknown":
                    now = time.time()
                    if now - last_unlock_time >= UNLOCK_COOLDOWN:
                        print(f"Face recognized: {name} - unlocking door")
                        unlock_door_gpio()
                        last_unlock_time = now
                    else:
                        print(f"Cooldown active ({int(UNLOCK_COOLDOWN - (now - last_unlock_time))}s remaining)")
        
        frame_count += 1
        time.sleep(0.05)

# ===============================
# ENTRY POINT
# ===============================
if __name__ == "__main__":
    try:
        run_homeguard()
    except KeyboardInterrupt:
        print("\nExiting HomeGuard...")
    finally:
        print("Clean shutdown.")
        GPIO.output(LOCK_PIN, 1)
        GPIO.cleanup()
