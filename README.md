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
   Add your Groq API key to `GROQ_API_KEY`.
3. Run locally:
   ```bash
   npm run dev
   ```
4. Build for production / Vercel:
   ```bash
   npm run build
   ```
