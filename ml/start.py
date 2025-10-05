#!/usr/bin/env python3
"""
Startup script for HomeGuard AI ML Service
"""

import uvicorn
import logging
import os
from main import app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def main():
    """Start the ML service"""
    host = os.getenv("ML_HOST", "0.0.0.0")
    port = int(os.getenv("ML_PORT", "8001"))
    workers = int(os.getenv("ML_WORKERS", "1"))
    
    logger.info(f"Starting HomeGuard AI ML Service on {host}:{port}")
    logger.info(f"Workers: {workers}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        workers=workers,
        reload=False,  # Set to True for development
        log_level="info"
    )

if __name__ == "__main__":
    main()
