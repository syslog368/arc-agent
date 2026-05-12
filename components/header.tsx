'use client';

import { Moon, Wallet2 } from 'lucide-react';

export function Header() {
  return (
    <header className="mb-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-4 shadow-glow">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-arc-100/80">Arc Pay Intelligence</p>
        <h1 className="text-xl font-semibold">Stablecoin Command Center</h1>
      </div>
      <div className="flex items-center gap-3 text-slate-300">
        <button className="rounded-xl border border-slate-700 p-2 hover:bg-slate-800" aria-label="Theme">
          <Moon className="h-4 w-4" />
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-arc-600 px-4 py-2 text-sm font-medium hover:bg-arc-500">
          <Wallet2 className="h-4 w-4" /> Connect Wallet
        </button>
      </div>
    </header>
  );
}
