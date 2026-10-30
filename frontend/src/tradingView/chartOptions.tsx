import { DeepPartial, TimeChartOptions, CandlestickStyleOptions, SeriesOptionsCommon } from "lightweight-charts";
import { tickMarkFormatter } from "./tickMarkFormatter";
import { timeFormatter } from "./timeFormatter";
// تعریف تابع فرمت‌کننده
const customPriceFormatter = (price: number): string => {
  const formattedPrice = (price / 1000).toFixed(1); // تقسیم بر 1000 و نمایش تا 1 رقم اعشار
  return `${formattedPrice}K`;
};

export const chartOptions: DeepPartial<TimeChartOptions> = {
  localization: {
    locale: "fa-IR",
    timeFormatter: timeFormatter,
  },
  layout: {
    background: { color: "#222" },
    textColor: "#DDD",
  },
  grid: {
    vertLines: { color: "#444" },
    horzLines: { color: "#444" },
  },
  timeScale: {
    timeVisible: true, // نمایش ساعت و دقیقه در تایم‌فریم‌های درون‌روزی
    secondsVisible: false,
    borderColor: "#2B2B43",
    tickMarkFormatter: tickMarkFormatter,
  },
  width: 100,
  height: 400,
};
export const candlestickStyleOptions: DeepPartial<CandlestickStyleOptions & SeriesOptionsCommon> = {
  upColor: "#26a69a", // رنگ صعودی
  downColor: "#ef5350", // رنگ نزولی
  borderVisible: false,
  wickUpColor: "#26a69a",
  wickDownColor: "#ef5350",
  priceFormat: {
    type: 'custom',
    formatter: customPriceFormatter,
    minMove: 1, // حداقل گام تغییرات (در صورت نیاز)
  },
  
};

