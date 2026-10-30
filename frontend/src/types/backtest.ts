import { UTCTimestamp } from 'lightweight-charts';

export interface CandleData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TradeData {
  is_long: boolean;
  entry_time: UTCTimestamp;
  exit_time: UTCTimestamp;
  entry_price: number;
  exit_price: number;
  pnl_pct: number;
}

export interface BacktestResponse {
  candles: CandleData[];
  trades: TradeData[];
}

export interface BacktestChartProps {
  apiUrl?: string;
}