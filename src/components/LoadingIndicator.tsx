import { BotIcon } from "@/components/icons";
import type { StreamPhase } from "@/lib/types";

interface LoadingIndicatorProps {
  phase: StreamPhase;
}

export function LoadingIndicator({ phase }: LoadingIndicatorProps) {
  const isThinking = phase === "thinking";

  return (
    <article
      className="message-enter flex gap-3 sm:gap-4"
      role="status"
      aria-live="polite"
      aria-label={isThinking ? "Assistant is thinking" : "Assistant is writing"}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/90 to-indigo-600 text-white ring-1 ring-white/10"
        style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
        aria-hidden="true"
      >
        <BotIcon className="h-4 w-4" />
      </div>

      <div className="flex flex-col gap-2 pt-1">
        <span className="text-xs font-medium text-violet-300/90">
          {isThinking ? "Thinking…" : "Writing…"}
        </span>
        <div className="flex items-center gap-1.5 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />
        </div>
      </div>
    </article>
  );
}
