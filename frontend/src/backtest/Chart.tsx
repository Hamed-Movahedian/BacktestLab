import { useEffect, useRef } from 'react';
import { CandlestickSeries, ColorType, createChart, type IChartApi, type ISeriesApi, type Logical, type Time, type UTCTimestamp } from 'lightweight-charts';
import type { Candle, Trade } from './types';
import { drawTrades } from './tradeOverlay';
import { formatTime } from './format';
interface Props { candles: Candle[]; trades: Trade[]; selected: number | null; hasResult: boolean }
export function Chart({ candles, trades, selected, hasResult }: Props) {
  const container = useRef<HTMLDivElement>(null), overlay = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<IChartApi | null>(null), seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const data = useRef({ candles, trades, selected });
  useEffect(() => { data.current = { candles, trades, selected }; }, [candles, trades, selected]);
  useEffect(() => {
    const el = container.current, canvas = overlay.current; if (!el || !canvas) return;
    const chart = createChart(el, { autoSize: true, layout: { background: { type: ColorType.Solid, color: '#101722' }, textColor: '#77889d', fontFamily: 'Tahoma, sans-serif' }, grid: { vertLines: { color: '#1a2634' }, horzLines: { color: '#1a2634' } }, rightPriceScale: { borderColor: '#263442' }, timeScale: { borderColor: '#263442', timeVisible: true, secondsVisible: false, tickMarkFormatter: (time: Time) => formatTime(time) }, localization: { locale: 'fa-IR', timeFormatter: formatTime, priceFormatter: (price: number) => Math.round(price).toLocaleString('fa-IR') }, crosshair: { vertLine: { color: '#607387' }, horzLine: { color: '#607387' } } });
    const series = chart.addSeries(CandlestickSeries, { upColor: '#2cc69a', downColor: '#ed6676', borderVisible: false, wickUpColor: '#2cc69a', wickDownColor: '#ed6676', priceFormat: { type: 'price', precision: 0, minMove: 1 } });
    chartRef.current = chart; seriesRef.current = series;
    let frame = 0; const draw = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => drawTrades(canvas, chart, series, data.current.candles, data.current.trades, data.current.selected)); };
    chart.timeScale().subscribeVisibleLogicalRangeChange(draw); chart.subscribeCrosshairMove(draw);
    const observer = new ResizeObserver(draw); observer.observe(el);
    el.addEventListener('pointermove', draw); el.addEventListener('wheel', draw); el.addEventListener('pointerup', draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); el.removeEventListener('pointermove', draw); el.removeEventListener('wheel', draw); el.removeEventListener('pointerup', draw); chart.remove(); chartRef.current = null; seriesRef.current = null; };
  }, []);
  useEffect(() => {
    const chart = chartRef.current, series = seriesRef.current, canvas = overlay.current; if (!chart || !series || !canvas) return;
    const sorted = [...candles].sort((a, b) => a.time - b.time).filter((c, i, arr) => i === 0 || c.time !== arr[i - 1].time);
    data.current = { candles: sorted, trades, selected };
    series.setData(sorted.map((c) => ({ ...c, time: c.time as UTCTimestamp })));
    const trade = selected === null ? null : trades[selected];
    if (trade && sorted.length) {
      const closest = (time: number) => { let i = sorted.findIndex((c) => c.time >= time); if (i < 0) i = sorted.length - 1; return i; };
      const a = closest(trade.entry_time), b = closest(trade.exit_time), padding = Math.max(8, Math.ceil(Math.abs(b - a) * .3));
      chart.timeScale().setVisibleLogicalRange({ from: (Math.min(a, b) - padding) as Logical, to: (Math.max(a, b) + padding) as Logical });
    } else chart.timeScale().fitContent();
    requestAnimationFrame(() => drawTrades(canvas, chart, series, sorted, trades, selected));
  }, [candles, trades, selected]);
  return <section className="panel chart-panel"><div className="panel-header chart-header"><div><div className="panel-kicker">PRICE ACTION</div><h2>نمودار قیمت <span className="chart-subtitle">/ نمای معاملات</span></h2></div><div className="chart-legend"><span><i className="legend-up" /> سودده</span><span><i className="legend-down" /> زیان‌ده</span><span className="chart-chip">CANDLESTICK</span></div></div>
    <div className="chart-wrap"><div className="chart-canvas" ref={container} /><canvas className="trade-overlay" ref={overlay} />{!candles.length && <div className="chart-empty"><div className="empty-icon">⌁</div><strong>{hasResult ? 'داده‌ای برای نمایش وجود ندارد' : 'نمودار آماده تحلیل است'}</strong><span>{hasResult ? 'فایل و بازه انتخابی را بررسی کنید.' : 'فایل داده را انتخاب و بک‌تست را اجرا کنید.'}</span></div>}</div>
    <div className="chart-footer"><span><i className="status-dot" /> نمودار تعاملی</span><span>زمان تهران <span className="footer-separator">/</span> تقویم شمسی</span></div></section>;
}
