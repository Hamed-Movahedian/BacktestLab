import type { CandlestickData } from "lightweight-charts";

interface Candle{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface PreviousDay{
    candles: Candle[];
    avg_price: number;
    last_price: number;
}

interface GetDailyTradeResponse{
    candles: Candle[];
    prevous_day: PreviousDay;
}

export interface FetchCandleResponse {
    candles: CandlestickData[];
    avg_price?: number ;
    last_price?: number ;

}
// داده‌های مثال (در واقعیت این‌ها را از بک‌اند FastAPI می‌گیرید)
export async function fetchCandleData(symbol: string, date: string, timeframe: number): Promise<FetchCandleResponse> {
  const params = new URLSearchParams({
    symbol,
    date,
    timeframe: timeframe.toString(),
  });
  const res = await fetch(`http://127.0.0.1:8000/api/candles/get_daily_trades?${params}`);
  const data : GetDailyTradeResponse = await res.json();

  // تبدیل API trades به CandlestickData[]
  return {
    candles: data.candles.map((candle: any) => ({
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    })),
    last_price:data.prevous_day.last_price,
    avg_price: data.prevous_day.avg_price
  };
}
