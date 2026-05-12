'use client';

import { FormEvent, useMemo, useState } from 'react';

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type GroqChunk = {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
};

const initialMessages: ChatMessage[] = [
  {
    id: 'seed-user',
    role: 'user',
    content: 'Forecast USDC outflows for next 24h.'
  },
  {
    id: 'seed-assistant',
    role: 'assistant',
    content: 'Predicted outflow: $12.4k. Suggested route: Base → Arbitrum bridge with lowest slippage profile.'
  }
];

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isStreaming, [input, isStreaming]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: text };
    const assistantMessage: ChatMessage = { id: makeId(), role: 'assistant', content: '' };

    const nextMessages = [...messages, userMessage];
    setMessages([...nextMessages, assistantMessage]);
    setInput('');
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content }))
        })
      });

      if (!response.ok || !response.body) {
        const message = await response.text();
        throw new Error(message || 'Failed to fetch AI response.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split('\n\n');
        buffer = frames.pop() ?? '';

        for (const frame of frames) {
          const lines = frame.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();

            if (!data || data === '[DONE]') continue;

            let parsed: GroqChunk;
            try {
              parsed = JSON.parse(data) as GroqChunk;
            } catch {
              continue;
            }

            const token = parsed.choices?.[0]?.delta?.content;
            if (!token) continue;

            fullText += token;
            setMessages((current) =>
              current.map((msg) =>
                msg.id === assistantMessage.id ? { ...msg, content: fullText } : msg
              )
            );
          }
        }
      }

      if (!fullText) {
        setMessages((current) =>
          current.map((msg) =>
            msg.id === assistantMessage.id
              ? {
                  ...msg,
                  content: 'No response content returned. Please try again.'
                }
              : msg
          )
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error while streaming response.';
      setError(message);
      setMessages((current) =>
        current.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: 'I could not reach Groq right now. Please retry in a few moments.'
              }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Copilot</h2>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
          {isStreaming ? 'Streaming' : 'Online'}
        </span>
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto pr-1 text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-xl p-3 ${
              msg.role === 'user' ? 'bg-slate-800 text-slate-200' : 'bg-arc-600/20 text-arc-100'
            }`}
          >
            {msg.content || (isStreaming && msg.role === 'assistant' ? 'Streaming response...' : '')}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about liquidity, treasury risk, or payment routing..."
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="rounded-xl bg-arc-600 px-4 text-sm font-medium transition hover:bg-arc-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isStreaming ? 'Sending...' : 'Send'}
        </button>
      </form>

      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </section>
  );
}
