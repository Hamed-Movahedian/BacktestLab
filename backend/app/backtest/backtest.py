from pathlib import Path

import pandas as pd
from backtesting import Backtest

from app.strategy.MacdCrossStrategy import MacdStrategy as strategy
from app.utils.csv_loader import load_csv_to_df


def back_test():
    # ۱. مسیردهی مطمئن به فایل CSV (کنار فایل اسکریپت یا در پوشه جاری)
    csv_path = Path("app/data/geramTalaHejdah-60minute.csv")

    # ۲. بارگذاری داده‌ها با تابع اختصاصی شما
    df = load_csv_to_df(str(csv_path)).tail(100)

    # ۳. تنظیم و اجرای بک‌تست
    bt = Backtest(
        df,
        strategy,
        cash=100_000_000,  # سرمایه اولیه
        commission=0.0024,  # ۰.۲۴ درصد کارمزد
        exclusive_orders=True,
    )

    stats = bt.run()
    print("\n========== نتایج بک‌تست ==========")
    print(stats)
    print("===================================\n")

    # ۴. تبدیل دیتای OHLCV برای کتابخانه lightweight-charts
    df_chart = df.reset_index()
    # ستون ایندکس Datetime به time و اسامی ستون‌ها به حروف کوچک تبدیل می‌شوند
    df_chart.rename(
        columns={
            df_chart.columns[0]: "time",
            "Open": "open",
            "High": "high",
            "Low": "low",
            "Close": "close",
            "Volume": "volume",
        },
        inplace=True,
    )
    df_chart = df_chart[["time", "open", "high", "low", "close"]]

    df_chart["time"] = pd.to_datetime(df_chart["time"]).astype("int64") // 10**6 #millisecond timestamp
    
    trades = stats.get("_trades")
    if trades is not None and not trades.empty:
        df_trades = pd.DataFrame(
            [
                {
                    "is_long": trade["Size"] > 0,
                    "entry_time": pd.to_datetime(trade["EntryTime"]).timestamp(),
                    "exit_time": pd.to_datetime(trade["ExitTime"]).timestamp(),
                    "entry_price": trade["EntryPrice"],
                    "exit_price": trade["ExitPrice"],
                    "pnl_pct": trade["ReturnPct"] * 100,
                }
                for _, trade in trades.iterrows()
            ]
        )
    else:
        df_trades = pd.DataFrame()

    return {
        "candles": df_chart.to_dict(orient="records"),
        "trades": df_trades.to_dict(orient="records"),
    }
