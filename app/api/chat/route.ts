import { NextRequest } from 'next/server';

export const runtime = 'edge';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MODEL = 'llama-3.3-70b-versatile';

const jsonError = (message: string, status: number) =>
  new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return jsonError('Server misconfiguration: missing GROQ_API_KEY', 500);
    }

    const body = (await req.json()) as { messages?: ChatMessage[] };
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonError('Invalid request body: messages are required.', 400);
    }

    const sanitized = messages.filter(
      (msg): msg is ChatMessage =>
        (msg.role === 'user' || msg.role === 'assistant') && typeof msg.content === 'string' && msg.content.trim().length > 0
    );

    if (sanitized.length === 0) {
      return jsonError('Invalid request body: no valid messages provided.', 400);
    }

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You are Arc Copilot, an AI assistant for stablecoin treasury operations, risk monitoring, and payment routing. Keep replies concise and actionable.'
          },
          ...sanitized
        ]
      })
    });

    if (!upstream.ok || !upstream.body) {
      const errorText = await upstream.text();
      return jsonError(errorText || 'Groq request failed', upstream.status || 502);
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return jsonError(message, 500);
  }
}
