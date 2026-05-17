import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ChatInput } from "@/components/ChatInput";

describe("ChatInput", () => {
  it("disables submit when empty", () => {
    render(<ChatInput onSend={vi.fn()} isLoading={false} />);
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("calls onSend with input value", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn().mockResolvedValue(undefined);

    render(<ChatInput onSend={onSend} isLoading={false} />);

    await user.type(screen.getByLabelText("Your message"), "  Hello AI  ");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(onSend).toHaveBeenCalledWith("  Hello AI  ");
  });

  it("disables controls while loading", () => {
    render(<ChatInput onSend={vi.fn()} isLoading />);
    expect(screen.getByLabelText("Your message")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sending message" })).toBeDisabled();
  });
});
