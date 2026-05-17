import { describe, expect, it } from "vitest";
import { formatMessageTime } from "@/lib/format";

describe("formatMessageTime", () => {
  it("returns a non-empty time string", () => {
    const result = formatMessageTime(Date.now());
    expect(result.length).toBeGreaterThan(0);
  });
});
