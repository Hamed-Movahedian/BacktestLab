import type { BacktestRequest, BacktestResponse } from './types';

const base = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
async function read(response: Response): Promise<unknown> {
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const detail = typeof body === 'object' && body !== null && 'detail' in body ? body.detail : null;
    throw new Error(typeof detail === 'string' ? detail : `خطای سرویس (${response.status}). ورودی‌ها و وضعیت سرویس را بررسی کنید.`);
  }
  return response.json() as Promise<unknown>;
}
function object(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
function numericFields(value: unknown, fields: string[]): value is Record<string, number> { return object(value) && fields.every((key) => typeof value[key] === 'number' && Number.isFinite(value[key])); }
export async function getCsvFiles(signal: AbortSignal): Promise<string[]> {
  const data = await read(await fetch(`${base}/api/data/csv-files`, { signal }));
  if (!object(data) || !Array.isArray(data.csv_files) || !data.csv_files.every((v: unknown) => typeof v === 'string')) throw new Error('پاسخ فهرست فایل‌ها معتبر نیست.');
  return data.csv_files as string[];
}
export async function runBacktest(request: BacktestRequest): Promise<BacktestResponse> {
  const data = await read(await fetch(`${base}/api/backtest/get_back_test`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) }));
  if (!object(data) || !Array.isArray(data.candles) || !Array.isArray(data.trades) ||
    !data.candles.every((v: unknown) => numericFields(v, ['time', 'open', 'high', 'low', 'close'])) ||
    !data.trades.every((v: unknown) => numericFields(v, ['entry_time', 'exit_time', 'entry_price', 'exit_price', 'pnl_pct']) && typeof v.is_long === 'boolean')) throw new Error('پاسخ بک‌تست ساختار معتبری ندارد.');
  const result = data as unknown as BacktestResponse;
  // The current backend emits candle timestamps in milliseconds and trade timestamps in seconds.
  return { ...result, candles: result.candles.map((candle) => ({ ...candle, time: candle.time > 1e11 ? candle.time / 1000 : candle.time })) };
}
