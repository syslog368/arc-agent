# arc-agent

AI-powered stablecoin research and agent infrastructure experiments built on modern web3 tooling.

## Dashboard setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenRouter key to `OPENROUTER_API_KEY`.
3. Run locally:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## AI model configuration

The chat API route uses OpenRouter:
- Base URL: `https://openrouter.ai/api/v1`
- Model: `meta-llama/llama-3.3-70b-instruct:free`

Streaming behavior is preserved via SSE from `/api/chat`.

## Vercel deployment

1. Import this repository into Vercel.
2. Set `OPENROUTER_API_KEY` in **Project Settings → Environment Variables**.
3. Deploy (Vercel runs `npm run build`).

This project is App Router + TypeScript + Tailwind and is ready for Vercel production deployment.
