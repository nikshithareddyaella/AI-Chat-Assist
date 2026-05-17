import { formatGeminiError, generateGeminiReply, isGeminiQuotaError, streamGeminiReply } from "@/lib/ai/gemini";
import { generateGroqReply, streamGroqReply } from "@/lib/ai/groq";
import type { ChatMessage } from "@/lib/types";

export type AiProvider = "gemini" | "groq";

function resolveProvider(): AiProvider {
  const configured = process.env.AI_PROVIDER?.toLowerCase();
  if (configured === "groq" || configured === "gemini") {
    return configured;
  }

  if (process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
    return "groq";
  }

  return "gemini";
}

export function getActiveProviderLabel(): string {
  return resolveProvider() === "groq" ? "Groq" : "Google Gemini";
}

export async function generateReply(
  message: string,
  history: Pick<ChatMessage, "role" | "content">[] = [],
): Promise<string> {
  const provider = resolveProvider();

  if (provider === "groq") {
    return generateGroqReply(message, history);
  }

  try {
    return await generateGeminiReply(message, history);
  } catch (error) {
    if (isGeminiQuotaError(error) && process.env.GROQ_API_KEY) {
      return generateGroqReply(message, history);
    }

    throw formatGeminiError(error);
  }
}

export async function* streamReply(
  message: string,
  history: Pick<ChatMessage, "role" | "content">[] = [],
): AsyncGenerator<string> {
  const provider = resolveProvider();

  if (provider === "groq") {
    yield* streamGroqReply(message, history);
    return;
  }

  try {
    yield* streamGeminiReply(message, history);
  } catch (error) {
    if (isGeminiQuotaError(error) && process.env.GROQ_API_KEY) {
      yield* streamGroqReply(message, history);
      return;
    }

    throw formatGeminiError(error);
  }
}
