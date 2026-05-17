import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage } from "@/lib/types";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({ model: modelName });
}

function toGeminiHistory(history: Pick<ChatMessage, "role" | "content">[]) {
  return history.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

export function isGeminiQuotaError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("429") ||
    message.includes("Too Many Requests") ||
    message.includes("quota") ||
    message.includes("Quota exceeded")
  );
}

export function formatGeminiError(error: unknown): Error {
  if (isGeminiQuotaError(error)) {
    return new Error(
      "Gemini free-tier quota exceeded for this model. Set AI_PROVIDER=groq and add GROQ_API_KEY in .env.local, or wait and retry later.",
    );
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Something went wrong while contacting Gemini.");
}

export async function generateGeminiReply(
  message: string,
  history: Pick<ChatMessage, "role" | "content">[] = [],
): Promise<string> {
  const model = getModel();
  const chat = model.startChat({
    history: toGeminiHistory(history),
  });

  const result = await chat.sendMessage(message);
  const text = result.response.text().trim();

  if (!text) {
    throw new Error("The model returned an empty response. Please try again.");
  }

  return text;
}

export async function* streamGeminiReply(
  message: string,
  history: Pick<ChatMessage, "role" | "content">[] = [],
): AsyncGenerator<string> {
  const model = getModel();
  const chat = model.startChat({
    history: toGeminiHistory(history),
  });

  const result = await chat.sendMessageStream(message);

  for await (const chunk of result.stream) {
    try {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    } catch {
      // Some chunks have no text (safety filters, metadata only)
    }
  }
}
