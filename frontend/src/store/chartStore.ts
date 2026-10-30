import { StateCreator } from "zustand";

export interface ChartState {
  symbol?: string;
  date?: string;
  timeframe: number;
  cutoffTime?: number;
  minTime?: number;
  maxTime?: number;

  setTimeframe: (timeframe: number) => void;
  setSymbol: (symbol?: string) => void;
  setDate: (date?: string) => void;
  setCutoffTime: (cutoffTime?: number) => void;
  setMaxTime: (maxTime?: number) => void;
  setMinTime: (minTime?: number) => void;
}

export const createChartStore: StateCreator<ChartState, [], []> = (set) => ({
  timeframe: 1,
  setTimeframe: (timeframe) => set({ timeframe }),
  setSymbol: (symbol) => set({ symbol }),
  setDate: (date) => set({ date }),
  setCutoffTime: (cutoffTime) => set({cutoffTime}),
  setMaxTime: (maxTime) => set({maxTime}),
  setMinTime: (minTime) => set({minTime}),
});
