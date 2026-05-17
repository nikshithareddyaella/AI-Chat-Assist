"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";
import { copyTextToClipboard } from "@/lib/clipboard";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  iconClassName?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className = "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-zinc-900/90 px-2 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100",
  iconClassName = "h-3.5 w-3.5",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(text);
    if (!ok) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className}
      aria-label={copied ? `${copiedLabel}` : label}
    >
      {copied ? (
        <CheckIcon className={`${iconClassName} text-emerald-400`} />
      ) : (
        <CopyIcon className={iconClassName} />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
