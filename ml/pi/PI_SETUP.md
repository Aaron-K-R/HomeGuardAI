# Raspberry Pi Setup Guide

# Overview

The Pi code files in this folder are reference templates. You need to copy them to your Raspberry Pi and configure them there.

# Files to Copy to Pi

1. `homeguard_qr_integrated.py` - FastAPI server with QR code support
2. `homeguard_face_qr_combined.py` - Combined face recognition + QR code scanning

# ----------------- Setup Instructions ---------------------------------

# Step 1: Copy Files to Pi

Option A: Using SCP
```bash
scp ml/homeguard_qr_integrated.py pi@your-pi-ip:/home/pi/
scp ml/homeguard_face_qr_combined.py pi@your-pi-ip:/home/pi/
```

Option B: Using USB drive
- Copy files to USB drive
- Plug into Pi
- Copy files to desired location

Option C: Using Git (if Pi has repo access)
- Clone repo on Pi
- Files will be in the ml/ folder

# Step 2: Install Dependencies on Pi

```bash
pip install pyzbar opencv-python requests fastapi uvicorn
```

Or if using requirements.txt:
```bash
pip install -r requirements.txt
```

# Step 3: Configure Settings

Edit the files on the Pi and update:
- `API_KEY = "YOUR_SECRET_KEY"` - Set your actual secret key
- `BACKEND_URL = "http://172.20.10.3:8080/api/v1"` - Your Spring Boot backend URL
- `DEVICE_ID = "your-device-id"` - Your Pi's device ID from backend
- `HOME_ID = "your-home-id"` - Your home ID
- `LOCK_PIN = 17` - GPIO pin for lock control (if different)

# Step 4: Run on Pi

Option A: FastAPI Server
```bash
python3 homeguard_qr_integrated.py
```

Option B: Combined Face + QR
```bash
python3 homeguard_face_qr_combined.py
```


# Pi File Structure

```
/home/pi/homeguard/
├── homeguard_qr_integrated.py
├── homeguard_face_qr_combined.py
├── requirements.txt
└── config.py (optional, for centralized config)
```

# Notes

- The files in this repository are templates/reference
- Actual deployment happens on the Pi itself
- Update configuration values on the Pi, not in the repo
- Pi needs camera access and GPIO permissions

