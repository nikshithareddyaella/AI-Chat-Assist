"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { copyTextToClipboard } from "@/lib/clipboard";
import { extractTextFromReactNode } from "@/lib/markdown";
import type { ReactNode } from "react";

interface CodeBlockProps {
  children: ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeText = extractTextFromReactNode(children).replace(/\n$/, "");

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(codeText);
    if (!ok) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group/code relative my-3">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-zinc-900/90 px-2 py-1 text-xs font-medium text-zinc-300 opacity-0 transition hover:bg-zinc-800 hover:text-zinc-100 group-hover/code:opacity-100 focus:opacity-100"
        aria-label={copied ? "Copied code" : "Copy code"}
      >
        {copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-400" /> : <CopyIcon className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950 p-4 pt-10 text-sm leading-relaxed text-zinc-200">
        {children}
      </pre>
    </div>
  );
}
