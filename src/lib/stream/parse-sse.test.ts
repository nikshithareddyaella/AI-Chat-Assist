import { describe, expect, it } from "vitest";
import { parseSseStream } from "@/lib/stream/parse-sse";

function toStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let index = 0;

  return new ReadableStream({
    pull(controller) {
      if (index >= chunks.length) {
        controller.close();
        return;
      }

      controller.enqueue(encoder.encode(chunks[index]));
      index += 1;
    },
  });
}

describe("parseSseStream", () => {
  it("parses SSE events split across chunks", async () => {
    const stream = toStream([
      'data: {"type":"status","phase":"thinking"}\n\n',
      'data: {"type":"delta","text":"Hi"}\n\n',
      'data: {"type":"done"}\n\n',
    ]);

    const events = [];
    for await (const event of parseSseStream(stream)) {
      events.push(event);
    }

    expect(events).toHaveLength(3);
    expect(events[1]).toEqual({ type: "delta", text: "Hi" });
  });

  it("parses a final event without trailing blank line", async () => {
    const stream = toStream(['data: {"type":"done"}\n\n']);

    const events = [];
    for await (const event of parseSseStream(stream)) {
      events.push(event);
    }

    expect(events).toEqual([{ type: "done" }]);
  });
});
