import { walletAssets } from '@/lib/data';

export function WalletOverview() {
  return (
    <section className="card p-5">
      <h2 className="mb-4 text-lg font-semibold">Wallet Overview</h2>
      <div className="space-y-3">
        {walletAssets.map((asset) => (
          <div key={asset.symbol} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div>
              <p className="font-medium">{asset.symbol}</p>
              <p className="text-xs text-slate-400">{asset.network}</p>
            </div>
            <div className="text-right">
              <p>${asset.balance.toLocaleString()}</p>
              <p className={`text-xs ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{asset.change}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
