# KisanSetu AI — 5-hour hackathon starter

A React + Vite frontend and Express backend for a Tamil/English agricultural decision-support demo.

## Important demo limitations
- Mandi prices in `server/data.js` are **synthetic demo fixtures**, not live market data.
- The weather tool is a **demo notice**, not a live forecast.
- Scheme and crop content is a starter knowledge base. Verify all guidance against current official sources before real-world use.
- The AI uses Gemini function calling when `GEMINI_API_KEY` is configured. Without a key, the backend returns a demo response and sample data.

## Requirements
- Node.js LTS and npm
- Gemini API key from https://aistudio.google.com/app/apikey

## Setup
1. Unzip the project and open Terminal in the `kisansetu-ai` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file:
   ```bash
   cp .env.example .env
   ```
4. Open `.env` and replace `replace_with_your_key` with your Gemini API key.
5. Start frontend and backend:
   ```bash
   npm run dev
   ```
6. Open the Vite URL printed in Terminal, normally http://localhost:5173.

## Test prompts
- `என் நெல் பயிர் அறுவடைக்கு தயாராகிறது. என்ன கவனிக்க வேண்டும்?`
- `Compare paddy selling options for 10 quintals.`
- `What crop insurance scheme information should I check?`

## Suggested team split
- Member 1: agent/tool calling and prompt behavior.
- Member 2: backend, market calculations, data sources.
- Member 3: frontend and responsive UI.
- Member 4: curated scheme/crop documents, integration and testing.

## Next improvements
1. Replace synthetic market fixtures with current data from an official source, preserving timestamps and variety/unit compatibility.
2. Integrate an approved weather API or publish only a clear official weather link.
3. Replace demo crop guidance with curated official agricultural extension documents and source metadata.
4. Add tests for market arithmetic, API errors and language behavior.
5. Keep API keys only in `.env`; never expose them to frontend code or commit `.env`.
