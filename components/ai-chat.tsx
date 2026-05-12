export function AiChat() {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Copilot</h2>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">Online</span>
      </div>
      <div className="space-y-3 text-sm">
        <div className="rounded-xl bg-slate-800 p-3 text-slate-200">Forecast USDC outflows for next 24h.</div>
        <div className="rounded-xl bg-arc-600/20 p-3 text-arc-100">
          Predicted outflow: <b>$12.4k</b>. Suggested route: Base → Arbitrum bridge with lowest slippage profile.
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Ask the AI about liquidity, risk, and payment routing..." />
        <button className="rounded-xl bg-arc-600 px-4 text-sm font-medium">Send</button>
      </div>
    </section>
  );
}
