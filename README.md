# 🤖 AI Chat Assist

> A modern AI-powered chat assistant built with **Next.js**, **TypeScript**, and **Groq/Gemini APIs**, featuring persistent chat history, markdown rendering, responsive UI, and robust error handling.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Best Practices Followed](#best-practices-followed)
- [Future Improvements](#future-improvements)

---

# 🚀 Project Overview

AI Chat Assist is a responsive and interactive AI chat application where users can communicate with an AI model in real time.

The application was developed as part of a Front-End Engineering assessment and includes:

- Clean and intuitive UI
- AI API integration
- Dynamic response rendering
- State management
- Persistent chat history
- Markdown rendering
- Error handling
- Unit testing
- Responsive design

---

# ✨ Features

## ✅ Core Features

- 💬 Real-time AI conversation interface
- ⚡ Dynamic response rendering without page refresh
- 🔄 Loading states and API error handling
- 🧠 AI integration using Groq/Gemini APIs
- 🧩 Component-based architecture
- 📱 Fully responsive UI
- 🔒 Secure API handling using backend routes
- 📝 Markdown rendering support
- 🗂 Persistent chat history using Local Storage
- 🧹 Clear Chat / Delete Chat functionality

## 🎯 Bonus Features Implemented

- Markdown response rendering
- Persistent session history
- Session management
- Unit testing
- Clean reusable components
- Responsive layout and semantic HTML

---

# 🔧 Prerequisites

Ensure the following tools are installed before running the project:

| 🛠 Tool | 🔢 Version | 🔗 Download |
| :--- | :--- | :--- |
| **Node.js** | `18+` | https://nodejs.org |
| **npm** | `9+` | https://www.npmjs.com |
| **VS Code** | `Latest` | https://code.visualstudio.com |

> 🔍 Verify installations using:

```sh
node -v
npm -v
```

---

# 🛠 Tech Stack

| 🏷 Technology | Purpose |
| :--- | :--- |
| **Next.js** | Frontend framework |
| **React** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Groq API / Gemini API** | AI integration |
| **React Markdown** | Markdown rendering |
| **Local Storage** | Persistent chat history |
| **Jest / Testing Library** | Unit testing |

---

# 🔐 Environment Variables

Create a `.env.local` file in the project root and configure the following variables:

```env
AI_PROVIDER=groq or gemini

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=groq_model_to_be_used

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini_model_to_be_used
```

## ⚙️ AI Provider Configuration

The application supports both **Groq** and **Google Gemini** AI providers.

- `AI_PROVIDER` determines the primary AI provider to be used.
- Gemini integration is implemented as an optional provider.
- If both Gemini and Groq API keys are configured:
  - The application prioritizes the **Gemini model** first.
  - Once Gemini API usage limits are reached, the application automatically falls back to the **Groq model** for uninterrupted responses.

This fallback mechanism improves reliability and ensures continuous AI interaction during API quota limitations.

⚠️ **Important:** Never expose API keys directly in frontend/client-side code. Store them securely using environment variables.

---

# 📦 Installation & Setup

Clone the repository:

```sh
git clone <your-github-repository-url>
```

Navigate to the project directory:

```sh
cd AI-Chat-Assist
```

Install dependencies:

```sh
npm install
```

---

# 🚀 Running the Application

Start the development server:

```sh
npm run dev
```

Open your browser and navigate to:

```text
http://localhost:3000
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

Create production build:

```sh
npm run build
```

---

# ✅ Best Practices Followed

- Component-based architecture
- TypeScript-based type safety
- Semantic HTML usage
- Responsive design principles
- API abstraction using backend routes
- Proper loading and error states
- Persistent state management
- Reusable UI components
- Secure environment variable handling
- Markdown rendering support
- Basic unit testing coverage

---

# 📈 Future Improvements

- User authentication
- Conversation export support
- Streaming optimization
- Advanced accessibility enhancements
- Request cancellation support
- Cloud database integration
- Multi-model AI support
