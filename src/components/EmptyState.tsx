"use client";

import { BotIcon, SparklesIcon } from "@/components/icons";

const SUGGESTIONS = [
  "Explain React hooks like I'm preparing for an interview",
  "Write a TypeScript function to debounce user input",
  "What are best practices for REST API error handling?",
  "Help me debug a CORS error in my frontend app",
] as const;

interface EmptyStateProps {
  onSuggestion: (text: string) => void;
  disabled?: boolean;
}

export function EmptyState({ onSuggestion, disabled }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 ring-1 ring-white/10">
        <BotIcon className="h-8 w-8 text-violet-400" />
      </div>

      <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight text-zinc-50">
        How can I help you today?
      </h2>
      <p className="mb-10 max-w-md text-center text-sm leading-relaxed text-zinc-500">
        Ask anything — code, concepts, debugging, or brainstorming. Responses support markdown,
        lists, and code blocks.
      </p>

      <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={disabled}
            onClick={() => onSuggestion(suggestion)}
            className="group flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-left text-sm text-zinc-400 transition hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SparklesIcon className="mt-0.5 h-4 w-4 shrink-0 text-violet-500/70 transition group-hover:text-violet-400" />
            <span>{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
