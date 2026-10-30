from fastapi import APIRouter

from app.backtest.backtest import back_test

router = APIRouter(
    prefix="/api/backtest",
    tags=["backtest"],
)


@router.post(
    "/get_back_test",
    # response_model=CandleInitResponse,
)
async def get_back_test():
    return back_test()
