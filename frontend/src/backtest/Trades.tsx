import type { Trade } from './types';
interface Props { trades: Trade[]; selected: number | null; onSelect: (index: number | null) => void; hasResult: boolean }
const pct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(2)}%`;
export function Trades({ trades, selected, onSelect, hasResult }: Props) {
  const total = trades.reduce((sum, trade) => sum + trade.pnl_pct, 0);
  const max = Math.max(...trades.map((t) => Math.abs(t.pnl_pct)), 0.01);
  return <aside className="panel trades"><div className="panel-header"><div><div className="panel-kicker">TRADE HISTORY</div><h2>معاملات <span className="count-badge">{trades.length}</span></h2></div><span className="panel-icon">≡</span></div>
    <div className="trade-head"><span>ردیف</span><span>بازدهی معامله</span><span>سود / زیان</span></div>
    <div className="trade-list">{trades.length ? trades.map((trade, index) => <button type="button" key={index} className={`trade-row ${selected === index ? 'selected' : ''}`} onClick={() => onSelect(selected === index ? null : index)} aria-pressed={selected === index}>
      <span className="row-number">{String(index + 1).padStart(2, '0')}</span><span className="bar-track"><span className={`bar ${trade.pnl_pct >= 0 ? 'positive-bg' : 'negative-bg'}`} style={{ width: `${Math.abs(trade.pnl_pct) / max * 100}%` }} /></span><span className={trade.pnl_pct >= 0 ? 'positive' : 'negative'} dir="ltr">{pct(trade.pnl_pct)}</span>
    </button>) : <div className="trade-empty">{hasResult ? 'معامله‌ای در این بازه ثبت نشده است.' : 'پس از اجرا، معاملات اینجا نمایش داده می‌شوند.'}</div>}</div>
    <div className="summary"><div className="summary-title">خلاصه عملکرد <span>SUMMARY</span></div><div><span>تعداد معاملات</span><b>{trades.length}</b></div><div><span>بازدهی کل</span><b className={total >= 0 ? 'positive' : 'negative'} dir="ltr">{pct(total)}</b></div><div><span>میانگین بازدهی</span><b className={total >= 0 ? 'positive' : 'negative'} dir="ltr">{pct(trades.length ? total / trades.length : 0)}</b></div></div>
  </aside>;
}
