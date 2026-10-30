import { IPriceLine, ISeriesApi, Time } from "lightweight-charts";
import { RefObject } from "react";



export function setPriceLine(
  priceLine: RefObject<IPriceLine | null>,
  candleSeriesRef: React.RefObject<ISeriesApi<"Candlestick", Time> | null>,
  color: string,
  title: string,
  price?: number,
) {
  if (!candleSeriesRef.current || !price)
    return;
  if (!priceLine.current)
    priceLine.current = candleSeriesRef.current.createPriceLine({
      price: price, // قیمتی که خط روی آن رسم می‌شود
      color: color, // رنگ خط
      lineWidth: 2, // ضخامت خط (پیش‌فرض: 1)
      lineStyle: 2, // استایل خط: 0=Solid, 1=Dotted, 2=Dashed, 3=LargeDashed
      axisLabelVisible: true, // نمایش برچسب قیمت روی محور عمودی
      title: title, // متنی که روی خط یا کنار قیمت نوشته می‌شود
    });
  else priceLine.current.applyOptions({ price: price });
}
