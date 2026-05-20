"use client";

import { useEffect, useRef } from "react";
import { ChatSkeleton } from "@/components/ChatSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { MessageBubble } from "@/components/MessageBubble";
import type { ChatMessage, StreamPhase } from "@/lib/types";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  streamPhase: StreamPhase;
  hydrated: boolean;
  onSuggestion: (text: string) => void;
  onEditMessage?: (messageId: string, content: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  streamPhase,
  hydrated,
  onSuggestion,
  onEditMessage,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isLoading ? "auto" : "smooth",
    });
  }, [messages, isLoading]);

  if (!hydrated) {
    return <ChatSkeleton />;
  }

  return (
    <section
      className="chat-scroll flex-1 overflow-y-auto"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {messages.length === 0 && !isLoading ? (
        <EmptyState onSuggestion={onSuggestion} disabled={isLoading} />
      ) : (
        <ul className="mx-auto flex max-w-4xl flex-col gap-2 px-4 py-6 sm:gap-4 sm:px-6">
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const isStreamingAssistant =
              isLoading && isLast && message.role === "assistant";

            return (
              <li key={message.id}>
                <MessageBubble
                  message={message}
                  isStreaming={isStreamingAssistant}
                  isLoading={isLoading}
                  onEditMessage={onEditMessage}
                />
              </li>
            );
          })}
          {isLoading &&
          streamPhase === "thinking" &&
          (messages.length === 0 || messages[messages.length - 1]?.role !== "assistant") ? (
            <li>
              <LoadingIndicator phase="thinking" />
            </li>
          ) : null}
        </ul>
      )}
      <div ref={bottomRef} className="h-4" />
    </section>
  );
}
