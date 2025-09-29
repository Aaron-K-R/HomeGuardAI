# HomeGuard AI - Face Embedding Service

This service provides face embedding generation capabilities for the HomeGuard system. The service converts images to face embeddings that can be stored and used by edge devices for facial recognition.

## Features

- **Face Embedding Generation**: Convert images to face embeddings for storage and comparison
- **Multiple Face Support**: Handle multiple faces per person from multiple images
- **Image Validation**: Validate and process various image formats
- **RESTful API**: Easy integration with backend services
- **Edge Device Ready**: Generates embeddings that can be used by edge devices for recognition

## Setup

### Prerequisites

- Python 3.8+
- pip or conda

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. (Optional) Install dlib with CUDA support for better performance:
```bash
# For CPU-only (default)
pip install dlib

# For GPU acceleration (if you have CUDA)
# Follow dlib installation instructions for your system
```

### Running the Service

1. **Quick start**:
```bash
python run.py
```

2. **Development mode**:
```bash
python main.py
```

3. **Production mode**:
```bash
python start.py
```

4. **With custom configuration**:
```bash
ML_HOST=0.0.0.0 ML_PORT=8001 python start.py
```

The service will be available at `http://localhost:8001`

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Generate Face Embeddings
```
POST /embed-faces
```
Generate face embeddings from multiple images for a person.

**Request Body:**
```json
{
  "person_id": "person_123",
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  ]
}
```

**Response:**
```json
{
  "person_id": "person_123",
  "face_embeddings": [
    [0.1, 0.2, 0.3, ...],
    [0.4, 0.5, 0.6, ...]
  ],
  "face_count": 2,
  "success": true,
  "message": "Successfully processed 2 faces from 2 images"
}
```

## Testing

### Run Tests

1. **Comprehensive test** (with generated test images):
```bash
python test_facial_recognition.py
```

2. **Test with real images**:
```bash
python test_with_real_images.py
```

The test scripts will:
- Check service health
- Test face embedding generation
- Test with multiple images and variations
- Validate edge cases
- Provide detailed results

## Configuration

Environment variables:

- `ML_HOST`: Server host (default: 0.0.0.0)
- `ML_PORT`: Server port (default: 8001)
- `ML_WORKERS`: Number of workers (default: 1)
- `FACE_TOLERANCE`: Face matching tolerance (default: 0.6)
- `LOG_LEVEL`: Logging level (default: INFO)

## Usage Examples

### Python Client

```python
from ml_client import MLServiceClient

# Initialize client
client = MLServiceClient("http://localhost:8001")

# Check health
if client.health_check():
    print("ML service is healthy")

# Generate embeddings
result = client.embed_faces("person_123", [base64_image1, base64_image2])
if result.success:
    print(f"Generated {result.face_count} embeddings")

# Recognize face
recognition = client.recognize_face(input_image, known_embeddings)
if recognition.success and recognition.person_id:
    print(f"Recognized as {recognition.person_id} with {recognition.confidence:.1%} confidence")
```

### cURL Examples

```bash
# Health check
curl http://localhost:8001/health

# Generate embeddings
curl -X POST http://localhost:8001/embed-faces \
  -H "Content-Type: application/json" \
  -d '{
    "person_id": "person_123",
    "images": ["data:image/jpeg;base64,..."]
  }'

# Recognize face
curl -X POST http://localhost:8001/recognize-face \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,...",
    "known_embeddings": [...]
  }'
```

## Integration with Backend

The ML service is designed to integrate with the HomeGuard backend:

1. **Face Enrollment**: When a person is added, send their images to `/embed-faces`
2. **Store Embeddings**: Save the returned embeddings in the `face_vector` field of the Person entity
3. **Face Recognition**: When someone tries to access, send their image to `/recognize-face` with all known embeddings
4. **Access Control**: Use the recognition result to grant or deny access

## Performance Notes

- **CPU vs GPU**: The service works on CPU by default. For better performance with large datasets, consider GPU acceleration
- **Memory Usage**: Face embeddings are stored in memory during recognition. Monitor memory usage with large datasets
- **Tolerance Tuning**: Lower tolerance values (0.4-0.5) are more strict, higher values (0.6-0.7) are more permissive
- **Batch Processing**: For multiple people, consider processing embeddings in parallel

## Troubleshooting

### Common Issues

1. **No faces detected**: Ensure images contain clear, front-facing faces
2. **Low recognition accuracy**: Try adjusting the tolerance value or using more training images
3. **Memory issues**: Reduce the number of workers or process smaller batches
4. **Installation issues**: Ensure all dependencies are properly installed, especially dlib

### Logs

The service logs important information including:
- Face detection results
- Recognition confidence scores
- Error messages
- Performance metrics

Check logs for debugging information.
