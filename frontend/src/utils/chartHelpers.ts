import { SeriesMarker, Time } from "lightweight-charts";
import { TradeData } from "../types/backtest";

/**
 * تبدیل لیست معاملات به مارکرهای نمایش داده شده روی نمودار کندل‌استیک
 */
export function buildTradeMarkers(trades: TradeData[]): SeriesMarker<Time>[] {
  const markers: SeriesMarker<Time>[] = [];

  trades.forEach((trade, _index) => {
    const isProfitable = trade.pnl_pct >= 0;
    const entryTime = Math.floor(new Date(trade.entry_time).getTime() / 1000) as Time;
    const exitTime = Math.floor(new Date(trade.exit_time).getTime() / 1000) as Time;

    // مارکر ورود (Entry)
    markers.push({
      time: entryTime,
      position: trade.is_long ? "belowBar" : "aboveBar",
      color: isProfitable ? "#26a69a" : "#ef5350",
      shape: trade.is_long ? "arrowUp" : "arrowDown",
      //text: `${trade.is_long ? "BUY" : "SELL"} #${index + 1} @ ${trade.entry_price.toLocaleString()}`,
    });

    // مارکر خروج (Exit)
    markers.push({
      time: exitTime,
      position: trade.is_long ? "aboveBar" : "belowBar",
      color: isProfitable ? "#22c55e" : "#f43f5e",
      shape: "circle",
      text: `${trade.pnl_pct.toFixed(2)}%`,
    });
  });

  // مارکرها حتماً باید بر اساس time به صورت صعودی سورت شوند
  return markers.sort((a, b) => (a.time as number) - (b.time as number));
}
