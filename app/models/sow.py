from pydantic import BaseModel, Field
from typing import Any, Dict, Optional, Literal
from datetime import datetime

SOWStatus = Literal["draft", "pending", "approved", "rejected", "changes-requested"]


class SOWBase(BaseModel):
    projectName: str
    projectDescription: Optional[str] = None
    clientId: str
    clientName: Optional[str] = None
    status: SOWStatus = "draft"
    data: Dict[str, Any] = Field(default_factory=dict)


class SOWCreate(SOWBase):
    pass


class SOWUpdate(BaseModel):
    projectName: Optional[str] = None
    projectDescription: Optional[str] = None
    status: Optional[SOWStatus] = None
    data: Optional[Dict[str, Any]] = None
    clientName: Optional[str] = None


class SOWOut(SOWBase):
    id: str
    createdAt: int
    updatedAt: int


def now_ms() -> int:
    return int(datetime.utcnow().timestamp() * 1000)