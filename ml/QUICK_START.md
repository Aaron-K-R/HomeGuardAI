# Quick Start Guide - HomeGuard AI Face Embedding Service

## 🚀 Quick Start

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Start the service**:
```bash
python run.py
```

3. **Test the service**:
```bash
python test_facial_recognition.py
```

## 📋 What This Service Does

- **Converts images to face embeddings** - Takes base64 encoded images and generates face embeddings
- **Handles multiple faces per person** - Can process multiple images for a single person
- **Edge device ready** - Generates embeddings that edge devices can use for recognition
- **RESTful API** - Easy integration with your backend

## 🔧 API Usage

### Generate Face Embeddings

```bash
curl -X POST http://localhost:8001/embed-faces \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": "person_123",
    "images": ["data:image/jpeg;base64,..."]
  }'
```

### Check Health

```bash
curl http://localhost:8001/health
```

## 📁 File Structure

```
ml/
├── main.py                    # Main FastAPI application
├── face_service.py           # Core face processing logic
├── config.py                 # Configuration settings
├── run.py                    # Quick start script
├── test_facial_recognition.py # Comprehensive test suite
├── test_with_real_images.py  # Test with real images
├── requirements.txt          # Python dependencies
└── README.md                # Detailed documentation
```

## 🧪 Testing

The service includes comprehensive test suites:

1. **`test_facial_recognition.py`** - Tests with generated images, variations, and edge cases
2. **`test_with_real_images.py`** - Tests with real image files

## 🔗 Integration

This service is designed to work with the HomeGuard backend:

1. **Backend calls this service** to generate face embeddings
2. **Embeddings are stored** in the `face_vector` field of the Person entity
3. **Edge devices use the embeddings** for facial recognition

## 📊 Example Response

```json
{
  "person_id": "person_123",
  "face_embeddings": [
    [0.1, 0.2, 0.3, ...],  // 128-dimensional face embedding
    [0.4, 0.5, 0.6, ...]  // Another face from the same person
  ],
  "face_count": 2,
  "success": true,
  "message": "Successfully processed 2 faces from 2 images"
}
```

## 🛠️ Troubleshooting

- **Service won't start**: Check if port 8001 is available
- **No faces detected**: Ensure images contain clear, front-facing faces
- **Installation issues**: Make sure all dependencies are installed correctly

## 📖 Full Documentation

See `README.md` for complete documentation including configuration options and advanced usage.
