import {
  ISeriesPrimitive,
  SeriesAttachedParameter,
  IChartApi,
  SeriesType,
  Time,
  IPrimitivePaneView,
  IPrimitivePaneRenderer,
} from 'lightweight-charts';

// استخراج ایمن تایپ پارامتر هدف از خود اینترفیس Renderer
type TargetType = Parameters<IPrimitivePaneRenderer['draw']>[0];

class VertLinePaneRenderer implements IPrimitivePaneRenderer {
  private _x: number | null = null;
  private _color: string;
  private _lineWidth: number;
  private _lineStyle: number[];

  constructor(x: number | null, color: string, lineWidth: number, lineStyle: number[]) {
    this._x = x;
    this._color = color;
    this._lineWidth = lineWidth;
    this._lineStyle = lineStyle;
  }

  draw(target: TargetType) {
    if (this._x === null) return;

    target.useMediaCoordinateSpace(({ context: ctx, mediaSize }) => {
      ctx.save();
      ctx.strokeStyle = this._color;
      ctx.lineWidth = this._lineWidth;
      ctx.setLineDash(this._lineStyle);

      ctx.beginPath();
      ctx.moveTo(this._x!, 0);
      ctx.lineTo(this._x!, mediaSize.height);
      ctx.stroke();

      ctx.restore();
    });
  }
}

class VertLinePaneView implements IPrimitivePaneView {
  private _source: VertLine;

  constructor(source: VertLine) {
    this._source = source;
  }

  renderer(): IPrimitivePaneRenderer {
    return new VertLinePaneRenderer(
      this._source.getX(),
      this._source.getColor(),
      this._source.getLineWidth(),
      this._source.getLineStyle()
    );
  }
}

export interface VertLineOptions {
  time: Time;
  color?: string;
  lineWidth?: number;
  lineStyle?: number[];
}

export class VertLine implements ISeriesPrimitive<Time> {
  private _chart: IChartApi | null = null;
  private _time: Time;
  private _color: string;
  private _lineWidth: number;
  private _lineStyle: number[];
  private _paneViews: readonly VertLinePaneView[];

  constructor(options: VertLineOptions) {
    this._time = options.time;
    this._color = options.color ?? '#3b82f6';
    this._lineWidth = options.lineWidth ?? 1;
    this._lineStyle = options.lineStyle ?? [4, 4];
    this._paneViews = [new VertLinePaneView(this)];
  }

  // نیازی به ذخیره series نیست
  attached(param: SeriesAttachedParameter<Time, SeriesType>) {
    this._chart = param.chart;
  }

  detached() {
    this._chart = null;
  }

  paneViews(): readonly IPrimitivePaneView[] {
    return this._paneViews;
  }

  updateAllViews() {}

  getX(): number | null {
    if (!this._chart) return null;
    return this._chart.timeScale().timeToCoordinate(this._time);
  }

  getColor() { return this._color; }
  getLineWidth() { return this._lineWidth; }
  getLineStyle() { return this._lineStyle; }

  setTime(time: Time) {
    this._time = time;
    this._chart?.applyOptions({});
  }
}

