import React, { useRef } from 'react';
import { BacktestChartProps } from '../types/backtest';
import { useBacktestData } from '../hooks/useBacktestData';
import { TradeTable } from './TradeTable';

export const BacktestChart: React.FC<BacktestChartProps> = ({ apiUrl = 'http://127.0.0.1:8000/api/candles/get_back_test' }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const { loading, error, trades } = useBacktestData(chartContainerRef, apiUrl);

  return (
    <div className="w-full flex flex-col bg-[#131722] p-4 rounded-xl border border-[#2B2B43] shadow-xl">
      {/* هدر و وضعیت لودینگ */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-white text-base font-bold tracking-wide">نتایج نمودار بک‌تست</h2>
        {loading && <span className="text-xs text-yellow-400 animate-pulse">در حال بارگذاری داده‌ها...</span>}
        {error && <span className="text-xs text-rose-400">{error}</span>}
      </div>

      {/* محفظه نمایش نمودار */}
      <div
        ref={chartContainerRef} 
        className="w-full h-[500px] rounded-lg overflow-hidden border border-[#2B2B43]"
      />

      {/* جدول جزئیات معاملات */}
      <TradeTable trades={trades} />
    </div>
  );
};

export default BacktestChart;
