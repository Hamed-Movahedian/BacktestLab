import { defaultHorzScaleBehavior, TickMarkType } from "lightweight-charts";
import type {
  Mutable,
  Time,
  TimeScalePoint,
  TickMarkWeightValue,
} from "lightweight-charts";
import { asciiDigits, tehranParts } from "./time";

const DefaultTimeBehavior = defaultHorzScaleBehavior();

// Use the v5 time behavior and retain the UTC data keys. Only the weights and
// labels of ticks depend on the Tehran clock and the Persian calendar.
export class TehranTimeBehavior extends DefaultTimeBehavior {
  private parts = new Map<number, ReturnType<typeof tehranParts>>();

  private at(time: number) {
    let fields = this.parts.get(time);
    if (!fields) {
      fields = tehranParts(time);
      this.parts.set(time, fields);
    }
    return fields;
  }

  override fillWeightsForPoints(
    points: readonly Mutable<TimeScalePoint>[],
    start: number,
  ) {
    if (start === 0) this.parts.clear();
    const previous = points[start - 1]?.originalTime;
    let prev = typeof previous === "number" ? this.at(previous) : undefined;
    for (let i = start; i < points.length; i++) {
      const time = points[i].originalTime;
      if (typeof time !== "number") continue;
      const current = this.at(time);
      // These weights match the built-in TickMarkType mapping in v5.3.
      const weight = !prev
        ? 30
        : current.year !== prev.year
          ? 70
          : current.month !== prev.month
            ? 60
            : current.day !== prev.day
              ? 50
              : current.hour !== prev.hour
                ? 30
                : current.minute !== prev.minute
                  ? Number(asciiDigits(current.minute)) % 5 === 0
                    ? 21
                    : 20
                  : 10;
      points[i].timeWeight = weight as TickMarkWeightValue;
      prev = current;
    }
  }

  formatAxis = (time: Time, tick: TickMarkType) => {
    if (typeof time !== "number") return null;
    const { year, month, day, hour, minute, second } = this.at(time);
    if (tick === TickMarkType.Year) return year;
    if (tick === TickMarkType.Month || tick === TickMarkType.DayOfMonth)
      return `${month}/${day}`;
    return `${hour}:${minute}${tick === TickMarkType.TimeWithSeconds ? `:${second}` : ""}`;
  };
}
