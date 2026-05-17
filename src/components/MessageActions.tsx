"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, PencilIcon } from "@/components/icons";
import { copyTextToClipboard } from "@/lib/clipboard";

interface MessageActionsProps {
  content: string;
  canEdit: boolean;
  onEdit: () => void;
}

export function MessageActions({ content, canEdit, onEdit }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(content);
    if (!ok) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-center gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 ${
        copied ? "opacity-100" : ""
      }`}
    >
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        aria-label={copied ? "Copied message" : "Copy message"}
      >
        {copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-400" /> : <CopyIcon className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      {canEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
          aria-label="Edit message"
        >
          <PencilIcon className="h-3.5 w-3.5" />
          Edit
        </button>
      ) : null}
    </div>
  );
}
