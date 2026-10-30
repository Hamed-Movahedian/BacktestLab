
// داده‌های مثال (در واقعیت این‌ها را از بک‌اند FastAPI می‌گیرید)
export async function fetchSymbolList(): Promise<string[]> {
  const response = await fetch(`http://127.0.0.1:8000/api/candles/get_symbols`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`خطا در دریافت نمادها: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
