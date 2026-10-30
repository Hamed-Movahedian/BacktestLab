import React from 'react';
import { TradeData } from '../types/backtest';

interface TradeTableProps {
  trades: TradeData[];
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades: tradeSummary }) => {
  if (!tradeSummary || tradeSummary.length === 0) return null;

  return (
    <div style={{ marginTop: "20px", color: "#e5e7eb" }}>
          <h3 style={{ marginBottom: "10px" }}>لیست معاملات اجرا شده ({tradeSummary.length} معامله)</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#1e222d", color: "#9ca3af" }}>
                  <th style={{ padding: "8px", border: "1px solid #374151" }}>#</th>
                  <th style={{ padding: "8px", border: "1px solid #374151" }}>نوع پوزیشن</th>
                  <th style={{ padding: "8px", border: "1px solid #374151" }}>قیمت ورود</th>
                  <th style={{ padding: "8px", border: "1px solid #374151" }}>قیمت خروج</th>
                  <th style={{ padding: "8px", border: "1px solid #374151" }}>درصد سود/ضرر</th>
                </tr>
              </thead>
              <tbody>
                {tradeSummary.map((t, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#131722" : "#181c27" }}>
                    <td style={{ padding: "8px", border: "1px solid #374151" }}>{i + 1}</td>
                    <td
                      style={{
                        padding: "8px",
                        border: "1px solid #374151",
                        color: t.is_long ? "#26a69a" : "#ef5350",
                        fontWeight: "bold",
                      }}
                    >
                      {t.is_long ? "LONG" : "SHORT"}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #374151" }}>{t.entry_price.toLocaleString()}</td>
                    <td style={{ padding: "8px", border: "1px solid #374151" }}>{t.exit_price.toLocaleString()}</td>
                    <td
                      style={{
                        padding: "8px",
                        border: "1px solid #374151",
                        direction: "ltr",
                        color: t.pnl_pct >= 0 ? "#22c55e" : "#f43f5e",
                        fontWeight: "bold",
                      }}
                    >
                      {t.pnl_pct > 0 ? `+${t.pnl_pct.toFixed(2)}%` : `${t.pnl_pct.toFixed(2)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  );
};
