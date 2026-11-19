import type { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import type { Candle, Trade } from './types';
import { duration } from './format';

export function drawTrades(canvas: HTMLCanvasElement, chart: IChartApi, series: ISeriesApi<'Candlestick'>, candles: Candle[], trades: Trade[], selected: number | null) {
  const width = canvas.clientWidth, height = canvas.clientHeight, ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  const context = canvas.getContext('2d'); if (!context) return;
  const ctx: CanvasRenderingContext2D = context;
  ctx.scale(ratio, ratio); ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  function xAt(time: number): number | null {
    const exact = chart.timeScale().timeToCoordinate(time as UTCTimestamp); if (exact !== null) return exact;
    if (candles.length < 2) return null;
    let low = 0, high = candles.length - 1;
    while (low < high) { const mid = Math.floor((low + high) / 2); if (candles[mid].time < time) low = mid + 1; else high = mid; }
    const i = Math.max(1, Math.min(low, candles.length - 1));
    const a = candles[i - 1], b = candles[i];
    const x1 = chart.timeScale().logicalToCoordinate((i - 1) as import('lightweight-charts').Logical), x2 = chart.timeScale().logicalToCoordinate(i as import('lightweight-charts').Logical);
    return x1 === null || x2 === null || b.time === a.time ? null : x1 + (x2 - x1) * (time - a.time) / (b.time - a.time);
  }
  function text(label: string, x: number, y: number) { ctx.lineWidth = 3; ctx.strokeStyle = '#07111c'; ctx.strokeText(label, x, y); ctx.fillStyle = '#f4f8ff'; ctx.fillText(label, x, y); }
  trades.forEach((trade, index) => {
    const x1 = xAt(trade.entry_time), x2 = xAt(trade.exit_time), y1 = series.priceToCoordinate(trade.entry_price), y2 = series.priceToCoordinate(trade.exit_price);
    if (x1 === null || x2 === null || y1 === null || y2 === null) return;
    if (index === selected) {
      ctx.fillStyle = 'rgba(59, 130, 246, .16)'; ctx.strokeStyle = 'rgba(96, 165, 250, .7)'; ctx.lineWidth = 1;
      ctx.fillRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1)); ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
      text(duration(trade.exit_time - trade.entry_time), (x1 + x2) / 2, Math.max(10, Math.min(y1, y2) - 10));
      text(Math.abs(trade.exit_price - trade.entry_price).toLocaleString('fa-IR', { maximumFractionDigits: 0 }), Math.max(26, Math.min(x1, x2) - 35), (y1 + y2) / 2);
    }
    const angle = Math.atan2(y2 - y1, x2 - x1), size = 8;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.moveTo(x2 - size * Math.cos(angle - .5), y2 - size * Math.sin(angle - .5)); ctx.lineTo(x2, y2); ctx.lineTo(x2 - size * Math.cos(angle + .5), y2 - size * Math.sin(angle + .5));
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = '#05080d'; ctx.lineWidth = 6; ctx.stroke(); ctx.strokeStyle = trade.pnl_pct >= 0 ? '#35d4a1' : '#ff677a'; ctx.lineWidth = 2; ctx.stroke();
    if (index === selected) text(`${trade.pnl_pct > 0 ? '+' : ''}${trade.pnl_pct.toFixed(2)}%`, (x1 + x2) / 2, (y1 + y2) / 2 - 10);
  });
}
