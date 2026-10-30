import { VertLine } from "@/tradingView/VertLine";
import { ISeriesApi, Time } from "lightweight-charts";
import { useEffect } from "react";


export const useLwcDrawCutoffTime = (
  candleSeriesRef: React.RefObject<ISeriesApi<"Candlestick", Time> | null>,
  cutoffTime?: number
) => {
  useEffect(() => {
    if (!candleSeriesRef.current || !cutoffTime) return;

    const vertLine = new VertLine({
      time: cutoffTime as Time,
      color: "#3b82f6", // آبی
      lineWidth: 2,
      lineStyle: [4, 4], // نقطه‌چین
    });

    // متصل کردن خط به سری اصلی
    candleSeriesRef.current.attachPrimitive(vertLine);

    // تمیزکاری هنگام تغییر زمان یا Unmount شدن کامپوننت
    return () => {
      candleSeriesRef.current?.detachPrimitive(vertLine);
    };
  }, [candleSeriesRef, cutoffTime]);

};
