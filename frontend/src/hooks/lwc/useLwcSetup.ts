import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, ISeriesApi, Time, IChartApi } from "lightweight-charts";
import { chartOptions, candlestickStyleOptions } from "../../tradingView/chartOptions";

export const useLwcSetup = (
  chartContainerRef: React.RefObject<HTMLDivElement | null>
) => {
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick", Time> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartOptions.width = chartContainerRef.current.clientWidth;
    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, candlestickStyleOptions);
    candleSeriesRef.current = candleSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, []);
  return { chartRef, candleSeriesRef}
};
