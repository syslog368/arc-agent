import { AiChat } from '@/components/ai-chat';
import { Header } from '@/components/header';
import { PaymentSimulation } from '@/components/payment-sim';
import { WalletOverview } from '@/components/wallet-overview';

export default function Page() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6">
      <Header />
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="card p-5 md:col-span-2">
          <p className="text-xs uppercase tracking-[0.2em] text-arc-100/70">Treasury Health</p>
          <h2 className="mt-1 text-3xl font-semibold">$32.3M</h2>
          <p className="mt-2 text-sm text-slate-300">Net stablecoin liquidity across integrated wallets and exchanges.</p>
        </div>
        <div className="card p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Risk Signal</p>
          <h3 className="mt-1 text-xl font-semibold text-emerald-300">Low Volatility</h3>
          <p className="mt-2 text-sm text-slate-300">AI confidence: 91%</p>
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AiChat />
          <PaymentSimulation />
        </div>
        <WalletOverview />
      </section>
    </main>
  );
}
