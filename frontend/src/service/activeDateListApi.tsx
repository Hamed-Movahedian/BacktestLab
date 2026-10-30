import { API_CONFIG } from "../config";

export async function fetchActiveDates(symbol: string): Promise<string[]> {
  const queryParams = new URLSearchParams({ symbol });
  const endpoint = `${API_CONFIG.baseUrl}/api/candles/get_active_dayes?${queryParams.toString()}`;

  const response = await fetch(endpoint, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`خطا در دریافت نمادها: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
