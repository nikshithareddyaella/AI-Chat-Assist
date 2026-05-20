import { encodeStreamEvent } from "@/lib/ai/stream-events";
import { generateReply, streamReply } from "@/lib/ai/provider";
import type { ChatErrorBody, ChatMessage, ChatRequestBody, ChatResponseBody } from "@/lib/types";
import { validateMessage } from "@/lib/validation";

export const runtime = "nodejs";

const REQUEST_TIMEOUT_MS = 60_000;

function jsonError(error: string, status: number) {
  return Response.json({ error } satisfies ChatErrorBody, { status });
}

function streamResponse(
  message: string,
  history: Pick<ChatMessage, "role" | "content">[],
) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const write = (event: Parameters<typeof encodeStreamEvent>[0]) => {
        controller.enqueue(encoder.encode(encodeStreamEvent(event)));
      };

      write({ type: "status", phase: "thinking" });

      try {
        let hasContent = false;

        for await (const chunk of streamReply(message, history)) {
          if (chunk) {
            hasContent = true;
            write({ type: "delta", text: chunk });
          }
        }

        if (!hasContent) {
          write({ type: "error", message: "The model returned an empty response. Please try again." });
          controller.close();
          return;
        }

        write({ type: "done" });
      } catch (error) {
        const messageText =
          error instanceof Error ? error.message : "Something went wrong while contacting the AI.";
        write({ type: "error", message: messageText });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(request: Request) {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const validationError = validateMessage(body.message ?? "");
  if (validationError) {
    return jsonError(validationError, 400);
  }

  const history = Array.isArray(body.history) ? body.history : [];
  const message = body.message.trim();
  const useStream = body.stream !== false;

  if (useStream) {
    return streamResponse(message, history);
  }

  try {
    const reply = await Promise.race([
      generateReply(message, history),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out. Please try again.")), REQUEST_TIMEOUT_MS);
      }),
    ]);

    return Response.json({ reply } satisfies ChatResponseBody);
  } catch (error) {
    const messageText =
      error instanceof Error ? error.message : "Something went wrong while contacting the AI.";

    const isConfigError =
      messageText.includes("API_KEY is not configured") ||
      messageText.includes("AI_PROVIDER");

    const isRateLimit =
      messageText.includes("quota") ||
      messageText.includes("rate limit") ||
      messageText.includes("429");

    const status = isConfigError ? 500 : isRateLimit ? 429 : 502;
    return jsonError(messageText, status);
  }
}
