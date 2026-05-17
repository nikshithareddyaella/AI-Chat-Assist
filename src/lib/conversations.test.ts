import { describe, expect, it } from "vitest";
import { createConversationTitle } from "@/lib/conversations";

describe("createConversationTitle", () => {
  it("returns New chat when empty", () => {
    expect(createConversationTitle()).toBe("New chat");
    expect(createConversationTitle("   ")).toBe("New chat");
  });

  it("truncates long titles", () => {
    const long = "a".repeat(50);
    expect(createConversationTitle(long)).toMatch(/…$/);
    expect(createConversationTitle(long).length).toBeLessThanOrEqual(43);
  });

  it("uses the user message as title", () => {
    expect(createConversationTitle("Explain React hooks")).toBe("Explain React hooks");
  });
});
