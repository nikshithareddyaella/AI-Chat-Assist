import type { ChatMessage } from "@/lib/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

interface GroqChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

export async function generateGroqReply(
  message: string,
  history: Pick<ChatMessage, "role" | "content">[] = [],
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }

  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  const messages = [
    ...history.map((entry) => ({
      role: entry.role,
      content: entry.content,
    })),
    { role: "user" as const, content: message },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
    }),
  });

  const data = (await response.json()) as GroqChatResponse;

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Groq rate limit reached. Wait a moment and try again.");
    }

    throw new Error(data.error?.message ?? `Groq API error (${response.status}).`);
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("The model returned an empty response. Please try again.");
  }

  return text;
}

export async function* streamGroqReply(
  message: string,
  history: Pick<ChatMessage, "role" | "content">[] = [],
): AsyncGenerator<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server.");
  }

  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

  const messages = [
    ...history.map((entry) => ({
      role: entry.role,
      content: entry.content,
    })),
    { role: "user" as const, content: message },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      stream: true,
    }),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as GroqChatResponse;
    if (response.status === 429) {
      throw new Error("Groq rate limit reached. Wait a moment and try again.");
    }
    throw new Error(data.error?.message ?? `Groq API error (${response.status}).`);
  }

  if (!response.body) {
    throw new Error("Groq returned an empty streaming response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) {
        continue;
      }

      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") {
        return;
      }

      try {
        const parsed = JSON.parse(payload) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) {
          yield text;
        }
      } catch {
        // Skip malformed chunks
      }
    }
  }
}
