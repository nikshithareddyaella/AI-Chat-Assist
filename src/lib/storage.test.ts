import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  CONVERSATIONS_STORAGE_KEY,
  createConversation,
  LEGACY_MESSAGES_STORAGE_KEY,
} from "@/lib/conversations";
import { loadChatStore, saveChatStore } from "@/lib/storage";
import type { ChatMessage } from "@/lib/types";

const sampleMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Hello",
    createdAt: 1_700_000_000_000,
  },
  {
    id: "2",
    role: "assistant",
    content: "Hi there!",
    createdAt: 1_700_000_000_100,
  },
];

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("saves and loads conversations", () => {
    const conversation = createConversation(sampleMessages);
    const store = {
      activeConversationId: conversation.id,
      conversations: [conversation],
    };

    saveChatStore(store);
    expect(loadChatStore()).toEqual(store);
  });

  it("migrates legacy single-chat history", () => {
    localStorage.setItem(LEGACY_MESSAGES_STORAGE_KEY, JSON.stringify(sampleMessages));

    const store = loadChatStore();
    expect(store.conversations).toHaveLength(1);
    expect(store.conversations[0].messages).toEqual(sampleMessages);
    expect(store.activeConversationId).toBe(store.conversations[0].id);
    expect(localStorage.getItem(LEGACY_MESSAGES_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(CONVERSATIONS_STORAGE_KEY)).not.toBeNull();
  });
});
