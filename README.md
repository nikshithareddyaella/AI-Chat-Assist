# AI Chat Assist

A responsive AI chat assistant built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Google Gemini**. Includes loading states, error handling, session chat history (`localStorage`), markdown rendering, and unit tests.

## Features

- Chat UI with text input and send button
- Server-side API route (API key never exposed to the browser)
- Dynamic message rendering without page reload
- Loading indicator and error banners
- Persistent session history + clear chat
- Markdown support for assistant replies (GFM + sanitization)

## Prerequisites

- Node.js 18+
- **Groq**: [console.groq.com/keys](https://console.groq.com/keys) — free, no credit card
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

   **If you see Gemini 429 / quota errors**, use Groq:

   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=your_groq_key_here
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

   Or use Gemini (default model `gemini-2.5-flash`):

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

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run start`| Run production server    |
| `npm run test` | Run unit tests           |
| `npm run lint` | Run ESLint               |

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

4. Deploy. Vercel runs `npm run build` automatically for Next.js.

**CLI (optional):** with [Vercel CLI](https://vercel.com/docs/cli) installed and logged in:

```bash
npx vercel --prod
```

Add the same env vars when prompted or in the Vercel dashboard before the first production deploy.

## Architecture

```text
Browser (React client components)
  → POST /api/chat
  → Gemini API (server-side)
  → JSON reply → UI updates via React state
```

Chat history is stored in `localStorage` on the client only.

## Tech stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Google Generative AI SDK
- react-markdown + remark-gfm + rehype-sanitize
- Vitest + React Testing Library
