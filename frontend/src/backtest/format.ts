import type { Time } from 'lightweight-charts';
const dateTime = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { timeZone: 'Asia/Tehran', year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true });
export function formatTime(time: Time): string {
  const date = typeof time === 'number' ? new Date(time * 1000) : typeof time === 'string' ? new Date(`${time}T00:00:00Z`) : new Date(Date.UTC(time.year, time.month - 1, time.day));
  return dateTime.format(date);
}
export function duration(seconds: number): string { const minutes = Math.round(Math.abs(seconds) / 60); const days = Math.floor(minutes / 1440); const hours = Math.floor(minutes % 1440 / 60); return `${days ? `${days} روز ` : ''}${hours ? `${hours} ساعت ` : ''}${minutes % 60 || (!days && !hours) ? `${minutes % 60} دقیقه` : ''}`; }
