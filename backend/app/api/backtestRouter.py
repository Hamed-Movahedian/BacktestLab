from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.backtest.backtest import back_test

router = APIRouter(
    prefix="/api/backtest",
    tags=["backtest"],
)


# Request model for backtest parameters
class BacktestRequest(BaseModel):
    csv_filename: str = "geramTalaHejdah-60minute.csv"
    candle_count: int = Field(0, ge=100)


# --- Response Models ---
class Candle(BaseModel):
    time: int
    open: float
    high: float
    low: float
    close: float


class Trade(BaseModel):
    is_long: bool
    entry_time: float
    exit_time: float
    entry_price: float
    exit_price: float
    pnl_pct: float


class BacktestResponse(BaseModel):
    candles: list[Candle]
    trades: list[Trade]


@router.post("/get_back_test", response_model=BacktestResponse)
async def get_back_test(params: BacktestRequest):
    return back_test(csv_filename=params.csv_filename, candle_count=params.candle_count)

