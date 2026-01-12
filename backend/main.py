"""
FastAPI Backend for SOWgen.ai
MongoDB integration for data persistence on GitHub Pages.
"""
from fastapi import FastAPI, HTTPException, Depends, status, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

from database import mongodb
from models import (
    User, UserCreate, UserUpdate,
    SOW, SOWCreate, SOWUpdate, SOWStatus,
    ApprovalComment, Token, LoginRequest
)
from crud import UserService, SOWService
from auth import verify_password, create_access_token, decode_access_token
from rate_limiter import login_limiter

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SOWgen.ai API",
    description="Backend API for SOW Generation Platform with MongoDB persistence",
    version="1.0.0"
)

# CORS configuration for GitHub Pages
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security scheme
security = HTTPBearer()

# Database connection on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup."""
    mongodb.connect()
    
    # Initialize demo users if database is empty
    db = mongodb.get_db()
    user_service = UserService(db)
    
    if len(user_service.get_all_users()) == 0:
        print("🔄 Initializing demo users...")
        demo_users = [
            UserCreate(
                name="Demo Client",
                email="client@example.com",
                role="client",
                organization="Acme Corp",
                password="Demo123!"
            ),
            UserCreate(
                name="Xebia Admin",
                email="admin@xebia.com",
                role="xebia-admin",
                organization="Xebia",
                password="Admin123!"
            ),
            UserCreate(
                name="Xebia Approver",
                email="approver@xebia.com",
                role="approver",
                organization="Xebia",
                password="Approver123!"
            )
        ]
        
        for user_data in demo_users:
            try:
                user_service.create_user(user_data)
            except Exception as e:
                print(f"⚠️  Warning: Could not create demo user {user_data.email}: {e}")
        
        print("✅ Demo users initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown."""
    mongodb.close()

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Validate JWT token and return current user."""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    db = mongodb.get_db()
    user_service = UserService(db)
    user_dict = user_service.get_user_by_email(email)
    
    if user_dict is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_dict.pop("hashed_password", None)
    user_dict.pop("_id", None)
    return User(**user_dict)

# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "SOWgen.ai API is running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    try:
        db = mongodb.get_db()
        # Test database connection
        db.command("ping")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": int(datetime.now(timezone.utc).timestamp() * 1000)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# Authentication endpoints
@app.post("/api/auth/login", response_model=dict)
async def login(login_data: LoginRequest, request: Request):
    """Authenticate user and return JWT token with rate limiting."""
    # Get client IP for rate limiting
    client_ip = request.client.host if request.client else "unknown"
    
    # Check rate limit
    allowed, remaining = login_limiter.is_allowed(client_ip)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later.",
            headers={
                "Retry-After": "300",  # 5 minutes
                "X-RateLimit-Limit": "5",
                "X-RateLimit-Remaining": "0"
            }
        )
    
    db = mongodb.get_db()
    user_service = UserService(db)
    
    user_dict = user_service.get_user_by_email(login_data.email)
    
    if not user_dict or not verify_password(login_data.password, user_dict["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={
                "WWW-Authenticate": "Bearer",
                "X-RateLimit-Remaining": str(remaining - 1)
            },
        )
    
    access_token = create_access_token(data={"sub": user_dict["email"]})
    
    # Return token and user info
    user_dict.pop("hashed_password")
    user_dict.pop("_id", None)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict
    }

@app.get("/api/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return current_user

# User endpoints
@app.post("/api/users", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new user (admin only)."""
    if current_user.role != "xebia-admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create users"
        )
    
    db = mongodb.get_db()
    user_service = UserService(db)
    
    # Check if user already exists
    existing_user = user_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    return user_service.create_user(user_data)

@app.get("/api/users", response_model=List[User])
async def get_users(current_user: User = Depends(get_current_user)):
    """Get all users (admin only)."""
    if current_user.role != "xebia-admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view all users"
        )
    
    db = mongodb.get_db()
    user_service = UserService(db)
    return user_service.get_all_users()

@app.get("/api/users/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get user by ID."""
    db = mongodb.get_db()
    user_service = UserService(db)
    
    user = user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Users can only view themselves unless they're admin
    if current_user.id != user_id and current_user.role != "xebia-admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this user"
        )
    
    return user

@app.put("/api/users/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update user information."""
    # Users can only update themselves unless they're admin
    if current_user.id != user_id and current_user.role != "xebia-admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )
    
    db = mongodb.get_db()
    user_service = UserService(db)
    
    user = user_service.update_user(user_id, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@app.delete("/api/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a user (admin only)."""
    if current_user.role != "xebia-admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete users"
        )
    
    db = mongodb.get_db()
    user_service = UserService(db)
    
    if not user_service.delete_user(user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

# SOW endpoints
@app.post("/api/sows", response_model=SOW, status_code=status.HTTP_201_CREATED)
async def create_sow(
    sow_data: SOWCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new SOW."""
    db = mongodb.get_db()
    sow_service = SOWService(db)
    
    return sow_service.create_sow(sow_data)

@app.get("/api/sows", response_model=List[SOW])
async def get_sows(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get all SOWs, optionally filtered by status."""
    db = mongodb.get_db()
    sow_service = SOWService(db)
    
    # Clients can only see their own SOWs
    client_id = None if current_user.role in ["xebia-admin", "approver"] else current_user.id
    
    if status:
        try:
            status_enum = SOWStatus(status)
            return sow_service.get_sows_by_status(status_enum, client_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status: {status}"
            )
    
    return sow_service.get_all_sows(client_id)

@app.get("/api/sows/{sow_id}", response_model=SOW)
async def get_sow(
    sow_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get SOW by ID."""
    db = mongodb.get_db()
    sow_service = SOWService(db)
    
    sow = sow_service.get_sow_by_id(sow_id)
    if not sow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOW not found"
        )
    
    # Clients can only view their own SOWs
    if current_user.role == "client" and sow.clientId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this SOW"
        )
    
    return sow

@app.put("/api/sows/{sow_id}", response_model=SOW)
async def update_sow(
    sow_id: str,
    sow_data: SOWUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update SOW information."""
    db = mongodb.get_db()
    sow_service = SOWService(db)
    
    # Get existing SOW to check permissions
    existing_sow = sow_service.get_sow_by_id(sow_id)
    if not existing_sow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOW not found"
        )
    
    # Check permissions
    if current_user.role == "client" and existing_sow.clientId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this SOW"
        )
    
    sow = sow_service.update_sow(sow_id, sow_data, current_user.id, current_user.name)
    if not sow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOW not found"
        )
    
    return sow

@app.delete("/api/sows/{sow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sow(
    sow_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a SOW with atomic permission check."""
    db = mongodb.get_db()
    sow_service = SOWService(db)
    
    # Use atomic delete with permission check to prevent race conditions
    is_admin = current_user.role == "xebia-admin"
    deleted = sow_service.delete_sow_with_permission(sow_id, current_user.id, is_admin)
    
    if not deleted:
        # Check if SOW exists to provide better error message
        existing_sow = sow_service.get_sow_by_id(sow_id)
        if not existing_sow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="SOW not found"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this SOW"
            )

@app.post("/api/sows/{sow_id}/comments", response_model=SOW)
async def add_approval_comment(
    sow_id: str,
    comment: ApprovalComment,
    current_user: User = Depends(get_current_user)
):
    """Add an approval comment to a SOW."""
    db = mongodb.get_db()
    sow_service = SOWService(db)
    
    sow = sow_service.add_approval_comment(sow_id, comment)
    if not sow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SOW not found"
        )
    
    return sow

if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    
    uvicorn.run(app, host=host, port=port)
