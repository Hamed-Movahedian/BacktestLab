import { create } from "zustand";


export interface DashboardState {
    selectedChartIndex: number;
    syncDateTime:boolean;

    setSelectedChartIndex: (selectedChartIndex: number) => void;
    setSyncDateTime: (syncDateTime:boolean) => void;

}

export const useDashboardStore = create<DashboardState>((set) => ({
    selectedChartIndex: 0,
    syncDateTime:false,
    setSelectedChartIndex:(selectedChartIndex) => set({ selectedChartIndex}),
    setSyncDateTime:(syncDateTime) => set({ syncDateTime}),
}));
