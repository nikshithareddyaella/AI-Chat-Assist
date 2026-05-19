# 🤖 AI Chat Assist

> A modern AI-powered chat assistant built with **Next.js**, **TypeScript**, and **Groq/Gemini APIs**, featuring streaming responses, multi-conversation history, markdown rendering, and secure server-side API routes.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)

**Live demo:** [https://ai-chat-assist-mu.vercel.app](https://ai-chat-assist-mu.vercel.app)  
**Repository:** [https://github.com/nikshithareddyaella/AI-Chat-Assist](https://github.com/nikshithareddyaella/AI-Chat-Assist)  
**Technical documentation (PDF):** [Docs/AIChatAssist_ProjectDocumentation.pdf](./Docs/AIChatAssist_ProjectDocumentation.pdf)

---

## 📋 Table of Contents

- [Technical Documentation](#-technical-documentation)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Tech Stack](#-tech-stack)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Deploy (Vercel)](#-deploy-vercel)
- [Testing](#-testing)
- [Best Practices Followed](#-best-practices-followed)
- [Future Improvements](#-future-improvements)

---

# 📄 Technical Documentation

Full implementation-focused technical documentation (architecture, features, provider configuration, and deployment):

**[AI Chat Assist — Complete Technical Documentation (PDF)](./Docs/AIChatAssist_ProjectDocumentation.pdf)**

---

# 🚀 Project Overview

AI Chat Assist is a responsive AI chat application where users can talk to an AI model with **streaming replies**, similar to mainstream GenAI products.

The application was developed as part of a Front-End Engineering assessment and includes:

- Clean, custom React UI (Tailwind CSS — no third-party UI component library)
- Server-side AI API integration (keys never exposed to the browser)
- Streaming (SSE) and JSON response modes
- Multi-conversation sidebar with `localStorage` persistence
- Markdown rendering, copy/edit actions, and error handling
- Unit tests (Vitest)

---

# ✨ Features

## ✅ Core Features

- 💬 Real-time AI chat with **streaming responses**
- 📂 **Multi-conversation sidebar** (new chat, switch, delete thread)
- ⚡ Dynamic message rendering without page refresh
- 🔄 Loading states (thinking / streaming) and error banners
- 🧠 AI integration via **Groq** and/or **Google Gemini**
- 🔒 Secure API handling through Next.js `/api/chat` route
- 📝 Markdown rendering (GFM + sanitization)
- 🗂 Persistent chat history in **localStorage**
- 🧹 **Clear chat** — removes messages in the active conversation (header)
- 🗑 **Delete conversation** — removes a thread from the sidebar

## 🎯 Bonus Features Implemented

- Copy message text and copy code blocks
- Edit user messages and resend (regenerates assistant reply)
- Vitest unit tests
- Responsive layout (mobile sidebar overlay + desktop layout)
- Groq fallback when Gemini hits quota limits (if both keys are configured)

---

# 🔧 Prerequisites

| Tool | Version |
| :--- | :--- |
| **Node.js** | 18+ |
| **npm** | 9+ (bundled with Node.js) |

**API keys (at least one provider):**

- **Groq:** [console.groq.com/keys](https://console.groq.com/keys)
- **Gemini (optional):** [Google AI Studio](https://aistudio.google.com/apikey)

Verify installations:

```sh
node -v
npm -v
```

---

# 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** (App Router) | Full-stack framework (UI + API routes) |
| **React 19** | UI (custom components) |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Styling |
| **Groq API / Gemini API** | AI providers (server-side) |
| **react-markdown** + remark-gfm + rehype-sanitize | Markdown rendering |
| **localStorage** | Client-side conversation persistence |
| **Vitest** + React Testing Library | Unit testing |

---

# 🔐 Environment Variables

Copy the example file and add your keys:

```sh
cp .env.example .env.local
```

Example `.env.local` (use **one** value for `AI_PROVIDER`):

```env
AI_PROVIDER=groq

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

For Gemini as the primary provider:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

## ⚙️ AI Provider Configuration

The app supports **Groq** and **Google Gemini**. Behavior is defined in `src/lib/ai/provider.ts`:

| Configuration | Primary provider |
| :--- | :--- |
| `AI_PROVIDER=groq` | **Groq** |
| `AI_PROVIDER=gemini` | **Gemini** |
| Both API keys set, `AI_PROVIDER` **not** set | Defaults to **Gemini** |
| Only `GROQ_API_KEY` set (no Gemini key) | **Groq** |

**Fallback:** When the primary provider is Gemini and a quota/rate-limit error occurs, the app automatically retries with **Groq** if `GROQ_API_KEY` is configured.

⚠️ **Important:** Never commit `.env.local` or expose API keys in client-side code. Keys are read only on the server.

---

# 📦 Installation & Setup

Clone the repository:

```sh
git clone https://github.com/nikshithareddyaella/AI-Chat-Assist.git
```

Navigate to the project directory:

```sh
cd AI-Chat-Assist
```

Install dependencies:

```sh
npm install
```

Create and configure environment variables (see [Environment Variables](#-environment-variables)):

```sh
cp .env.example .env.local
```

---

# 🚀 Running the Application

Start the development server (runs **both** the UI and API):

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

| Command | Description |
| :--- | :--- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) |

---

# 🌐 Deploy (Vercel)

1. Import the repo on [vercel.com/new](https://vercel.com/new).
2. Add the same variables as `.env.local` under **Project → Settings → Environment Variables**.
3. Deploy (Next.js is auto-detected).

Redeploy after changes:

```sh
npx vercel --prod
```

---

# 🧪 Testing

Run unit tests:

```sh
npm run test
```

Run lint checks:

```sh
npm run lint
```

Create a production build:

```sh
npm run build
```

---

# ✅ Best Practices Followed

- Component-based architecture with a dedicated `useChat` hook
- TypeScript throughout
- Semantic HTML and responsive Tailwind layout
- API keys only in server environment variables
- SSE streaming with JSON fallback
- Input validation and user-facing error messages
- Sanitized markdown output
- Unit tests for core utilities and components

---

# 📈 Future Improvements

- User authentication
- Conversation export (PDF / JSON)
- Request cancellation while streaming
- Stronger accessibility (ARIA live regions, keyboard shortcuts)
- Cloud database sync instead of `localStorage` only
- Dark/light theme toggle
