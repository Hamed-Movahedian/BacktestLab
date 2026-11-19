import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  createChartEx,
} from "lightweight-charts";
import type {
  DeepPartial,
  MouseEventParams,
  Time,
  TimeChartOptions,
} from "lightweight-charts";
import type { AlignedCandles, Candle } from "./csv";
import { TehranTimeBehavior } from "./tehran-scale";
import { faNumber, formatTehran } from "./time";
import { Icon } from "./icons";

const nf = (number: number) => faNumber.format(number);

export function ChartBoard({
  gold,
  fund,
  aligned,
  isDemo,
}: {
  gold: Candle[];
  fund: Candle[];
  aligned: AlignedCandles;
  isDemo: boolean;
}) {
  const chartEl = useRef<HTMLDivElement>(null);
  const fit = useRef<() => void>(() => {});
  const [cursor, setCursor] = useState<number>();
  const [tops, setTops] = useState([0, 0]);
  const lookup = useMemo(
    () =>
      [gold, fund].map(
        (rows) => new Map<number, Candle>(rows.map((c) => [c.time, c])),
      ),
    [gold, fund],
  );
  const seconds = useMemo(
    () => aligned.gold.some((c) => c.time % 60 !== 0),
    [aligned],
  );

  useLayoutEffect(() => {
    const container = chartEl.current;
    if (!container) return;
    const behavior = new TehranTimeBehavior();
    const options: DeepPartial<TimeChartOptions> = {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "#121821" },
        textColor: "#9aa8ba",
        fontFamily: "Vazirmatn Variable, Tahoma, sans-serif",
        fontSize: 11,
        attributionLogo: false,
        panes: {
          enableResize: true,
          separatorColor: "#2c3747",
          separatorHoverColor: "#536984",
        },
      },
      grid: {
        vertLines: { color: "#202b38" },
        horzLines: { color: "#202b38" },
      },
      localization: {
        locale: "fa-IR",
        dateFormat: "yyyy-MM-dd",
        timeFormatter: (t: Time) =>
          typeof t === "number" ? formatTehran(t, seconds) : String(t),
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: seconds,
        borderColor: "#2c3747",
        rightOffset: 2,
        minBarSpacing: 0.00001,
        fixLeftEdge: true,
        ignoreWhitespaceIndices: false,
        tickMarkMaxCharacterLength: seconds ? 8 : 5,
        tickMarkFormatter: behavior.formatAxis,
      },
      rightPriceScale: {
        borderColor: "#2c3747",
        minimumWidth: 82,
        scaleMargins: { top: 0.3, bottom: 0.12 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#8493ab",
          style: LineStyle.Dashed,
          labelBackgroundColor: "#344256",
        },
        horzLine: {
          color: "#64748b",
          style: LineStyle.Dashed,
          labelBackgroundColor: "#344256",
        },
      },
      handleScroll: { vertTouchDrag: false },
    };
    const chart = createChartEx<Time, TehranTimeBehavior>(
      container,
      behavior,
      options,
    );
    const seriesOptions = {
      upColor: "#2bc4a6",
      downColor: "#ed727e",
      borderVisible: false,
      wickUpColor: "#2bc4a6",
      wickDownColor: "#ed727e",
      priceLineVisible: false,
      priceFormat: {
        type: "custom" as const,
        formatter: nf,
        minMove: 0.0000000001,
      },
    };
    const a = chart.addSeries(CandlestickSeries, seriesOptions, 0);
    const b = chart.addSeries(CandlestickSeries, seriesOptions, 1);
    a.setData(aligned.gold);
    b.setData(aligned.fund);
    const panes = chart.panes();
    panes[0].setStretchFactor(1);
    panes[1].setStretchFactor(1);
    fit.current = () => {
      a.priceScale().applyOptions({ autoScale: true });
      b.priceScale().applyOptions({ autoScale: true });
      chart.timeScale().fitContent();
    };
    fit.current();

    const measure = () => {
      const origin = container.getBoundingClientRect().top;
      const positions = panes.map((pane) =>
        Math.round(
          (pane.getHTMLElement()?.getBoundingClientRect().top ?? origin) -
            origin,
        ),
      );
      setTops((old) =>
        positions.every((v, i) => old[i] === v) ? old : positions,
      );
    };
    const resize = new ResizeObserver(measure);
    resize.observe(container);
    for (const pane of panes) {
      const element = pane.getHTMLElement();
      if (element) resize.observe(element);
    }
    const initialMeasure = requestAnimationFrame(measure);
    const crosshair = (param: MouseEventParams<Time>) =>
      setCursor(typeof param.time === "number" ? param.time : undefined);
    chart.subscribeCrosshairMove(crosshair);
    return () => {
      fit.current = () => {};
      cancelAnimationFrame(initialMeasure);
      resize.disconnect();
      chart.unsubscribeCrosshairMove(crosshair);
      chart.remove();
    };
  }, [aligned, seconds]);

  const selected = cursor ?? aligned.last;
  return (
    <section className="chart-card" aria-labelledby="chart-heading">
      <header className="chart-tools">
        <div className="chart-title">
          <Icon name="panes" size={17} />
          <h2 id="chart-heading">نمای مقایسه</h2>
          <span className="tag">
            {isDemo ? "نمونهٔ ۵ دقیقه‌ای" : "دادهٔ فایل‌ها"}
          </span>
        </div>
        <div className="chart-actions">
          <span className="time-readout">
            <Icon name="clock" size={15} />
            <bdi dir="ltr">{formatTehran(selected, seconds)}</bdi>
          </span>
          <button
            type="button"
            className="button compact"
            onClick={() => fit.current()}
            title="بازنشانی زمان و مقیاس قیمت‌ها"
          >
            <Icon name="fit" size={15} /> نمایش کل داده
          </button>
        </div>
      </header>
      <div className="chart-shell">
        <div
          className="chart-canvas"
          dir="ltr"
          ref={chartEl}
          aria-label="دو نمودار شمعی روی محور شمسی مشترک؛ پنل اول طلا و پنل دوم صندوق عیار"
        />
        {(["gold", "fund"] as const).map((key, i) => (
          <PaneLegend
            key={key}
            type={key}
            top={tops[i]}
            candle={lookup[i].get(selected)}
          />
        ))}
      </div>
      <div className="chart-footer">
        <span>
          <i className="sync-dot" /> محور مشترک · تاریخ شمسی و ساعت تهران
        </span>
        <span className="candle-keys">
          <span>
            <i className="up-dot" /> صعودی
          </span>
          <span>
            <i className="down-dot" /> نزولی
          </span>
          <span>
            <i className="gap-dot" /> بدون داده
          </span>
        </span>
      </div>
    </section>
  );
}

function PaneLegend({
  type,
  top,
  candle,
}: {
  type: "gold" | "fund";
  top: number;
  candle?: Candle;
}) {
  return (
    <div className="pane-legend" style={{ top: top + 13 }}>
      <div className="pane-title">
        <span className={`symbol-icon ${type}`}>
          <Icon name={type} size={15} />
        </span>
        <strong>{type === "gold" ? "طلای ۱۸ عیار" : "صندوق طلای عیار"}</strong>
      </div>
      {candle ? (
        <dl className="metrics">
          {(
            [
              ["باز", "open"],
              ["بیشینه", "high"],
              ["کمینه", "low"],
              ["بسته", "close"],
              ["حجم", "volume"],
            ] as const
          ).map(([label, key]) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd
                className={
                  key === "close"
                    ? candle.close >= candle.open
                      ? "positive"
                      : "negative"
                    : ""
                }
              >
                <bdi>{nf(candle[key])}</bdi>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <span className="missing">
          <i className="gap-dot" /> بدون داده در این زمان
        </span>
      )}
    </div>
  );
}
