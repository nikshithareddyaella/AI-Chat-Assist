"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { SendIcon } from "@/components/icons";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
}

const MIN_HEIGHT = 24;
const MAX_HEIGHT = 160;

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading || !input.trim()) {
      return;
    }

    const value = input;
    setInput("");
    await onSend(value);

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = `${MIN_HEIGHT}px`;
      }
    });
  }

  return (
    <div className="border-t border-white/[0.06] bg-zinc-950/90 px-4 py-4 backdrop-blur-xl sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="composer-glow mx-auto max-w-4xl rounded-2xl border border-white/10 bg-zinc-900/80 p-2 transition-shadow"
        aria-label="Send a message"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Your message
          </label>
          <textarea
            ref={textareaRef}
            id="chat-input"
            name="message"
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Message AI Chat Assist…"
            disabled={isLoading}
            className="max-h-40 min-h-6 flex-1 resize-none bg-transparent px-3 py-2.5 text-[0.9375rem] leading-relaxed text-zinc-100 placeholder:text-zinc-600 outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label={isLoading ? "Sending message" : "Send message"}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <SendIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
      <p className="mx-auto mt-2 max-w-4xl text-center text-xs text-zinc-600">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
