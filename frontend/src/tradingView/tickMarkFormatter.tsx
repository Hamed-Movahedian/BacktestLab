import { Time, TickMarkType } from "lightweight-charts";
import { getTimestampInSeconds } from "./getTimestampInSeconds";

export const tickMarkFormatter = (time: Time, tickMarkType: TickMarkType, locale: string) => {
  const timestampInSeconds = getTimestampInSeconds(time);
  const date = new Date(timestampInSeconds * 1000);

  // اگر می‌خواهید اعداد و ماه‌ها به صورت فارسی/شمسی باشد 'fa-IR'
  // و اگر انگلیسی می‌خواهید 'en-US' قرار دهید.
  const targetLocale = "fa-IR";
  const timeZone = "Asia/Tehran";

  switch (tickMarkType) {
    case TickMarkType.Year:
      return new Intl.DateTimeFormat(targetLocale, {
        timeZone,
        year: "numeric",
      }).format(date);

    case TickMarkType.Month:
      return new Intl.DateTimeFormat(targetLocale, {
        timeZone,
        month: "short",
      }).format(date);

    case TickMarkType.DayOfMonth:
      return new Intl.DateTimeFormat(targetLocale, {
        timeZone,
        day: "numeric",
        month: "numeric",
      }).format(date);

    case TickMarkType.Time:
      // نمایش ساعت و دقیقه برای تایم‌فریم‌های درون‌روزی (Intraday)
      return new Intl.DateTimeFormat(targetLocale, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        hourCycle: "h11",
        dayPeriod:"narrow",
      }).format(date).replace(/ظهر|عصر/g, "");

    case TickMarkType.TimeWithSeconds:
      return new Intl.DateTimeFormat(targetLocale, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(date);

    default:
      return new Intl.DateTimeFormat(targetLocale, {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
  }
};
