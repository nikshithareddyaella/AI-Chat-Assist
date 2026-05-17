import { MarkdownContent } from "@/components/MarkdownContent";
import { MessageTimestamp } from "@/components/MessageTimestamp";
import { BotIcon, UserIcon } from "@/components/icons";
import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === "user";

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
      </div>
    </article>
  );
}
