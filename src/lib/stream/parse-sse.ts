import type { StreamEvent } from "@/lib/ai/stream-events";

function parseEventBlock(block: string): StreamEvent | null {
  const line = block
    .split(/\r?\n/)
    .find((entry) => entry.startsWith("data:"))
    ?.slice(5)
    .trim();

  if (!line) {
    return null;
  }

  try {
    return JSON.parse(line) as StreamEvent;
  } catch {
    return null;
  }
}

export async function* parseSseStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<StreamEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (value) {
      buffer += decoder.decode(value, { stream: true });
    }

    const parts = buffer.split(/\r?\n\r?\n/);
    buffer = done ? "" : (parts.pop() ?? "");

    for (const part of parts) {
      const event = parseEventBlock(part);
      if (event) {
        yield event;
      }
    }

    if (done) {
      break;
    }
  }

  if (buffer.trim()) {
    const event = parseEventBlock(buffer);
    if (event) {
      yield event;
    }
  }
}
