"use client";

import { formatMessageTime } from "@/lib/format";

interface MessageTimestampProps {
  createdAt: number;
}

export function MessageTimestamp({ createdAt }: MessageTimestampProps) {
  return (
    <time dateTime={new Date(createdAt).toISOString()} suppressHydrationWarning>
      {formatMessageTime(createdAt)}
    </time>
  );
}
