export type StreamStatusPhase = "thinking";

export type StreamEvent =
  | { type: "status"; phase: StreamStatusPhase }
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

export function encodeStreamEvent(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}
