import { getOrCreateChartStore } from "@/store/chartStoreFactory";
import { useDashboardStore } from "@/store/dashbordStore";
import { useMemo } from "react";

export const useSelectedChartStore =()=>{
  const selectedChartIndex = useDashboardStore((s) => s.selectedChartIndex);
  const useChartStore = useMemo(() => getOrCreateChartStore(selectedChartIndex), [selectedChartIndex]);

  return {useChartStore};
};