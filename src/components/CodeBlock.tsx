"use client";

import { CopyButton } from "@/components/CopyButton";
import { extractTextFromReactNode } from "@/lib/markdown";
import type { ReactNode } from "react";

interface CodeBlockProps {
  children: ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  const codeText = extractTextFromReactNode(children).replace(/\n$/, "");

  return (
    <div className="group/code relative my-3">
      <CopyButton
        text={codeText}
        label="Copy code"
        copiedLabel="Copied"
        className="absolute right-2 top-2 z-10 opacity-0 transition group-hover/code:opacity-100 focus:opacity-100"
      />
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950 p-4 pt-10 text-sm leading-relaxed text-zinc-200">
        {children}
      </pre>
    </div>
  );
}
