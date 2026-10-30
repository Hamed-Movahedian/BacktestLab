// Convert Unix timestamp (seconds) to "hh:mm" (12-hour, FA, Tehran) without Persian AM/PM
export function timeStampTo12Time(timeStamp?: number) {
  if (!timeStamp) return "";
  return new Date(timeStamp * 1000)
    .toLocaleTimeString("fa-IR", {
      timeZone: "Asia/Tehran",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/ب\.ظ\.|ق\.ظ\./g, "")
    .trim();
}

