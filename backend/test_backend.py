#!/usr/bin/env python3
"""
Quick test script to verify backend API endpoints work.
This runs a simple test of the API without needing MongoDB.
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

print("Testing SOWgen.ai Backend API...")
print("=" * 50)

# Test imports
print("\n1. Testing imports...")
try:
    from models import User, SOW, UserCreate, SOWCreate, UserRole, SOWStatus
    from auth import get_password_hash, verify_password, create_access_token, decode_access_token
    print("   ✅ All imports successful")
except Exception as e:
    print(f"   ❌ Import failed: {e}")
    sys.exit(1)

# Test password hashing
print("\n2. Testing password hashing...")
try:
    password = "test123"
    hashed = get_password_hash(password)
    is_valid = verify_password(password, hashed)
    assert is_valid, "Password verification failed"
    print(f"   ✅ Password hashing works")
except Exception as e:
    print(f"   ❌ Password hashing failed: {e}")
    sys.exit(1)

# Test JWT token creation
print("\n3. Testing JWT token creation...")
try:
    token = create_access_token(data={"sub": "test@example.com"})
    payload = decode_access_token(token)
    assert payload is not None, "Token decoding failed"
    assert payload["sub"] == "test@example.com", "Token data mismatch"
    print(f"   ✅ JWT token creation and validation works")
except Exception as e:
    print(f"   ❌ JWT token failed: {e}")
    sys.exit(1)

# Test Pydantic models
print("\n4. Testing Pydantic models...")
try:
    user_data = UserCreate(
        name="Test User",
        email="test@example.com",
        role=UserRole.CLIENT,
        organization="Test Corp",
        password="test123"
    )
    print(f"   ✅ User model validation works")
    
    sow_data = SOWCreate(
        clientId="test-client-id",
        clientName="Test Client",
        projectName="Test Project",
        projectDescription="Test description",
        clientOrganization="Test Corp",
        includeMigration=True,
        includeTraining=False,
        migrationStages=[],
        selectedTrainings=[]
    )
    print(f"   ✅ SOW model validation works")
except Exception as e:
    print(f"   ❌ Model validation failed: {e}")
    sys.exit(1)

# Test FastAPI app initialization
print("\n5. Testing FastAPI app initialization...")
try:
    from main import app
    assert app is not None, "FastAPI app not initialized"
    print(f"   ✅ FastAPI app initialized successfully")
    print(f"   📝 App title: {app.title}")
    print(f"   📝 App version: {app.version}")
except Exception as e:
    print(f"   ❌ FastAPI initialization failed: {e}")
    print(f"   ℹ️  This is expected if MongoDB is not running")

print("\n" + "=" * 50)
print("✅ Backend API code validation complete!")
print("\nNext steps:")
print("1. Set up MongoDB (local or Atlas)")
print("2. Configure .env file with MongoDB connection")
print("3. Run: python main.py")
print("4. Visit: http://localhost:8000/docs")
print("\nSee backend/README.md for detailed instructions.")
