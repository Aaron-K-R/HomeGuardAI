# QR Code Integration

Simple QR code access control for HomeGuard AI mobile app.

## Dependencies

### Mobile App Dependencies
```json
{
  "expo-camera": "^17.0.8",
  "react-native-qrcode-svg": "^6.2.0",
  "react-native-svg": "^13.4.0"
}
```

## Installation

```bash
cd mobile
npm install
```

## Usage

1. Generate QR Code: Tap "Generate New QR Code" button
2. Scan QR Code: Position QR code within camera frame
3. Access Granted: Door unlocks if QR code is valid

## QR Code Format

```
homeguard:home_id:user_id:timestamp
```

## Features

- ✅ 24-hour expiration
- ✅ Home-specific access
- ✅ Camera scanning
- ✅ Self-contained (no backend required)

## Files

- `mobile/src/screens/QRCodeScreen.tsx` - Main QR functionality
- `mobile/src/screens/FaceDetectionScreen.tsx` - QR access button
- `mobile/src/navigation/MainNavigator.tsx` - Navigation setup