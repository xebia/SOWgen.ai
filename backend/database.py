"""
Database configuration and connection management for MongoDB.
"""
from pymongo import MongoClient
from pymongo.database import Database
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    """MongoDB connection manager."""
    
    client: Optional[MongoClient] = None
    db: Optional[Database] = None
    
    @classmethod
    def connect(cls):
        """Establish connection to MongoDB."""
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        db_name = os.getenv("MONGODB_DB_NAME", "sowgen_db")
        
        cls.client = MongoClient(mongodb_url)
        cls.db = cls.client[db_name]
        print(f"✅ Connected to MongoDB: {db_name}")
        
        # Create indexes
        cls._create_indexes()
        
    @classmethod
    def _create_indexes(cls):
        """Create necessary indexes for optimal query performance."""
        if cls.db is None:
            return
            
        # Users collection indexes
        cls.db.users.create_index("email", unique=True)
        cls.db.users.create_index("id", unique=True)
        
        # SOWs collection indexes
        cls.db.sows.create_index("id", unique=True)
        cls.db.sows.create_index("clientId")
        cls.db.sows.create_index("status")
        cls.db.sows.create_index("createdAt")
        
        print("✅ Database indexes created")
        
    @classmethod
    def close(cls):
        """Close MongoDB connection."""
        if cls.client:
            cls.client.close()
            print("✅ MongoDB connection closed")
            
    @classmethod
    def get_db(cls) -> Database:
        """Get database instance."""
        if cls.db is None:
            cls.connect()
        return cls.db

# Singleton instance
mongodb = MongoDB()
