# 🧪 Simple QR Code Testing Guide

## ✅ **What's Implemented**

I've created a simple QR code system with two main features:

1. **QR Code Generation** - Generate QR codes in the mobile app
2. **QR Code Scanning** - Scan QR codes to unlock the door

## 🚀 **How to Test**

### **Step 1: Start the Mobile App**
```bash
cd /Users/aaronreynoso/Capstone/HomeGuardAI/mobile
npm start
```

### **Step 2: Navigate to QR Code Screen**
1. Open the app on your device/simulator
2. Select a home
3. Go to the main dashboard
4. Tap the **"QR Code"** button (green button)
5. Or go to Face Detection screen and tap **"QR Code"**

### **Step 3: Test QR Code Generation**
1. In the QR Code screen, tap **"Generate New QR Code"**
2. A modal will appear with a QR code
3. The QR code contains: `homeguard:home_id:user_id:timestamp`
4. QR codes expire after 24 hours for security

### **Step 4: Test QR Code Scanning**
1. In the QR Code screen, you'll see a camera view
2. Point the camera at the generated QR code
3. The app should detect the QR code and show "Access Granted! 🔓"
4. Tap "Tap to Scan Again" to scan another QR code

## 🔧 **Features**

### **QR Code Generation**
- ✅ Generates QR codes with home ID, user ID, and timestamp
- ✅ QR codes expire after 24 hours
- ✅ Shows QR code in a modal with instructions
- ✅ Easy to share or display on another device

### **QR Code Scanning**
- ✅ Real-time QR code detection using camera
- ✅ Validates QR code format (`homeguard:home_id:user_id:timestamp`)
- ✅ Checks if QR code is for the correct home
- ✅ Checks if QR code has expired (24 hours)
- ✅ Shows success/error messages
- ✅ Can scan multiple times

### **Security Features**
- ✅ QR codes are home-specific (can't be used for other homes)
- ✅ QR codes expire after 24 hours
- ✅ Validates QR code format before processing
- ✅ Shows clear error messages for invalid/expired codes

## 📱 **Navigation**

The QR Code screen is accessible from:
1. **Main Dashboard** → "QR Code" button (green)
2. **Face Detection Screen** → "QR Code" button (green)

## 🎯 **Testing Scenarios**

### **Valid QR Code**
1. Generate a QR code
2. Scan it immediately
3. Should show "Access Granted! 🔓"

### **Invalid QR Code**
1. Try scanning a random QR code (like a website QR code)
2. Should show "Invalid QR Code" error

### **Wrong Home QR Code**
1. Generate a QR code for one home
2. Try scanning it from a different home
3. Should show "Access Denied" error

### **Expired QR Code**
1. Generate a QR code
2. Wait 24+ hours (or modify the timestamp in the QR data)
3. Try scanning it
4. Should show "QR Code Expired" error

## 🔍 **Debug Information**

The app logs QR code data to the console:
- Generated QR data: `homeguard:home_id:user_id:timestamp`
- Scanned QR data: Shows what was detected
- Validation results: Shows if validation passed/failed

## 🚨 **Troubleshooting**

### **Camera Permission Issues**
- Make sure to grant camera permission when prompted
- If denied, go to device settings and enable camera permission for the app

### **QR Code Not Detecting**
- Ensure good lighting
- Hold the QR code steady in the camera frame
- Make sure the QR code is not too small or too large

### **App Crashes**
- Check the console for error messages
- Make sure all dependencies are installed: `npm install`

## 🎉 **Success!**

If everything works correctly, you should be able to:
1. Generate QR codes in the app
2. Scan QR codes to unlock the door
3. See appropriate error messages for invalid codes
4. Have QR codes expire after 24 hours

The system is now ready for basic QR code access control! 🚀
