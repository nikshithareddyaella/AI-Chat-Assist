import {
  CONVERSATIONS_STORAGE_KEY,
  LEGACY_MESSAGES_STORAGE_KEY,
  createConversation,
  sortConversations,
} from "@/lib/conversations";
import type { ChatMessage, ChatStore, Conversation } from "@/lib/types";

const STORAGE_EVENT = "ai-chat-assist-storage-update";

function normalizeMessage(item: unknown): ChatMessage | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Partial<ChatMessage>;

  if (
    typeof record.id !== "string" ||
    (record.role !== "user" && record.role !== "assistant") ||
    typeof record.content !== "string"
  ) {
    return null;
  }

  return {
    id: record.id,
    role: record.role,
    content: record.content,
    createdAt:
      typeof record.createdAt === "number" && Number.isFinite(record.createdAt)
        ? record.createdAt
        : Date.now(),
  };
}

function normalizeConversation(item: unknown): Conversation | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Partial<Conversation>;
  if (typeof record.id !== "string" || typeof record.title !== "string" || !Array.isArray(record.messages)) {
    return null;
  }

  const messages = record.messages
    .map(normalizeMessage)
    .filter((message): message is ChatMessage => message !== null);

  const createdAt =
    typeof record.createdAt === "number" && Number.isFinite(record.createdAt)
      ? record.createdAt
      : Date.now();
  const updatedAt =
    typeof record.updatedAt === "number" && Number.isFinite(record.updatedAt)
      ? record.updatedAt
      : createdAt;

  return {
    id: record.id,
    title: record.title.trim() || "New chat",
    messages,
    createdAt,
    updatedAt,
  };
}

function migrateLegacyMessages(): ChatStore {
  try {
    const raw = localStorage.getItem(LEGACY_MESSAGES_STORAGE_KEY);
    if (!raw) {
      return { activeConversationId: null, conversations: [] };
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { activeConversationId: null, conversations: [] };
    }

    const messages = parsed
      .map(normalizeMessage)
      .filter((message): message is ChatMessage => message !== null);

    if (messages.length === 0) {
      return { activeConversationId: null, conversations: [] };
    }

    const conversation = createConversation(messages);
    localStorage.removeItem(LEGACY_MESSAGES_STORAGE_KEY);

    return {
      activeConversationId: conversation.id,
      conversations: [conversation],
    };
  } catch {
    return { activeConversationId: null, conversations: [] };
  }
}

function normalizeStore(parsed: unknown): ChatStore {
  if (!parsed || typeof parsed !== "object") {
    return { activeConversationId: null, conversations: [] };
  }

  const record = parsed as Partial<ChatStore>;
  const conversations = Array.isArray(record.conversations)
    ? record.conversations
        .map(normalizeConversation)
        .filter((conversation): conversation is Conversation => conversation !== null)
    : [];

  const sorted = sortConversations(conversations);
  const activeConversationId =
    typeof record.activeConversationId === "string" &&
    sorted.some((conversation) => conversation.id === record.activeConversationId)
      ? record.activeConversationId
      : sorted[0]?.id ?? null;

  return {
    activeConversationId,
    conversations: sorted,
  };
}

export function loadChatStore(): ChatStore {
  if (typeof window === "undefined") {
    return { activeConversationId: null, conversations: [] };
  }

  try {
    const raw = localStorage.getItem(CONVERSATIONS_STORAGE_KEY);
    if (!raw) {
      const migrated = migrateLegacyMessages();
      if (migrated.conversations.length > 0) {
        saveChatStore(migrated);
      }
      return migrated;
    }

    return normalizeStore(JSON.parse(raw));
  } catch {
    return { activeConversationId: null, conversations: [] };
  }
}

export function saveChatStore(store: ChatStore): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload: ChatStore = {
      activeConversationId: store.activeConversationId,
      conversations: sortConversations(store.conversations),
    };

    localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Quota exceeded or private browsing
  }
}

export function subscribeToStorage(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = () => callback();
  window.addEventListener(STORAGE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(STORAGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
