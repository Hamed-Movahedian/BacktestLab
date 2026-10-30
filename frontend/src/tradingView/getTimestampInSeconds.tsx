import { Time, isUTCTimestamp } from "lightweight-charts";

// تابع کمکی برای استخراج عدد تایم‌استمپ (ثانیه)
export const getTimestampInSeconds = (time: Time): number => {
  if (isUTCTimestamp(time)) {
    return time;
  } else if (typeof time === "number") {
    return time;
  } else if (typeof time === "object" && "year" in time) {
    // در صورت استفاده از فرمت { year, month, day }
    return Math.floor(new Date(time.year, time.month - 1, time.day).getTime() / 1000);
  }
  return 0;
};
