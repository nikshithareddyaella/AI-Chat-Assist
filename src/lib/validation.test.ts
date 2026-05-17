import { describe, expect, it } from "vitest";
import { validateMessage } from "@/lib/validation";

describe("validateMessage", () => {
  it("rejects empty input", () => {
    expect(validateMessage("")).toBe("Please enter a message before sending.");
    expect(validateMessage("   ")).toBe("Please enter a message before sending.");
  });

  it("accepts valid input", () => {
    expect(validateMessage("Hello")).toBeNull();
    expect(validateMessage("  trimmed  ")).toBeNull();
  });

  it("rejects overly long input", () => {
    const longMessage = "a".repeat(4001);
    expect(validateMessage(longMessage)).toMatch(/4000 characters/);
  });
});
