import { useQuery } from "@tanstack/react-query";
import { fetchCandleData } from "../service/candleDataApi";
import { getOrCreateChartStore } from "@/store/chartStoreFactory";

export function useStockCandles(idx: number) {
  const useChartStore = getOrCreateChartStore(idx);

  const symbol = useChartStore((s) => s.symbol);
  const activeDate = useChartStore((s) => s.date);
  const timeframe = useChartStore((s) => s.timeframe);
  const setMaxTime = useChartStore((s) => s.setMaxTime);
  const setMinTime = useChartStore((s) => s.setMinTime);
  const { data, isLoading, error } = useQuery({
    // هر زمان نماد یا تایم‌فریم عوض شود، دیتای جدید کوئری می‌شود
    queryKey: ["candles", symbol, activeDate, timeframe],
    queryFn: () => fetchCandleData(symbol!, activeDate!, timeframe),
    enabled: Boolean(symbol && activeDate),
    staleTime: 60_000_000, // تا 60 ثانیه دیتا تازه در نظر گرفته می‌شود و کش معتبر است
  });
  // const minCutoffTime = Math.min(...(candles?.map((c) => +c.time) ?? []));
  // const maxCutoffTime = Math.max(...(candles?.map((c) => Number(c.time)) ?? []));
  const candles=data?.candles;

  if(candles){
    setMaxTime(Math.max(...(candles?.map((c) => Number(c.time)) ?? [])));
    setMinTime(Math.min(...(candles?.map((c) => +c.time) ?? [])));
  }

  return { data, isLoading, error };
}
