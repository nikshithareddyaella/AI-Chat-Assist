import type { ChatMessage, ChatStore, Conversation } from "@/lib/types";

export const CONVERSATIONS_STORAGE_KEY = "ai-chat-assist-conversations";
export const LEGACY_MESSAGES_STORAGE_KEY = "ai-chat-assist-history";

export function createConversationTitle(firstUserMessage?: string): string {
  if (!firstUserMessage?.trim()) {
    return "New chat";
  }

  const trimmed = firstUserMessage.trim().replace(/\s+/g, " ");
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}…` : trimmed;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createConversation(messages: ChatMessage[] = []): Conversation {
  const now = Date.now();
  const firstUser = messages.find((message) => message.role === "user");

  return {
    id: generateId(),
    title: createConversationTitle(firstUser?.content),
    messages,
    createdAt: now,
    updatedAt: now,
  };
}

export function sortConversations(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getActiveConversation(store: ChatStore): Conversation | null {
  if (!store.activeConversationId) {
    return null;
  }

  return store.conversations.find((c) => c.id === store.activeConversationId) ?? null;
}
