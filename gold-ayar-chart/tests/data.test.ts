import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { alignCandles, parseCandles } from '../src/csv';
import { asciiDigits, formatTehran, parseTimestamp } from '../src/time';
import { TehranTimeBehavior } from '../src/tehran-scale';
import { TickMarkType } from 'lightweight-charts';
import type { InternalHorzScaleItem, Mutable, TimeScalePoint, TickMarkWeightValue } from 'lightweight-charts';

const hdr = 'date,time,open,high,low,close,volume\n';
const row = (time: string) => `2025-11-15,${time},10,12,9,11,50`;
const csv = (...times: string[]) => hdr + times.map(row).join('\n');

test('English CSV sorts rows, preserves zero volume and reads BOM', () => {
  const rows = parseCandles('\uFEFF' + csv('11:35', '11:30').replace(',11,50', ',11,0') + '\n  \n');
  assert.equal(rows.length, 2);
  assert.equal(rows[0].time, parseTimestamp('2025-11-15 11:30'));
  assert.equal(rows[0].high, 12);
  assert.equal(rows[1].volume, 0);
});

test('Farsi headers, digits, prices and semi-colon delimiter', () => {
  const [candle] = parseCandles('تاریخ;زمان;قیمت باز شدن;حداکثر قیمت;حداقل قیمت;قیمت بسته شدن;حجم معامله\n۱۴۰۴/۰۸/۲۴;۰۹:۳۰;۱٬۰۰۰٫۵;۱٬۲۰۰;۹۰۰;۱٬۱۰۰;۲۵');
  assert.equal(candle.time, Date.parse('2025-11-15T06:00:00Z') / 1000);
  assert.equal(candle.open, 1000.5);
  assert.equal(candle.volume, 25);
  assert.equal(asciiDigits('۱۲٣٤'), '1234');
});

test('Unix seconds/milliseconds and explicit offsets refer to the same instant', () => {
  const t = Date.parse('2025-11-15T06:00:00Z') / 1000;
  const prefix = 'timestamp,open,high,low,close,volume\n';
  for (const value of [t, t * 1000, '2025-11-15T09:30:00+03:30', '2025-11-15 06:00Z']) {
    const [c] = parseCandles(prefix + `${value},10,12,9,11,40`);
    assert.equal(c.time, t);
  }
  assert.equal(formatTehran(t), '۱۴۰۴/۰۸/۲۴  ۰۹:۳۰');
  assert.equal(formatTehran(Date.parse('2025-11-15T21:00:00Z') / 1000), '۱۴۰۴/۰۸/۲۵  ۰۰:۳۰');
});

test('Tehran historical offsets, DST transitions and invalid dates', () => {
  assert.equal(parseTimestamp('2021-07-01 12:00'), Date.parse('2021-07-01T07:30Z') / 1000);
  assert.throws(() => parseTimestamp('2021-03-22 00:30'), /مبهم یا ناموجود/);
  assert.throws(() => parseTimestamp('1400/12/30 10:00'), /تاریخ شمسی نامعتبر/);
  assert.throws(() => parseTimestamp('2025-02-29 09:00'));
});

test('Malformed, duplicate, impossible OHLC, and empty records are rejected', () => {
  assert.throws(() => parseCandles(csv('11:30', '11:30')), /رکورد 3.*بیش از یک/);
  assert.throws(() => parseCandles(hdr + '2025-11-15,11:30,10,8,9,11,50'), /سازگار نیستند/);
  assert.throws(() => parseCandles(hdr + '2025-11-15,11:30,10,12,9,11,-1'), /حجم نمی‌تواند/);
  assert.throws(() => parseCandles(hdr + '2025-11-15,11:30,10,12,9,11'), /تعداد ستون/);
  assert.throws(() => parseCandles(hdr + '2025-11-15,11:30,"10,12,9,11,50'), /ساختار CSV/);
  assert.throws(() => parseCandles(hdr), /هیچ کندلی/);
});

test('Merge keeps union, inserts whitespace, and does not fabricate bars', () => {
  const a = parseCandles(csv('11:40', '11:30', '11:35'));
  const b = parseCandles(csv('11:45', '11:35'));
  const result = alignCandles(a, b);
  assert.deepEqual(result.gold.map((x) => x.time), result.fund.map((x) => x.time));
  assert.deepEqual(result.fund[0], { time: a[0].time });
  assert.deepEqual(result.fund[2], { time: a[2].time });
  assert.deepEqual(result.gold[3], { time: b[1].time });
  assert.equal(result.shared, 1);
  assert.equal(result.missingFund, 2);
});

test('Tick weights change at Tehran midnight and Persian new year, not UTC midnight', () => {
  const behavior = new TehranTimeBehavior();
  const t = ['2025-03-20T20:25Z', '2025-03-20T20:30Z', '2025-03-20T23:55Z', '2025-03-21T00:00Z'].map(parseTimestamp);
  const points: Mutable<TimeScalePoint>[] = t.map((time) => ({ originalTime: time, time: {} as InternalHorzScaleItem, timeWeight: 0 as TickMarkWeightValue }));
  behavior.fillWeightsForPoints(points, 0);
  assert.deepEqual(points.map((p) => p.timeWeight), [30, 70, 30, 21]);
  assert.equal(behavior.formatAxis(t[1], TickMarkType.Year), '۱۴۰۴');
  assert.equal(behavior.formatAxis(t[1], TickMarkType.Time), '۰۰:۰۰');
});

test('Bundled data is five-minute demo with overlap and holes', () => {
  const gold = parseCandles(readFileSync(new URL('../samples/gold-demo.csv', import.meta.url), 'utf8'));
  const fund = parseCandles(readFileSync(new URL('../samples/ayar-demo.csv', import.meta.url), 'utf8'));
  const aligned = alignCandles(gold, fund);
  assert.equal(aligned.shared, 54);
  assert.equal(aligned.missingFund, 32);
  assert.equal(gold[1].time - gold[0].time, 300);
});
