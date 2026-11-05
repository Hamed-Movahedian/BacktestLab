from pathlib import Path

import pandas as pd
from backtesting import Backtest

from app.strategy.MacdCrossStrategy import MacdStrategy as strategy
from app.utils.csv_loader import load_csv_to_df


def back_test(csv_filename: str, candle_count: int = 0):
    """
    Run backtest for the given CSV filename (relative to app/data) and limit to last `candle_count` records.

    Args:
        csv_filename (str): Name of the CSV file inside 'app/data' (e.g., 'geramTalaHejdah-60minute.csv')
        candle_count (int): Number of most recent candles to use for backtest

    Returns:
        dict: A dictionary containing backtest candles and trades
    """
    # Ensure provided CSV path is used
    csv_path = Path(f"app/data/{csv_filename}")

    # Load required number of candles
    if candle_count > 0:
        df = load_csv_to_df(str(csv_path)).tail(candle_count)
    else:
        df = load_csv_to_df(str(csv_path))

    bt = Backtest(
        df,
        strategy,
        cash=100_000_000,  # initial cash
        commission=0.0024,  # 0.24% commission
        exclusive_orders=True,
    )

    stats = bt.run()
    print("\n========== Backtest Results ==========")
    print(stats)
    print("======================================\n")

    # Format data for lightweight-charts
    df_chart = df.reset_index()
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
    df_chart["time"] = (
        pd.to_datetime(df_chart["time"]).astype("int64") // 10**6
    )  # millisecond timestamp

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

