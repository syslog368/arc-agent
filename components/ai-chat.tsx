'use client';

import { FormEvent, useState } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const starter: Message[] = [
  { role: 'user', content: 'Forecast USDC outflows for next 24h.' },
  {
    role: 'assistant',
    content: 'Predicted outflow: $12.4k. Suggested route: Base → Arbitrum bridge with lowest slippage profile.'
  }
];

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>(starter);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: 'user' as const, content: trimmed }];
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages })
      });

      if (!response.ok || !response.body) {
        const text = await response.text();
        throw new Error(text || 'Unable to fetch AI response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          const lines = event.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const payload = line.slice(6).trim();
            if (!payload || payload === '[DONE]') continue;

            const json = JSON.parse(payload) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };

            const token = json.choices?.[0]?.delta?.content;
            if (token) {
              assistantText += token;
              setMessages((current) => {
                const updated = [...current];
                updated[updated.length - 1] = { role: 'assistant', content: assistantText };
                return updated;
              });
            }
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
      setMessages((current) => {
        const updated = [...current];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'I hit an error while connecting to Groq. Please retry in a moment.'
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

export function AiChat() {
  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Copilot</h2>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">{loading ? 'Thinking...' : 'Online'}</span>
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto pr-1 text-sm">
        {messages.map((msg, idx) => (
          <div key={`${msg.role}-${idx}`} className={`rounded-xl p-3 ${msg.role === 'user' ? 'bg-slate-800 text-slate-200' : 'bg-arc-600/20 text-arc-100'}`}>
            {msg.content || (loading && idx === messages.length - 1 ? 'Streaming response...' : '')}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
          placeholder="Ask the AI about liquidity, risk, and payment routing..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={loading} className="rounded-xl bg-arc-600 px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? '...' : 'Send'}
        </button>
      </form>
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
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
