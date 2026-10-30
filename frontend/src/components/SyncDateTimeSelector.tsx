import { useDashboardStore } from "@/store/dashbordStore";
import React from "react";
import { SyncToggle } from "./utils/SyncToggle";

const SyncDateTimeSelector: React.FC = () => {
    const syncDateTime = useDashboardStore(s=>s.syncDateTime);
    const setSyncDateTime = useDashboardStore(s=>s.setSyncDateTime);
  return (
    <SyncToggle isSynced={syncDateTime} onToggle={setSyncDateTime} />
  );
};

export default SyncDateTimeSelector;