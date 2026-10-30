import { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  CandlestickSeries,
  ISeriesMarkersPluginApi,
  createSeriesMarkers,
  LineSeries,
} from "lightweight-charts";
import axios from "axios";
import { TradeData } from "../types/backtest";
import { buildTradeMarkers } from "../utils/chartHelpers";

export function useBacktestData(containerRef: React.RefObject<HTMLDivElement | null>, apiUrl?: string) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trades, setTrades] = useState<TradeData[]>([]);

  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const markersPluginRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const tradeLineSeriesRef = useRef<ISeriesApi<"Line">[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // ۱. ساخت نمودار
    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "#131722" },
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#2B2B43" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#2B2B43",
      },
    });

    chartRef.current = chart;

    // (after adding series...)
    setTimeout(() => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 500,
        });
      }
    }, 0);

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a6995f",
      downColor: "#ef53505f",
      borderVisible: false,
      wickUpColor: "#26a6995f",
      wickDownColor: "#ef53505f",
    });
    candleSeriesRef.current = candleSeries;
    markersPluginRef.current = createSeriesMarkers(candleSeries, []);

    //۲. دریافت داده‌ها از بک‌اند
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = apiUrl || "http://localhost:8000/api/backtest";
        const response = await axios.post(endpoint);
        const data = response.data;

        if (data.candles && Array.isArray(data.candles)) {
          const formattedCandles: CandlestickData<Time>[] = data.candles.map((c: any) => ({
            time: Math.floor(new Date(c.time).getTime() / 1000) as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }));
          formattedCandles.sort((a, b) => (a.time as number) - (b.time as number));
          candleSeries.setData(formattedCandles);
        }

        if (data.trades && Array.isArray(data.trades)) {
          setTrades(data.trades);
          const markers = buildTradeMarkers(data.trades);
          markersPluginRef.current?.setMarkers(markers);
          // رسم خطوط سود/زیان معاملات
          const newLines: ISeriesApi<"Line">[] = [];
          data.trades.forEach((t: TradeData) => {
            const lineSeries = chart.addSeries(LineSeries, {
              color: t.pnl_pct >= 0 ? "#26a69a" : "#ef5350",
              lineWidth: 2,
            });
            lineSeries.setData([
              { time: Math.floor(new Date(t.entry_time).getTime() / 1000) as Time, value: t.entry_price },
              { time: Math.floor(new Date(t.exit_time).getTime() / 1000) as Time, value: t.exit_price },
            ]);
            newLines.push(lineSeries);
          });
          tradeLineSeriesRef.current = newLines;
        }

        chart.timeScale().fitContent();
      } catch (err: any) {
        console.error("Failed to load backtest data:", err);
        setError(err.message || "خطا در بارگذاری اطلاعات بک‌تست");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    //۳. مدیریت ریسایز پنجره
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 500,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [apiUrl, containerRef.current]);

  return { loading, error, trades };
}
