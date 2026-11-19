import { StrictMode, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/vazirmatn';
import './style.css';
import { ChartBoard } from './ChartBoard';
import { alignCandles, parseCandles } from './csv';
import type { Candle } from './csv';
import { faNumber } from './time';
import { Icon } from './icons';
import goldDemo from '../samples/gold-demo.csv?raw';
import fundDemo from '../samples/ayar-demo.csv?raw';
import notices from '../THIRD-PARTY-NOTICES.txt?raw';

const sample = { gold: parseCandles(goldDemo), fund: parseCandles(fundDemo) };
const inlineCsv = (csv: string) => `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
type SymbolKey = 'gold' | 'fund';
type FileState = { name: string; loading?: boolean; candles?: Candle[]; error?: string };
const MAX_MIB = 16;

function App() {
  const [files, setFiles] = useState<Partial<Record<SymbolKey, FileState>>>({});
  const [revision, setRevision] = useState(0);
  const request = useRef({ gold: 0, fund: 0 });
  const isDemo = !(files.gold?.candles && files.fund?.candles);
  const gold = isDemo ? sample.gold : files.gold!.candles!;
  const fund = isDemo ? sample.fund : files.fund!.candles!;
  const aligned = useMemo(() => alignCandles(gold, fund), [gold, fund]);

  async function load(key: SymbolKey, file: File) {
    const id = ++request.current[key];
    const update = (state: FileState) => setFiles((old) => ({ ...old, [key]: state }));
    update({ name: file.name, loading: true });
    try {
      if (file.size > MAX_MIB * 1024 ** 2) throw new Error(`حجم فایل بیشتر از ${faNumber.format(MAX_MIB)} مگابایت است.`);
      let text: string;
      try { text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer()); }
      catch { throw new Error('فایل خوانده نشد. آن را با کدگذاری UTF-8 ذخیره کنید.'); }
      if (id !== request.current[key]) return;
      const candles = parseCandles(text);
      update({ name: file.name, candles });
      setRevision((x) => x + 1);
    } catch (error) {
      if (id === request.current[key]) update({ name: file.name, error: (error as Error).message });
    }
  }

  function reset() {
    request.current.gold++;
    request.current.fund++;
    setFiles({});
  }

  return <div className="app">
    <header className="masthead">
      <div className="header-inner">
        <div className="brand"><div className="brand-icon"><Icon name="candles" size={22} /></div><span>هم‌نمودار</span></div>
        <span className="zone"><Icon name="clock" size={16} /> ساعت تهران</span>
      </div>
    </header>
    <main className="workspace">
      <section className="intro">
        <div>
          <div className="eyebrow"><i /> مقایسهٔ بازار طلا</div>
          <h1>طلای ۱۸ عیار <span>و</span> صندوق عیار</h1>
          <p>دو نمودار شمعی روی یک محور زمان؛ جاهای خالی، زمان‌هایی را نشان می‌دهند که در فایل آن نماد داده‌ای نیست.</p>
        </div>
        <div className={`source-badge ${isDemo ? '' : 'real'}`} aria-live="polite"><i /> {isDemo ? 'دادهٔ ساختگی برای نمونه' : 'دادهٔ CSV شما'}</div>
      </section>
      <section className="inputs" aria-labelledby="files-heading">
        <div className="input-heading">
          <h2 id="files-heading"><Icon name="file" size={17} /> فایل‌های ورودی</h2>
          {Object.keys(files).length > 0 && <button className="text-button" onClick={reset}>بازگشت به نمونه</button>}
        </div>
        <div className="input-grid">
          <FilePicker type="gold" file={files.gold} onLoad={(f) => void load('gold', f)} />
          <FilePicker type="fund" file={files.fund} onLoad={(f) => void load('fund', f)} />
        </div>
        <div className="input-note">
          <span><Icon name="lock" size={14} /> فایل‌ها فقط در مرورگر شما خوانده می‌شوند.</span>
          <details className="schema">
            <summary><Icon name="help" size={16} /> راهنمای CSV <Icon name="chevron" size={12} /></summary>
            <div className="schema-content">
              <p>هر دو فایل را با کدگذاری <bdi dir="ltr">UTF-8</bdi>، یک تایم‌فریم و زمان یکسان برای شروع (یا پایان) کندل وارد کنید. نمونهٔ سطر عنوان و داده:</p>
              <pre dir="ltr">{'date,time,open,high,low,close,volume\n1404/08/27,11:30,100,106,98,104,250'}</pre>
              <p>ستون‌های «تاریخ‌وزمان» یا <bdi dir="ltr">timestamp</bdi> هم قابل استفاده‌اند. تاریخ می‌تواند شمسی یا میلادی باشد؛ زمانِ بدون منطقهٔ زمانی، ساعت تهران در نظر گرفته می‌شود.</p>
              <div className="downloads">
                <a href={inlineCsv(goldDemo)} download="gold-demo.csv"><Icon name="download" size={15} /> نمونهٔ طلا</a>
                <a href={inlineCsv(fundDemo)} download="ayar-demo.csv"><Icon name="download" size={15} /> نمونهٔ عیار</a>
              </div>
            </div>
          </details>
        </div>
      </section>
      {!isDemo && aligned.shared === 0 && <div className="warning" role="status"><Icon name="info" size={18} /> هیچ زمان یکسانی در دو فایل پیدا نشد. بازهٔ تاریخ، منطقهٔ زمانی و زمان ثبت کندل‌ها را بررسی کنید.</div>}
      <ChartBoard key={isDemo ? 'demo' : `custom-${revision}`} gold={gold} fund={fund} aligned={aligned} isDemo={isDemo} />
      <footer className="page-footer"><span>{faNumber.format(aligned.shared)} زمان مشترک · {faNumber.format(aligned.missingFund)} زمان با دادهٔ طلا و بدون دادهٔ صندوق</span>
        <span dir="ltr">Lightweight Charts™ · © 2025 <a href="https://www.tradingview.com/" target="_blank" rel="noreferrer">TradingView</a> · <a download="THIRD-PARTY-NOTICES.txt" href={`data:text/plain;charset=utf-8,${encodeURIComponent(notices)}`}>Licenses</a></span>
      </footer>
    </main>
  </div>;
}

function FilePicker({ type, file, onLoad }: { type: SymbolKey; file?: FileState; onLoad: (file: File) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const label = type === 'gold' ? 'طلای ۱۸ عیار' : 'صندوق طلای عیار';
  return <div className={`file-picker ${file?.error ? 'bad-file' : ''}`}>
    <div className="file-row">
      <span className={`symbol-icon ${type}`}><Icon name={type} size={21} /></span>
      <div className="file-label">
        <strong>{label}</strong>
        <div className="file-status" aria-live="polite">
          {file ? <><bdi title={file.name}>{file.name}</bdi>{file.loading ? <span>در حال خواندن…</span> : file.candles ? <span className="file-ok"><Icon name="check" size={13} /> {faNumber.format(file.candles.length)} کندل</span> : null}</> : 'هنوز فایلی انتخاب نشده'}
        </div>
      </div>
      <input type="file" accept=".csv,text/csv" hidden ref={input} onChange={(e) => {
        const selected = e.target.files?.[0];
        if (selected) onLoad(selected);
        e.target.value = '';
      }} />
      <button className="button pick" type="button" aria-label={`انتخاب CSV ${label}`} onClick={() => input.current?.click()}><Icon name="upload" size={16} /> <span>انتخاب CSV</span></button>
    </div>
    {file?.error && <p className="file-error" role="alert">{file.error}</p>}
  </div>;
}

// Canvas font measurements are cached by the chart. Load the local font first.
const start = () => createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
void Promise.allSettled([
  document.fonts.load('12px "Vazirmatn Variable"', 'زمان ۱۲۳۴۵۶۷۸۹۰'),
  document.fonts.load('12px "Vazirmatn Variable"', '/:'),
]).then(start);
