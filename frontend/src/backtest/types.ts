export interface Candle { time: number; open: number; high: number; low: number; close: number }
export interface Trade { is_long: boolean; entry_time: number; exit_time: number; entry_price: number; exit_price: number; pnl_pct: number }
export interface BacktestResponse { candles: Candle[]; trades: Trade[] }
export interface BacktestRequest { csv_filename: string; candle_count?: number }
