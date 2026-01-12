"""
CRUD operations for Users, SOWs, and related data.
"""
from typing import List, Optional, Dict, Any
from pymongo.database import Database
from datetime import datetime, timezone
import uuid

from models import (
    User, UserCreate, UserUpdate,
    SOW, SOWCreate, SOWUpdate, SOWStatus,
    ApprovalComment, SOWRevision
)
from auth import get_password_hash

class UserService:
    """Service for user CRUD operations."""
    
    def __init__(self, db: Database):
        self.collection = db.users
    
    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        user_dict = user_data.model_dump()
        
        # Hash the password
        password = user_dict.pop("password")
        user_dict["hashed_password"] = get_password_hash(password)
        
        # Generate ID
        user_dict["id"] = str(uuid.uuid4())
        
        # Insert into database
        self.collection.insert_one(user_dict)
        
        # Return user without password
        user_dict.pop("hashed_password")
        return User(**user_dict)
    
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        user_dict = self.collection.find_one({"id": user_id}, {"hashed_password": 0})
        if user_dict:
            user_dict.pop("_id", None)
            return User(**user_dict)
        return None
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email (includes hashed_password for authentication)."""
        user_dict = self.collection.find_one({"email": email})
        if user_dict:
            user_dict.pop("_id", None)
            return user_dict
        return None
    
    def get_all_users(self) -> List[User]:
        """Get all users."""
        users = []
        for user_dict in self.collection.find({}, {"hashed_password": 0}):
            user_dict.pop("_id", None)
            users.append(User(**user_dict))
        return users
    
    def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user information."""
        update_dict = {k: v for k, v in user_data.model_dump().items() if v is not None}
        
        if not update_dict:
            return self.get_user_by_id(user_id)
        
        result = self.collection.update_one(
            {"id": user_id},
            {"$set": update_dict}
        )
        
        if result.modified_count > 0:
            return self.get_user_by_id(user_id)
        return None
    
    def delete_user(self, user_id: str) -> bool:
        """Delete a user."""
        result = self.collection.delete_one({"id": user_id})
        return result.deleted_count > 0

class SOWService:
    """Service for SOW CRUD operations."""
    
    def __init__(self, db: Database):
        self.collection = db.sows
    
    def create_sow(self, sow_data: SOWCreate) -> SOW:
        """Create a new SOW."""
        sow_dict = sow_data.model_dump()
        
        # Generate ID and timestamps
        sow_dict["id"] = str(uuid.uuid4())
        current_timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)
        sow_dict["createdAt"] = current_timestamp
        sow_dict["updatedAt"] = current_timestamp
        sow_dict["status"] = SOWStatus.DRAFT.value
        
        # Initialize version tracking
        sow_dict["currentVersion"] = 1
        sow_dict["revisionHistory"] = []
        sow_dict["approvalHistory"] = []
        
        # Insert into database
        self.collection.insert_one(sow_dict)
        
        # Return SOW
        sow_dict.pop("_id", None)
        return SOW(**sow_dict)
    
    def get_sow_by_id(self, sow_id: str) -> Optional[SOW]:
        """Get SOW by ID."""
        sow_dict = self.collection.find_one({"id": sow_id})
        if sow_dict:
            sow_dict.pop("_id", None)
            return SOW(**sow_dict)
        return None
    
    def get_all_sows(self, client_id: Optional[str] = None) -> List[SOW]:
        """Get all SOWs, optionally filtered by client."""
        query = {"clientId": client_id} if client_id else {}
        sows = []
        for sow_dict in self.collection.find(query).sort("createdAt", -1):
            sow_dict.pop("_id", None)
            sows.append(SOW(**sow_dict))
        return sows
    
    def update_sow(self, sow_id: str, sow_data: SOWUpdate, user_id: str, user_name: str) -> Optional[SOW]:
        """Update SOW information."""
        update_dict = {k: v for k, v in sow_data.model_dump().items() if v is not None}
        
        if not update_dict:
            return self.get_sow_by_id(sow_id)
        
        # Add updated timestamp
        update_dict["updatedAt"] = int(datetime.now(timezone.utc).timestamp() * 1000)
        
        # Get current SOW for revision tracking
        current_sow = self.get_sow_by_id(sow_id)
        if not current_sow:
            return None
        
        # Create revision entry
        if current_sow:
            revision_changes = []
            for field, new_value in update_dict.items():
                old_value = getattr(current_sow, field, None)
                if old_value != new_value and field != "updatedAt":
                    revision_changes.append({
                        "field": field,
                        "oldValue": old_value,
                        "newValue": new_value
                    })
            
            if revision_changes:
                revision = {
                    "id": str(uuid.uuid4()),
                    "version": current_sow.currentVersion + 1,
                    "timestamp": update_dict["updatedAt"],
                    "changedBy": user_id,
                    "changedByName": user_name,
                    "changeDescription": f"Updated {len(revision_changes)} field(s)",
                    "changes": revision_changes,
                    "snapshot": current_sow.model_dump(exclude={"revisionHistory", "currentVersion"})
                }
                
                # Increment version
                update_dict["currentVersion"] = current_sow.currentVersion + 1
                
                # Add revision to history
                self.collection.update_one(
                    {"id": sow_id},
                    {"$push": {"revisionHistory": revision}}
                )
        
        # Update SOW
        result = self.collection.update_one(
            {"id": sow_id},
            {"$set": update_dict}
        )
        
        if result.modified_count > 0 or result.matched_count > 0:
            return self.get_sow_by_id(sow_id)
        return None
    
    def delete_sow(self, sow_id: str) -> bool:
        """Delete a SOW."""
        result = self.collection.delete_one({"id": sow_id})
        return result.deleted_count > 0
    
    def add_approval_comment(self, sow_id: str, comment: ApprovalComment) -> Optional[SOW]:
        """Add an approval comment to a SOW."""
        comment_dict = comment.model_dump()
        
        result = self.collection.update_one(
            {"id": sow_id},
            {
                "$push": {"approvalHistory": comment_dict},
                "$set": {"updatedAt": int(datetime.now(timezone.utc).timestamp() * 1000)}
            }
        )
        
        if result.modified_count > 0:
            return self.get_sow_by_id(sow_id)
        return None
    
    def get_sows_by_status(self, status: SOWStatus, client_id: Optional[str] = None) -> List[SOW]:
        """Get SOWs by status."""
        query = {"status": status.value}
        if client_id:
            query["clientId"] = client_id
        
        sows = []
        for sow_dict in self.collection.find(query).sort("createdAt", -1):
            sow_dict.pop("_id", None)
            sows.append(SOW(**sow_dict))
        return sows
