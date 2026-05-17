"use client";

import { CopyButton } from "@/components/CopyButton";
import { PencilIcon } from "@/components/icons";

interface MessageActionsProps {
  content: string;
  canEdit: boolean;
  align?: "start" | "end";
  onEdit: () => void;
}

const actionButtonClass =
  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300";

export function MessageActions({
  content,
  canEdit,
  align = "start",
  onEdit,
}: MessageActionsProps) {
  return (
    <div
      className={`mt-1 flex items-center gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 ${
        align === "end" ? "justify-end" : "justify-start"
      }`}
    >
      <CopyButton
        text={content}
        label="Copy message"
        copiedLabel="Copied"
        className={actionButtonClass}
      />
      {canEdit ? (
        <button type="button" onClick={onEdit} className={actionButtonClass} aria-label="Edit message">
          <PencilIcon className="h-3.5 w-3.5" />
          Edit
        </button>
      ) : null}
    </div>
  );
}
