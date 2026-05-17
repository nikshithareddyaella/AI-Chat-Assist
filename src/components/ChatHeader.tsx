import { MenuIcon, SparklesIcon, TrashIcon } from "@/components/icons";

import type { StreamPhase } from "@/lib/types";

interface ChatHeaderProps {
  title: string;
  isLoading: boolean;
  streamPhase: StreamPhase;
  canClearChat: boolean;
  onMenuClick: () => void;
  onClearChat: () => void;
}

function statusLabel(isLoading: boolean, streamPhase: StreamPhase): string {
  if (!isLoading) {
    return "Ready · Gemini or Groq";
  }

  if (streamPhase === "thinking") {
    return "Thinking…";
  }

  if (streamPhase === "streaming") {
    return "Writing response…";
  }

  return "Generating response…";
}

export function ChatHeader({
  title,
  isLoading,
  streamPhase,
  canClearChat,
  onMenuClick,
  onClearChat,
}: ChatHeaderProps) {
  const clearDisabled = !canClearChat || isLoading;

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 md:hidden"
            aria-label="Open chat history"
          >
            <MenuIcon />
          </button>

          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 sm:flex">
            <SparklesIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold tracking-tight text-zinc-50">{title}</h1>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                  isLoading ? "animate-pulse bg-amber-400" : "bg-emerald-400"
                }`}
                aria-hidden="true"
              />
              <p className="truncate text-xs text-zinc-500">
                {statusLabel(isLoading, streamPhase)}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearChat}
          disabled={clearDisabled}
          title={clearDisabled ? "Send a message first to clear this chat" : "Clear all messages in this chat"}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-600 bg-zinc-800/80 px-2.5 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:border-zinc-700/80 disabled:bg-zinc-900/60 disabled:text-zinc-500 sm:gap-2 sm:px-3 sm:text-sm"
          aria-label="Clear chat"
        >
          <TrashIcon className="h-4 w-4 shrink-0" />
          <span>Clear</span>
        </button>
      </div>
    </header>
  );
}
