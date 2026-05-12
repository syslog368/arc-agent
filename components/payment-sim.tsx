import { paymentRail } from '@/lib/data';

export function PaymentSimulation() {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Stablecoin Payment Simulation</h2>
        <button className="rounded-lg border border-arc-500/50 px-3 py-1 text-sm text-arc-200">Run New</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-2">Invoice</th><th className="pb-2">Recipient</th><th className="pb-2">Amount</th><th className="pb-2">Status</th><th className="pb-2">ETA</th>
            </tr>
          </thead>
          <tbody>
            {paymentRail.map((row) => (
              <tr key={row.id} className="border-t border-slate-800">
                <td className="py-3">{row.id}</td>
                <td>{row.to}</td>
                <td>${row.amount.toLocaleString()}</td>
                <td><span className="rounded-full bg-slate-800 px-2 py-1 text-xs">{row.status}</span></td>
                <td>{row.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
