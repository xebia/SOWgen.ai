from typing import List, Optional

from bson import ObjectId
from pymongo import ReturnDocument

from ..db.mongodb import sows_collection
from ..models.sow import SOWCreate, SOWOut, SOWUpdate, now_ms


def _serialize(doc) -> SOWOut:
    return SOWOut(
        id=str(doc["_id"]),
        projectName=doc["projectName"],
        projectDescription=doc.get("projectDescription"),
        clientId=doc["clientId"],
        clientName=doc.get("clientName"),
        status=doc.get("status", "draft"),
        data=doc.get("data", {}),
        createdAt=doc.get("createdAt", 0),
        updatedAt=doc.get("updatedAt", 0),
    )


class SOWRepository:
    async def create(self, payload: SOWCreate) -> SOWOut:
        doc = payload.model_dump()
        t = now_ms()
        doc["createdAt"] = t
        doc["updatedAt"] = t
        result = await sows_collection().insert_one(doc)
        created = await sows_collection().find_one({"_id": result.inserted_id})
        return _serialize(created)

    async def list(self, client_id: Optional[str] = None) -> List[SOWOut]:
        query = {}
        if client_id:
            query["clientId"] = client_id
        cursor = sows_collection().find(query).sort("updatedAt", -1)
        docs = await cursor.to_list(length=200)
        return [_serialize(d) for d in docs]

    async def get(self, sow_id: str) -> Optional[SOWOut]:
        try:
            _id = ObjectId(sow_id)
        except Exception:
            return None
        doc = await sows_collection().find_one({"_id": _id})
        return _serialize(doc) if doc else None

    async def update(self, sow_id: str, patch: SOWUpdate) -> Optional[SOWOut]:
        try:
            _id = ObjectId(sow_id)
        except Exception:
            return None

        update_doc = {k: v for k, v in patch.model_dump().items() if v is not None}
        if not update_doc:
            return await self.get(sow_id)

        update_doc["updatedAt"] = now_ms()

        doc = await sows_collection().find_one_and_update(
            {"_id": _id},
            {"$set": update_doc},
            return_document=ReturnDocument.AFTER,
        )
        return _serialize(doc) if doc else None

    async def delete(self, sow_id: str) -> bool:
        try:
            _id = ObjectId(sow_id)
        except Exception:
            return False
        result = await sows_collection().delete_one({"_id": _id})
        return result.deleted_count == 1