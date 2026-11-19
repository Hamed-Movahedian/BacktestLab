import { useEffect, useState } from 'react';
import { getCsvFiles, runBacktest } from './backtest/api';
import type { BacktestResponse, Candle, Trade } from './backtest/types';
import { Inputs } from './backtest/Inputs';
import { Chart } from './backtest/Chart';
import { Trades } from './backtest/Trades';
import './App.css';

const emptyCandles: Candle[] = [];
const emptyTrades: Trade[] = [];

export default function App() {
  const [files, setFiles] = useState<string[]>([]);
  const [file, setFile] = useState('');
  const [count, setCount] = useState('');
  const [result, setResult] = useState<BacktestResponse | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getCsvFiles(controller.signal).then((list) => {
      setFiles(list); setFile(list[0] ?? ''); setError(list.length ? '' : 'هیچ فایل CSV در سرویس یافت نشد.');
    }).catch((e: unknown) => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'دریافت فهرست فایل‌ها ناموفق بود.'); })
      .finally(() => { if (!controller.signal.aborted) setLoadingFiles(false); });
    return () => controller.abort();
  }, [reload]);

  async function submit() {
    if (!file) return;
    const n = Number(count);
    if (count && (!Number.isInteger(n) || n < 100)) { setError('تعداد کندل باید عددی صحیح و حداقل ۱۰۰ باشد.'); return; }
    setLoading(true); setError('');
    try {
      const data = await runBacktest({ csv_filename: file, ...(count ? { candle_count: n } : {}) });
      setResult(data); setSelected(null);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'اجرای بک‌تست ناموفق بود.'); }
    finally { setLoading(false); }
  }

  return <div className="app" dir="rtl">
    <header className="topbar"><div className="brand-mark">B<span>↗</span></div><div><div className="brand">BACKTEST LAB <span> / </span> <small>آزمایشگاه استراتژی</small></div><div className="brand-sub">STRATEGY ANALYTICS WORKSPACE</div></div><div className="header-end"><span className="status-dot" /> محیط تحلیل <span className="header-divider" /> <span dir="ltr">v 1.0</span></div></header>
    <main className="workspace">
      <div className="page-heading"><div><div className="eyebrow">WORKSPACE <span>/</span> BACKTEST</div><h1>تحلیل بک‌تست <span>استراتژی</span></h1><p>عملکرد استراتژی معاملاتی خود را بررسی و تحلیل کنید.</p></div><div className="heading-tag"><span className="status-dot" /> میز کار تحلیل</div></div>
      <Inputs files={files} file={file} count={count} loading={loading} loadingFiles={loadingFiles} onFile={setFile} onCount={setCount} onSubmit={submit} onRetry={() => { setLoadingFiles(true); setReload((v) => v + 1); }} />
      {error && <div className="error" role="alert">{error}</div>}
      <div className="dashboard"><Chart candles={result?.candles ?? emptyCandles} trades={result?.trades ?? emptyTrades} selected={selected} hasResult={result !== null} /><Trades trades={result?.trades ?? emptyTrades} selected={selected} onSelect={setSelected} hasResult={result !== null} /></div>
      <footer><span>BACKTEST LAB <span className="footer-separator">/</span> STRATEGY ANALYTICS</span><span>ساخته شده برای تصمیم‌های دقیق‌تر <span className="footer-dot">●</span></span></footer>
    </main>
  </div>;
}
