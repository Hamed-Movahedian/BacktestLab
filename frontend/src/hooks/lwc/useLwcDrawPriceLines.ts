import { ISeriesApi, Time, IPriceLine } from "lightweight-charts";
import { useRef, useEffect } from "react";
import { setPriceLine } from "./utils/setPriceLine";

export const useLwcDrawPriceLines = (
  candleSeriesRef: React.RefObject<ISeriesApi<"Candlestick", Time> | null>,
  avg_price?: number,
  last_price?: number,
) => {
  const avgPriceLine = useRef<IPriceLine | null>(null);
  const lastPriceLine = useRef<IPriceLine | null>(null);

  useEffect(() => {
    setPriceLine(avgPriceLine, candleSeriesRef, "#ff9800", "میانگین قیمت روز قبل", avg_price);
    setPriceLine(lastPriceLine, candleSeriesRef, "#ff6200", "آخرین قیمت روز قبل", last_price);
  }, [candleSeriesRef, avg_price]);
};
