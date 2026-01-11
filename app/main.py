from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .core.logging import setup_logging
from .db.mongodb import connect_to_mongodb, close_mongodb_connection
from .routers.sows import router as sows_router

setup_logging()

app = FastAPI(title="SOWgen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sows_router)


@app.on_event("startup")
async def startup() -> None:
    await connect_to_mongodb()


@app.on_event("shutdown")
async def shutdown() -> None:
    await close_mongodb_connection()


@app.get("/health")
async def health():
    return {"ok": True}