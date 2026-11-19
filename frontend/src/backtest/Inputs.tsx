interface Props { files: string[]; file: string; count: string; loading: boolean; loadingFiles: boolean; onFile: (v: string) => void; onCount: (v: string) => void; onSubmit: () => void; onRetry: () => void }
export function Inputs(p: Props) {
  return <form className="inputs panel" onSubmit={(e) => { e.preventDefault(); p.onSubmit(); }}>
    <div className="section-title"><span className="section-icon">⌘</span><div><strong>تنظیمات بک‌تست</strong><small>پارامترهای اجرای استراتژی</small></div></div>
    <div className="input-fields"><label>فایل داده <span className="required">*</span><select value={p.file} onChange={(e) => p.onFile(e.target.value)} disabled={p.loadingFiles || !p.files.length}>{p.files.length ? p.files.map((f) => <option key={f} value={f}>{f}</option>) : <option value="">{p.loadingFiles ? 'در حال دریافت فایل‌ها...' : 'فایلی موجود نیست'}</option>}</select></label>
      <label>تعداد کندل <span className="optional">(اختیاری)</span><input type="number" min="100" step="1" placeholder="همه کندل‌ها" value={p.count} onChange={(e) => p.onCount(e.target.value)} /></label>
      <button className="run" type="submit" disabled={!p.file || p.loading || p.loadingFiles}>{p.loading ? 'در حال اجرا...' : 'اجرای بک‌تست'} <span>←</span></button>
      {!p.loadingFiles && !p.files.length && <button className="retry" type="button" onClick={p.onRetry}>تلاش مجدد</button>}
    </div>
  </form>;
}
