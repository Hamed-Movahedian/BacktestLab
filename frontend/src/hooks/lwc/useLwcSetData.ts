import { CandlestickData, IChartApi, ISeriesApi, Time } from "lightweight-charts";
import { useEffect } from "react";

export const useLwcSetData = (
  chartRef: React.RefObject<IChartApi | null>,
  candleSeriesRef: React.RefObject<ISeriesApi<"Candlestick", Time> | null>,
  cutoffTime?: number,
  candles?: CandlestickData<Time>[] ,
) => {

  useEffect(() => {
    if (candles && candles.length > 1 && candleSeriesRef.current && chartRef.current) {
      const filterCandles = candles.filter((c) => +c.time <= (cutoffTime ?? 0));
      candleSeriesRef.current.setData(filterCandles);
      chartRef.current.timeScale().setVisibleLogicalRange({
        from: -2,
        to: filterCandles.length + 2,
      });
    }
  }, [candles, candleSeriesRef, chartRef, cutoffTime]);

  return;
};
