import Papa from "papaparse";
import type {
  CandlestickData,
  UTCTimestamp,
  WhitespaceData,
} from "lightweight-charts";
import { asciiDigits, parseTimestamp } from "./time";

export type Candle = CandlestickData<UTCTimestamp> & { volume: number };
export type ChartPoint =
  | CandlestickData<UTCTimestamp>
  | WhitespaceData<UTCTimestamp>;

const normalizeHeader = (header: string) =>
  asciiDigits(header.normalize("NFKC"))
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[<>\[\]\s_\-\u200c\u200e\u200f]/g, "");

const aliases = {
  date: ["date", "تاریخ", "tradedate"],
  time: ["time", "ساعت", "زمان", "tradetime"],
  datetime: [
    "datetime",
    "timestamp",
    "date and time",
    "تاریخ زمان",
    "تاریخ و زمان",
    "تاریخ ساعت",
    "تاریخ و ساعت",
  ],
  open: [
    "open",
    "o",
    "openprice",
    "باز",
    "آغازین",
    "قیمت باز",
    "باز شدن",
    "قیمت باز شدن",
    "قیمت آغازین",
  ],
  high: [
    "high",
    "h",
    "highprice",
    "بیشترین",
    "بیشترین قیمت",
    "حداکثر",
    "حداکثر قیمت",
    "بالاترین قیمت",
  ],
  low: [
    "low",
    "l",
    "lowprice",
    "کمترین",
    "کمترین قیمت",
    "حداقل",
    "حداقل قیمت",
    "پایین‌ترین قیمت",
  ],
  close: [
    "close",
    "c",
    "closeprice",
    "بسته",
    "بسته شدن",
    "قیمت بسته",
    "قیمت بسته شدن",
    "قیمت پایانی",
    "پایانی",
  ],
  volume: ["volume", "vol", "v", "tickvol", "حجم", "حجم معامله", "حجم معاملات"],
} as const;

type Column = keyof typeof aliases;
const columnLabels: Record<Column, string> = {
  date: "تاریخ",
  time: "زمان",
  datetime: "تاریخ‌وزمان",
  open: "باز شدن",
  high: "بیشترین قیمت",
  low: "کمترین قیمت",
  close: "بسته شدن",
  volume: "حجم",
};
const numericColumns = ["open", "high", "low", "close", "volume"] as const;

function parseNumber(text: string, name: Column) {
  const value = asciiDigits(text).trim().replace(/٬/g, ",").replace(/٫/g, ".");
  if (!/^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value)) {
    throw new Error(`مقدار ستون «${columnLabels[name]}» عدد معتبر نیست.`);
  }
  const result = Number(value.replace(/,/g, ""));
  if (!Number.isFinite(result))
    throw new Error(
      `مقدار ستون «${columnLabels[name]}» خارج از محدودهٔ عددی است.`,
    );
  return result;
}

export function parseCandles(csv: string): Candle[] {
  if (!csv.trim()) throw new Error("فایل خالی است.");
  const parsed = Papa.parse<string[]>(csv.replace(/^\uFEFF/, ""), {
    skipEmptyLines: "greedy",
    delimitersToGuess: [",", ";", "\t"],
  });
  if (parsed.errors.length) {
    const { row, code } = parsed.errors[0];
    if (code === "UndetectableDelimiter")
      throw new Error(
        "جداکنندهٔ ستون‌ها تشخیص داده نشد؛ از کاما، نقطه‌ویرگول یا تب استفاده کنید.",
      );
    throw new Error(
      `رکورد ${Number(row ?? 0) + 1}: ساختار CSV یا گیومه‌ها نامعتبر است.`,
    );
  }
  const [header, ...rows] = parsed.data;
  if (!header) throw new Error("سطر عنوان پیدا نشد.");
  const names = header.map(normalizeHeader);
  const index = {} as Record<Column, number>;
  for (const key of Object.keys(aliases) as Column[]) {
    const options = (aliases[key] as readonly string[]).map(normalizeHeader);
    const matches = names.flatMap((cell, i) =>
      options.includes(cell) ? [i] : [],
    );
    if (matches.length > 1)
      throw new Error(`ستون «${columnLabels[key]}» بیش از یک بار آمده است.`);
    index[key] = matches[0] ?? -1;
  }
  const missing = numericColumns
    .filter((key) => index[key] < 0)
    .map((key) => columnLabels[key]);
  if (index.datetime < 0 && index.time < 0) missing.unshift("تاریخ‌وزمان");
  if (missing.length)
    throw new Error(`ستون‌های لازم پیدا نشد: ${missing.join("، ")}.`);

  const output: Candle[] = [];
  const seen = new Set<UTCTimestamp>();
  for (const [i, row] of rows.entries()) {
    try {
      if (row.length !== header.length)
        throw new Error("تعداد ستون‌ها با سطر عنوان برابر نیست.");
      const rawTime =
        index.datetime >= 0
          ? row[index.datetime]
          : index.date >= 0
            ? `${row[index.date]} ${row[index.time]}`
            : row[index.time];
      const time = parseTimestamp(rawTime);
      if (seen.has(time))
        throw new Error("برای یک زمان، بیش از یک کندل وجود دارد.");
      const { open, high, low, close, volume } = Object.fromEntries(
        numericColumns.map((key) => [key, parseNumber(row[index[key]], key)]),
      ) as Record<(typeof numericColumns)[number], number>;
      if (
        high < Math.max(open, close) ||
        low > Math.min(open, close) ||
        high < low
      ) {
        throw new Error(
          "بیشترین و کمترین قیمت با باز شدن یا بسته شدن سازگار نیستند.",
        );
      }
      if (volume < 0) throw new Error("حجم نمی‌تواند منفی باشد.");
      seen.add(time);
      output.push({ time, open, high, low, close, volume });
    } catch (error) {
      throw new Error(
        `رکورد ${i + 2}: ${error instanceof RangeError ? "تاریخ، ساعت یا اختلاف UTC نامعتبر است." : (error as Error).message}`,
      );
    }
  }
  if (!output.length) throw new Error("فایل هیچ کندلی ندارد.");
  return output.sort((a, b) => a.time - b.time);
}

export interface AlignedCandles {
  gold: ChartPoint[];
  fund: ChartPoint[];
  shared: number;
  missingFund: number;
  first: UTCTimestamp;
  last: UTCTimestamp;
}

export function alignCandles(
  gold: readonly Candle[],
  fund: readonly Candle[],
): AlignedCandles {
  // Both inputs are sorted and deduplicated by parseCandles. Keep the union, not the intersection.
  const a: ChartPoint[] = [];
  const b: ChartPoint[] = [];
  let i = 0,
    j = 0,
    shared = 0,
    missingFund = 0;
  while (i < gold.length || j < fund.length) {
    const x = gold[i];
    const y = fund[j];
    if (!y || (x && x.time < y.time)) {
      a.push(x);
      b.push({ time: x.time });
      i++;
      missingFund++;
    } else if (!x || y.time < x.time) {
      a.push({ time: y.time });
      b.push(y);
      j++;
    } else {
      a.push(x);
      b.push(y);
      i++;
      j++;
      shared++;
    }
  }
  if (!a.length) throw new Error("داده‌ای برای نمایش وجود ندارد.");
  return {
    gold: a,
    fund: b,
    shared,
    missingFund,
    first: a[0].time,
    last: a[a.length - 1].time,
  };
}
