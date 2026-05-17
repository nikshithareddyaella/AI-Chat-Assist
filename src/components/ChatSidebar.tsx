"use client";

import { PlusIcon, TrashIcon, XIcon } from "@/components/icons";
import type { Conversation } from "@/lib/types";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  isOpen,
  onClose,
  onNewChat,
  onSelect,
  onDelete,
}: ChatSidebarProps) {
  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          aria-label="Close sidebar"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/[0.08] bg-zinc-950 transition-transform duration-200 md:static md:z-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        aria-label="Chat history"
      >
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4">
          <h2 className="text-sm font-semibold text-zinc-100">Chats</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-200 md:hidden"
            aria-label="Close sidebar"
          >
            <XIcon />
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-200 transition hover:border-violet-500/50 hover:bg-violet-500/20"
          >
            <PlusIcon className="h-4 w-4" />
            New chat
          </button>
        </div>

        <nav className="chat-scroll flex-1 overflow-y-auto px-2 pb-4">
          {conversations.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-zinc-500">No conversations yet</p>
          ) : (
            <ul className="space-y-1">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                const preview =
                  conversation.messages[conversation.messages.length - 1]?.content ??
                  "No messages yet";

                return (
                  <li key={conversation.id}>
                    <div
                      className={`group flex items-start gap-1 rounded-lg ${
                        isActive ? "bg-white/10" : "hover:bg-white/5"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelect(conversation.id);
                          onClose();
                        }}
                        className="min-w-0 flex-1 px-3 py-2.5 text-left"
                      >
                        <p
                          className={`truncate text-sm font-medium ${
                            isActive ? "text-zinc-50" : "text-zinc-300"
                          }`}
                        >
                          {conversation.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">{preview}</p>
                        <p className="mt-1 text-[0.65rem] text-zinc-600">
                          {formatRelativeTime(conversation.updatedAt)}
                        </p>
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDelete(conversation.id);
                        }}
                        className="mt-2 mr-2 rounded-md p-1.5 text-zinc-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                        aria-label={`Delete ${conversation.title}`}
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </aside>
    </>
  );
}
