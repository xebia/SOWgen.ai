import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from ..core.config import settings

logger = logging.getLogger(__name__)

_client: AsyncIOMotorClient | None = None
_db: AsyncIOMotorDatabase | None = None


async def connect_to_mongodb() -> None:
    global _client, _db
    logger.info("Connecting to MongoDB...")
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    _db = _client[settings.mongodb_db]
    await _db.command("ping")
    logger.info("Connected to MongoDB database=%s", settings.mongodb_db)


async def close_mongodb_connection() -> None:
    global _client, _db
    if _client:
        logger.info("Closing MongoDB connection...")
        _client.close()
    _client = None
    _db = None


def get_db() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("MongoDB not initialized")
    return _db


def sows_collection():
    return get_db()["sows"]