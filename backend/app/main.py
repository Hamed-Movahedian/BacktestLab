from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.backtestRouter import router as backtest_router


@asynccontextmanager
async def lifespan(app: FastAPI):  # pyright: ignore[reportUnusedParameter]
    yield


app = FastAPI(
    title="Back Test Lab",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    # در محیط production بهتر است آدرس دقیق frontend قرار گیرد.
    allow_origins=[
        "http://localhost:3000",
        # "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(backtest_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
