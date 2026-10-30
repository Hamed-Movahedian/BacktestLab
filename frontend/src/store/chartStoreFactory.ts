import { create, StoreApi, UseBoundStore } from "zustand";
import { ChartState, createChartStore } from "./chartStore";

type ChartStore = UseBoundStore<StoreApi<ChartState>>;

// مخزن نگه‌داری نمونه‌های ساخته شده
const chartStoreRegistry = new Map<number, ChartStore>();

export const getOrCreateChartStore = (chartId: number): ChartStore => {
  if (!chartStoreRegistry.has(chartId)) {
    const newStore = create<ChartState>(createChartStore);

    chartStoreRegistry.set(chartId, newStore);
  }

  return chartStoreRegistry.get(chartId)!;
};

// تابع کمکی برای پاک‌سازی حافظه هنگام بستن چارت/کامپوننت
export const removeChartStore = (chartId: number) => {
  chartStoreRegistry.delete(chartId);
};

export const setForAllCharts = (state:Partial<ChartState>,exclude: number[] =[]) => {
  chartStoreRegistry.forEach((store, id) => {
    if(exclude.includes(id)) 
      return;
    store.setState(state);
  });
}