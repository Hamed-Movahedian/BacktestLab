# تعریف پروژه: 
میخواهیم یک صفحه وب با استفاده از react پیاده سازی کنیم که اطلاعات را از یک وب سرویس دریافت کرده و در صفحه وب نمایش دهد.

# مشخصات وب سرویس:
- این وب سرویس به صورت است:
```bash
curl -X 'POST' \
  'http://127.0.0.1:8000/api/backtest/get_back_test' \
  -H 'accept: */*' \
  -d ''
```
- فعلا هیچ ورودی ندارد ولی در آینده ورودی ها هم تعریف می شوند.
- خروجی این وب سرویس به صورت است
```
/**
 * ساختار هر کندل برای نمایش در چارت (Lightweight Charts)
 */
export interface CandleData {
  time: number;  // Unix timestamp (بر حسب میلی‌ثانیه)
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * ساختار هر معامله انجام‌شده در طول بک‌تست
 */
export interface TradeData {
  is_long: boolean;
  entry_time: number;  // Unix timestamp (بر حسب ثانیه)
  exit_time: number;   // Unix timestamp (بر حسب ثانیه)
  entry_price: number;
  exit_price: number;
  pnl_pct: number;     // درصد سود/زیان
}

/**
 * ساختار کلی پاسخ خروجی وب سرویس 
 */
export interface BacktestResult {
  candles: CandleData[];
  trades: TradeData[];
}

```
# مشخصات صفحه وب
