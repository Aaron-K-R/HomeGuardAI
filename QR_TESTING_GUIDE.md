# QR Code Testing Guide

# What's Implemented

The QR code system has the following components:

1. QR Code Generation - Generate QR codes in the mobile app
2. QR Code Scanning - Pi scans QR codes using camera
3. QR Code Validation - Backend validates QR codes
4. Door Control - Backend sends unlock commands to Pi

# Architecture

- Mobile App: Generates QR codes with access permissions
- Raspberry Pi: Scans QR codes using camera and sends to backend
- Backend API: Validates QR codes and controls door lock/unlock
- ML Service: Provides QR code scanning functionality for Pi

# ----------------------- How to Test ------------------------

# Step 1: Start the Backend
```bash
cd HomeGuardAI/backend
./mvnw spring-boot:run
```

# Step 2: Start the ML Service (on Pi)
```bash
cd HomeGuardAI/ml
pip install -r requirements.txt
python main.py
```

# Step 3: Start the Mobile App
```bash
cd HomeGuardAI/mobile
npm start
```

# Step 4: Generate QR Code in Mobile App
1. Open the app on your device/simulator
2. Select a home
3. Go to the main dashboard
4. Tap the "QR Code" button
5. Tap "Generate QR Code"
6. Select access type (Single Entry or Date/Time Range)
7. A QR code will be generated and displayed

# Step 5: Test QR Code Scanning on Pi
1. Display the generated QR code on a phone/tablet
2. Run the QR scanning service on the Pi:
   ```python
   from qr_service import QRCodeService
   
   qr_service = QRCodeService(backend_url="http://your-backend-url:8080/api/v1")
   qr_service.initialize_camera()
   result = qr_service.process_qr_scan(device_id="your-device-id", home_id="your-home-id")
   print(result)
   ```
3. Point the Pi camera at the QR code
4. The Pi will scan, validate with backend, and unlock the door if valid

# ----------------- Features ----------------------------------------

# QR Code Generation (Mobile App)
- Generates QR codes with JSON data containing:
  - homeId: Home the QR code is for
  - userId: User who generated it
  - accessType: Single entry or date/time range
  - expiresAt: Expiration timestamp
  - maxUses: Maximum number of uses (for single entry)
  - startDateTime/endDateTime: Valid time range (for date/time access)
- QR codes expire after 24 hours (default) or based on access type
- Shows QR code in a modal with instructions
- Easy to share or display on another device

# QR Code Scanning (Pi)
- Real-time QR code detection using Pi camera
- Sends QR data to backend for validation
- Receives validation result
- Triggers door unlock if validation successful

# QR Code Validation (Backend)
- Validates QR code format (JSON)
- Checks if QR code is for the correct home
- Checks if QR code has expired
- Validates date/time range if applicable
- Checks device status (online/active)
- Creates access log entry
- Returns validation result

# Door Control (Backend)
- Receives unlock commands
- Validates device is online and active
- Sends command to Pi (Pi can poll or use WebSocket)
- Returns success/failure status

# Security Features
- QR codes are home-specific (can't be used for other homes)
- QR codes expire based on access type
- Validates QR code format before processing
- Checks device availability before unlocking
- Logs all access attempts
- Supports single-use and time-based access

# --------------------- Testing Scenarios -------------------------

# Valid QR Code
1. Generate a QR code in mobile app
2. Display QR code on a device
3. Scan QR code with Pi camera
4. Backend validates QR code
5. Door unlocks automatically
6. Access log created with GRANTED status

# Invalid QR Code Format
1. Try scanning a random QR code (like a website QR code)
2. Backend returns validation error
3. Door does not unlock
4. Access log created with DENIED status

# Wrong Home QR Code
1. Generate a QR code for one home
2. Try scanning it at a different home's Pi
3. Backend validates home ID mismatch
4. Door does not unlock
5. Access log created with DENIED status

# Expired QR Code
1. Generate a QR code
2. Wait for expiration (24 hours default, or modify timestamp)
3. Try scanning it
4. Backend validates expiration
5. Door does not unlock
6. Access log created with DENIED status

# Date/Time Range QR Code
1. Generate QR code with date/time range access
2. Try scanning outside the valid time range
3. Backend validates time range
4. Door does not unlock if outside range
5. Door unlocks if within valid time range

# Device Offline
1. Generate a valid QR code
2. Disconnect Pi from network (or mark device offline)
3. Try scanning QR code
4. Backend checks device status
5. Returns error if device offline
6. Door does not unlock

# Debug Information

Backend logs:
- QR code validation requests
- Validation results (GRANTED/DENIED/ERROR)
- Door control commands
- Access log entries

Pi logs:
- QR code detection
- Validation requests to backend
- Unlock command results

Mobile app logs:
- QR code generation
- QR code data structure

# API Endpoints

POST /api/v1/qr-codes/validate
- Validates QR code data
- Request body: { qrData, deviceId, homeId }
- Response: { valid, result, message, homeId, userId, accessType }

POST /api/v1/devices/{deviceId}/control
- Controls door lock/unlock
- Request body: { deviceId, lock, reason }
- Response: { success, message, deviceId, isLocked }

# Integration Notes

1. Pi needs to be configured with:
   - Device ID (registered in backend)
   - Home ID (linked to device)
   - Backend API URL
   - Camera access

2. QR code format is JSON, not the simple string format mentioned in old docs

3. Pi can poll the backend for commands or use WebSocket for real-time control

4. Access logs are automatically created for all validation attempts
