# AI Chat Assist

A responsive AI chat app built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Supports streaming replies, multi-conversation history, markdown, and server-side **Gemini** or **Groq** providers.

## Features

- Chat UI with streaming responses and loading states
- Server-side `/api/chat` route (API keys never exposed to the browser)
- Multi-conversation sidebar with `localStorage` persistence
- Copy messages and code blocks; edit user messages and resend
- Markdown rendering for assistant replies (GFM + sanitization)
- Unit tests (Vitest)

## Prerequisites

- Node.js 18+
- **Groq**: [console.groq.com/keys](https://console.groq.com/keys) — free tier available
- **Gemini** (optional): [Google AI Studio](https://aistudio.google.com/apikey)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and add your keys:

   ```bash
   cp .env.example .env.local
   ```

   **Groq (recommended if Gemini quota errors):**

   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=your_groq_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

   **Gemini:**

   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

   If both keys are set, Gemini quota errors automatically fall back to Groq.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## npm commands

| Command          | Description           |
| ---------------- | --------------------- |
| `npm run dev`    | Start dev server      |
| `npm run build`  | Production build      |
| `npm run start`  | Run production server |
| `npm run test`   | Run unit tests        |
| `npm run lint`   | Run ESLint            |

## Deploy (Vercel)

1. Push this repo to GitHub ([AI-Chat-Assist](https://github.com/nikshithareddyaella/AI-Chat-Assist)).
2. Import the project on [Vercel](https://vercel.com/new) and select the repository.
3. Add environment variables (Project → Settings → Environment Variables):

   **Groq (recommended):**

   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=your_groq_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

   **Or Gemini:**

   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. Deploy. Vercel detects Next.js and runs `npm run build` automatically.

**CLI (optional):** with [Vercel CLI](https://vercel.com/docs/cli) installed and logged in:

```bash
npx vercel --prod
```

## Architecture

```text
Browser (React client)
  → POST /api/chat (SSE stream or JSON)
  → Gemini / Groq (server-side)
  → UI updates via React state + localStorage
```

Chat history is stored in the browser only (`localStorage`).

## Tech stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Google Generative AI SDK + Groq REST API
- react-markdown + remark-gfm + rehype-sanitize
- Vitest + React Testing Library
