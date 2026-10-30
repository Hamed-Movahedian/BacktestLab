export const timeFormatter = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true,
    // year: "numeric",
    // month: "long",
    // day: "2-digit",
    // weekday: "long",
    dayPeriod:"narrow"
  }).format(date).replace(/ظهر|عصر/g, "");
};
