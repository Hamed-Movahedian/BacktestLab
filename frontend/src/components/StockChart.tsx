import React, { useRef } from "react";
import { useLightweightChart } from "../hooks/lwc/useLightweightChart";
import { useStockCandles } from "@/hooks/useStockCandles";
import { ChartTitle } from "./ChartTitle";
import { useDashboardStore } from "@/store/dashbordStore";

export const StockChart: React.FC<{ idx: number }> = ({ idx }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useStockCandles(idx);

  useLightweightChart(chartContainerRef,idx, data);

  const selectedChart = useDashboardStore((s) => s.selectedChartIndex);
  const setSelectedChart = useDashboardStore((s) => s.setSelectedChartIndex);

  const isSelected = idx === selectedChart;

  return (
    <div
      style={{
        width: "100%",
        border: isSelected ? "2px solid #1976d2" : "2px solid transparent",
        borderRadius: 0,
      }}
      onClick={() => setSelectedChart(idx)}
    >
      <ChartTitle idx={idx} color= {isSelected ? "#cfd219" : "#929191"}/>
      <div ref={chartContainerRef} style={{ width: "100%" }}>
        {isLoading && <div style={{ color: "#90caf9" }}>در حال بارگذاری کندل‌های ...</div>}
        {error && <div style={{ color: "#ef5350" }}>خطا در دریافت داده‌ها: {(error as Error).message}</div>}
      </div>
    </div>
  );
};
