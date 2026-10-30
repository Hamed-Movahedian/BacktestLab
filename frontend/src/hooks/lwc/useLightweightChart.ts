import { useLwcSetup } from "./useLwcSetup";
import { useLwcSetData } from "./useLwcSetData";
import { useLwcDrawCutoffTime } from "./useLwcDrawCutoffTime";
import { useLwcDrawPriceLines } from "./useLwcDrawPriceLines";
import { FetchCandleResponse } from "@/service/candleDataApi";
import { getOrCreateChartStore } from "@/store/chartStoreFactory";

export const useLightweightChart = (
  chartContainerRef: React.RefObject<HTMLDivElement | null>,
  idx: number,
  data?: FetchCandleResponse,
) => {
  const useChartStore = getOrCreateChartStore(idx);

  const cutoffTime = useChartStore((s) => s.cutoffTime);

  const { chartRef, candleSeriesRef } = useLwcSetup(chartContainerRef);

  useLwcSetData(chartRef, candleSeriesRef, cutoffTime, data?.candles);

  useLwcDrawPriceLines(candleSeriesRef, data?.avg_price, data?.last_price);

  useLwcDrawCutoffTime(candleSeriesRef, cutoffTime);
  
};
