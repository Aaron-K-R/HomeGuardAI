#!/usr/bin/env python3
"""
Simple run script for HomeGuard AI Face Embedding Service
"""

import subprocess
import sys
import os

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import face_recognition
        import numpy
        import PIL
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install dependencies with: pip install -r requirements.txt")
        return False

def main():
    """Main function"""
    print("HomeGuard AI - Face Embedding Service")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Start the service
    print("🚀 Starting face embedding service...")
    print("Service will be available at: http://localhost:8001")
    print("API docs will be available at: http://localhost:8001/docs")
    print("\nPress Ctrl+C to stop the service")
    print("-" * 40)
    
    try:
        # Run the main application
        from main import app
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
    except KeyboardInterrupt:
        print("\n👋 Service stopped by user")
    except Exception as e:
        print(f"❌ Error starting service: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
