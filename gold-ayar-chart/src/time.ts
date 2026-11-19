import { Temporal } from '@js-temporal/polyfill';
import { isValidJalaaliDate, toGregorian } from 'jalaali-js';
import type { UTCTimestamp } from 'lightweight-charts';

export const TEHRAN = 'Asia/Tehran';
export const faNumber = new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 10 });

export function asciiDigits(text: string) {
  return text.replace(/[۰-۹٠-٩]/g, (s) => String(s.charCodeAt(0) % 16));
}

export function parseTimestamp(input: string): UTCTimestamp {
  const value = asciiDigits(input).replace(/[\u200e\u200f]/g, '').trim();
  if (/^\d{10}(?:\d{3})?$/.test(value)) {
    const seconds = Number(value) / (value.length === 13 ? 1000 : 1);
    if (!Number.isInteger(seconds)) throw new Error('زمان یونیکس باید روی یک ثانیهٔ کامل باشد.');
    return seconds as UTCTimestamp;
  }

  const m = /^(\d{4})([-/.])(\d{1,2})\2(\d{1,2})[T\s]+(\d{1,2}):(\d{2})(?::(\d{2})(?:\.0{1,3})?)?(?:\s*(Z|[+-]\d{2}:?\d{2}))?$/i.exec(value);
  if (!m) throw new Error('تاریخ و ساعت باید مانند ۱۴۰۴/۰۸/۲۴ ۰۹:۳۰ یا 2025-11-15T06:00:00Z باشد.');
  let year = Number(m[1]);
  let month = Number(m[3]);
  let day = Number(m[4]);
  if (year >= 1200 && year <= 1599) {
    if (!isValidJalaaliDate(year, month, day)) throw new Error('تاریخ شمسی نامعتبر است.');
    const g = toGregorian(year, month, day);
    [year, month, day] = [g.gy, g.gm, g.gd];
  } else if (year < 1700) {
    throw new Error('سال تاریخ پشتیبانی نمی‌شود.');
  }

  // Validate first: Temporal's ISO string parser by itself will coerce leap seconds.
  const plain = Temporal.PlainDateTime.from({ year, month, day, hour: Number(m[5]), minute: Number(m[6]), second: Number(m[7] ?? 0) }, { overflow: 'reject' });
  if (m[8]) {
    return (Temporal.Instant.from(plain.toString() + m[8].toUpperCase()).epochMilliseconds / 1000) as UTCTimestamp;
  }
  try {
    return (plain.toZonedDateTime(TEHRAN, { disambiguation: 'reject' }).epochMilliseconds / 1000) as UTCTimestamp;
  } catch {
    throw new Error('این ساعت محلی تهران مبهم یا ناموجود است؛ اختلاف UTC را صریح وارد کنید.');
  }
}

const clock = new Intl.DateTimeFormat('fa-IR', {
  calendar: 'persian', timeZone: TEHRAN, numberingSystem: 'arabext', hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

export function tehranParts(time: number) {
  const fields: Record<string, string> = {};
  for (const { type, value } of clock.formatToParts(time * 1000)) fields[type] = value;
  return { year: fields.year, month: fields.month, day: fields.day, hour: fields.hour, minute: fields.minute, second: fields.second };
}

export function formatTehran(time: number, withSeconds = false) {
  const { year, month, day, hour, minute, second } = tehranParts(time);
  return `${year}/${month}/${day}  ${hour}:${minute}${withSeconds ? `:${second}` : ''}`;
}
