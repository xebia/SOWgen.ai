import logging
from fastapi import APIRouter, HTTPException, Query

from ..models.sow import SOWCreate, SOWOut, SOWUpdate
from ..repositories.sow_repo import SOWRepository

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/sows", tags=["sows"])
repo = SOWRepository()


@router.post("", response_model=SOWOut)
async def create_sow(payload: SOWCreate):
    try:
        return await repo.create(payload)
    except Exception as e:
        logger.exception("create_sow failed")
        raise HTTPException(status_code=500, detail="Failed to create SOW") from e


@router.get("", response_model=list[SOWOut])
async def list_sows(clientId: str | None = Query(default=None)):
    try:
        return await repo.list(clientId)
    except Exception as e:
        logger.exception("list_sows failed")
        raise HTTPException(status_code=500, detail="Failed to list SOWs") from e


@router.get("/{sow_id}", response_model=SOWOut)
async def get_sow(sow_id: str):
    sow = await repo.get(sow_id)
    if not sow:
        raise HTTPException(status_code=404, detail="SOW not found")
    return sow


@router.put("/{sow_id}", response_model=SOWOut)
async def update_sow(sow_id: str, patch: SOWUpdate):
    sow = await repo.update(sow_id, patch)
    if not sow:
        raise HTTPException(status_code=404, detail="SOW not found")
    return sow


@router.delete("/{sow_id}")
async def delete_sow(sow_id: str):
    ok = await repo.delete(sow_id)
    if not ok:
        raise HTTPException(status_code=404, detail="SOW not found")
    return {"deleted": True}