import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, os.path.abspath(backend_path))

# Set working directory to backend so relative paths work
os.chdir(os.path.abspath(backend_path))

from server import app