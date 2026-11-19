import type { ReactNode } from 'react';

const shapes = {
  candles: <><path d="M5 3v4m0 6v8m7-19v8m0 6v6m7-18v3m0 6v7"/><rect x="3" y="7" width="4" height="6" rx=".6"/><rect x="10" y="10" width="4" height="6" rx=".6"/><rect x="17" y="7" width="4" height="6" rx=".6"/></>,
  gold: <><path d="M5 14h14l2 5H3l2-5Zm3-7h8l2 5H6l2-5Z"/></>,
  fund: <><path d="M3 10l9-5 9 5H3Zm1 10h16M7 12v5m5-5v5m5-5v5"/></>,
  upload: <><path d="M12 16V4m-4 4 4-4 4 4M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></>,
  download: <><path d="M12 4v12m-4-4 4 4 4-4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></>,
  fit: <><path d="M9 4H4v5m11-5h5v5M4 15v5h5m6 0h5v-5"/><path d="M9 12h6"/></>,
  panes: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 12h18"/></>,
  clock: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></>,
  check: <path d="m5 12 4 4 10-10"/>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 0 1 5 .6c0 1.8-2.7 2.1-2.7 4M12 17h.01"/></>,
  chevron: <path d="m6 9 6 6 6-6"/>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v3"/></>,
  file: <><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h1Zm7 0v6h5M8 13h8m-8 4h8"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
} satisfies Record<string, ReactNode>;

export function Icon({ name, size = 20 }: { name: keyof typeof shapes; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{shapes[name]}</svg>;
}
