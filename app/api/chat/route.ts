import { NextRequest } from 'next/server';

export const runtime = 'edge';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response('Server misconfiguration: missing GROQ_API_KEY', { status: 500 });
    }

    const { messages } = (await req.json()) as { messages?: ChatMessage[] };
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid request body', { status: 400 });
    }

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        stream: true,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'You are Arc Copilot, an AI assistant for stablecoin treasury operations, risk monitoring, and payment routing. Keep replies concise and actionable.'
          },
          ...messages
        ]
      })
    });

    if (!upstream.ok || !upstream.body) {
      const errorText = await upstream.text();
      return new Response(errorText || 'Groq request failed', { status: upstream.status || 500 });
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return new Response(message, { status: 500 });
  }
}
