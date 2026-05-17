"use client";

import { useState } from "react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { MessageActions } from "@/components/MessageActions";
import { MessageTimestamp } from "@/components/MessageTimestamp";
import { BotIcon, UserIcon } from "@/components/icons";
import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  isLoading?: boolean;
  onEditMessage?: (messageId: string, content: string) => void;
}

export function MessageBubble({
  message,
  isStreaming = false,
  isLoading = false,
  onEditMessage,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const canEdit = isUser && !isLoading && !isStreaming && Boolean(onEditMessage);
  const showActions = !isEditing && !isStreaming && message.content.length > 0;

  const cancelEdit = () => {
    setDraft(message.content);
    setIsEditing(false);
  };

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === message.content) {
      cancelEdit();
      return;
    }

    onEditMessage?.(message.id, trimmed);
    setIsEditing(false);
  };

  return (
    <article
      className={`message-enter group flex gap-3 sm:gap-4 ${
        isUser ? "flex-row-reverse" : ""
      }`}
      aria-label={isUser ? "Your message" : "Assistant message"}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 ${
          isUser
            ? "bg-zinc-700 text-zinc-200"
            : "bg-gradient-to-br from-violet-500/90 to-indigo-600 text-white"
        }`}
        aria-hidden="true"
      >
        {isUser ? <UserIcon className="h-4 w-4" /> : <BotIcon className="h-4 w-4" />}
      </div>

      <div className={`min-w-0 flex-1 ${isUser ? "flex flex-col items-end" : ""}`}>
        <div
          className={`mb-1.5 flex items-center gap-2 text-xs text-zinc-500 ${
            isUser ? "flex-row-reverse" : ""
          }`}
        >
          <span className="font-medium text-zinc-400">{isUser ? "You" : "Assistant"}</span>
          <MessageTimestamp createdAt={message.createdAt} />
        </div>

        {isEditing ? (
          <div className="w-full max-w-full sm:max-w-[90%]">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={4}
              className="w-full resize-y rounded-2xl border border-violet-500/40 bg-zinc-900 px-4 py-3 text-[0.9375rem] leading-relaxed text-zinc-100 outline-none ring-violet-500/30 focus:ring-2"
              aria-label="Edit message"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={!draft.trim()}
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
              >
                Save & resend
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`max-w-full rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed sm:max-w-[90%] ${
                isUser
                  ? "bg-zinc-800 text-zinc-100 ring-1 ring-white/10"
                  : "bg-transparent text-zinc-200"
              }`}
            >
              {isUser ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : (
                <>
                  <MarkdownContent content={message.content} />
                  {isStreaming ? (
                    <span
                      className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-violet-400 align-middle"
                      aria-hidden="true"
                    />
                  ) : null}
                </>
              )}
            </div>

            {showActions ? (
              <MessageActions
                content={message.content}
                canEdit={canEdit}
                align={isUser ? "end" : "start"}
                onEdit={() => {
                  setDraft(message.content);
                  setIsEditing(true);
                }}
              />
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}
