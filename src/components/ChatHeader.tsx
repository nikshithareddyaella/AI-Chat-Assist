import { MenuIcon, SparklesIcon } from "@/components/icons";

import type { StreamPhase } from "@/lib/types";

interface ChatHeaderProps {
  title: string;
  isLoading: boolean;
  streamPhase: StreamPhase;
  onMenuClick: () => void;
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
  onMenuClick,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-white/[0.08] bg-zinc-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 md:hidden"
          aria-label="Open chat history"
        >
          <MenuIcon />
        </button>

        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 sm:flex">
          <SparklesIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
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
    </header>
  );
}
