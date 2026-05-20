"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createConversation,
  createConversationTitle,
  getActiveConversation,
} from "@/lib/conversations";
import { parseSseStream } from "@/lib/stream/parse-sse";
import { createUiThrottle } from "@/lib/stream/throttle-ui";
import { loadChatStore, saveChatStore } from "@/lib/storage";
import type {
  ChatErrorBody,
  ChatMessage,
  ChatResponseBody,
  ChatStore,
  Conversation,
  StreamDraft,
  StreamPhase,
} from "@/lib/types";
import { validateMessage } from "@/lib/validation";

function generateMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createMessage(role: ChatMessage["role"], content: string, id?: string): ChatMessage {
  return {
    id: id ?? generateMessageId(),
    role,
    content,
    createdAt: Date.now(),
  };
}

function withUpdatedConversation(
  store: ChatStore,
  conversationId: string,
  updater: (conversation: Conversation) => Conversation,
): ChatStore {
  const now = Date.now();

  const conversations = store.conversations.map((conversation) => {
    if (conversation.id !== conversationId) {
      return conversation;
    }

    const updated = updater(conversation);
    return { ...updated, updatedAt: now };
  });

  return {
    activeConversationId: store.activeConversationId,
    conversations,
  };
}

function applyAssistantContent(
  store: ChatStore,
  conversationId: string,
  assistantId: string,
  content: string,
): ChatStore {
  return withUpdatedConversation(store, conversationId, (conversation) => {
    const exists = conversation.messages.some((message) => message.id === assistantId);

    if (!exists) {
      return {
        ...conversation,
        messages: [...conversation.messages, createMessage("assistant", content, assistantId)],
      };
    }

    return {
      ...conversation,
      messages: conversation.messages.map((message) =>
        message.id === assistantId ? { ...message, content } : message,
      ),
    };
  });
}

function removeAssistantMessage(
  store: ChatStore,
  conversationId: string,
  assistantId: string,
): ChatStore {
  return withUpdatedConversation(store, conversationId, (conversation) => ({
    ...conversation,
    messages: conversation.messages.filter((message) => message.id !== assistantId),
  }));
}

export function useChat() {
  const hasRestoredRef = useRef(false);
  const [store, setStore] = useState<ChatStore>({
    activeConversationId: null,
    conversations: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [streamPhase, setStreamPhase] = useState<StreamPhase>("idle");
  const [streamDraft, setStreamDraft] = useState<StreamDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const activeConversation = getActiveConversation(store);
  const messages = activeConversation?.messages ?? [];

  const displayMessages = useMemo(() => {
    if (!streamDraft) {
      return messages;
    }

    return messages.map((message) =>
      message.id === streamDraft.messageId ? { ...message, content: streamDraft.content } : message,
    );
  }, [messages, streamDraft]);

  const persistStore = useCallback((next: ChatStore) => {
    setStore(next);
    if (hasRestoredRef.current) {
      saveChatStore(next);
    }
  }, []);

  const commitStore = useCallback(
    (updater: (current: ChatStore) => ChatStore, options?: { persist?: boolean }) => {
      const persist = options?.persist !== false;

      setStore((current) => {
        const next = updater(current);
        if (hasRestoredRef.current && persist) {
          saveChatStore(next);
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const stored = loadChatStore();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only hydration
    setStore(stored);
    setHydrated(true);
    hasRestoredRef.current = true;
  }, []);

  const startNewChat = useCallback(() => {
    const conversation = createConversation();
    persistStore({
      activeConversationId: conversation.id,
      conversations: [conversation, ...store.conversations],
    });
    setError(null);
  }, [persistStore, store.conversations]);

  const selectConversation = useCallback(
    (conversationId: string) => {
      if (!store.conversations.some((c) => c.id === conversationId)) {
        return;
      }

      persistStore({
        ...store,
        activeConversationId: conversationId,
      });
      setError(null);
    },
    [persistStore, store],
  );

  const deleteConversation = useCallback(
    (conversationId: string) => {
      const remaining = store.conversations.filter((c) => c.id !== conversationId);

      if (remaining.length === 0) {
        const fresh = createConversation();
        persistStore({
          activeConversationId: fresh.id,
          conversations: [fresh],
        });
        setError(null);
        return;
      }

      const nextActive =
        store.activeConversationId === conversationId
          ? remaining[0].id
          : store.activeConversationId;

      persistStore({
        activeConversationId: nextActive,
        conversations: remaining,
      });
      setError(null);
    },
    [persistStore, store],
  );

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  const clearChat = useCallback(() => {
    if (isLoading) {
      return;
    }

    const conversationId = store.activeConversationId;
    if (!conversationId || !getActiveConversation(store)) {
      return;
    }

    persistStore(
      withUpdatedConversation(store, conversationId, (conversation) => ({
        ...conversation,
        title: "New chat",
        messages: [],
      })),
    );
    setError(null);
  }, [isLoading, persistStore, store]);

  const requestJsonReply = useCallback(
    async (message: string, history: Pick<ChatMessage, "role" | "content">[]) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, stream: false }),
      });

      const data = (await response.json()) as ChatResponseBody | ChatErrorBody;

      if (!response.ok) {
        const apiError = "error" in data ? data.error : "Failed to get a response.";
        throw new Error(apiError);
      }

      if (!("reply" in data)) {
        throw new Error("Failed to get a response.");
      }

      return data.reply;
    },
    [],
  );

  const requestAssistantReply = useCallback(
    async (
      conversationId: string,
      message: string,
      historyForApi: Pick<ChatMessage, "role" | "content">[],
    ) => {
      const assistantId = generateMessageId();
      const streamState = { content: "", receivedDelta: false };
      const draftThrottler = createUiThrottle(48);

      const pushDraftToUi = () => {
        draftThrottler.schedule(() => {
          setStreamDraft({ messageId: assistantId, content: streamState.content });
        });
      };

      const beginAssistantPlaceholder = () => {
        commitStore(
          (current) => {
            const targetId = current.activeConversationId ?? conversationId;
            if (!targetId) {
              return current;
            }

            return applyAssistantContent(current, targetId, assistantId, "");
          },
          { persist: false },
        );
        setStreamDraft({ messageId: assistantId, content: "" });
        setStreamPhase("streaming");
      };

      const persistAssistantReply = (content: string, persist: boolean) => {
        commitStore(
          (current) => {
            const targetId = current.activeConversationId ?? conversationId;
            if (!targetId) {
              return current;
            }

            return applyAssistantContent(current, targetId, assistantId, content);
          },
          { persist },
        );
      };

      const finishStream = () => {
        draftThrottler.flush();
        draftThrottler.cancel();
        setStreamDraft(null);

        if (streamState.receivedDelta) {
          persistAssistantReply(streamState.content, true);
        }
      };

      const applyJsonFallback = async () => {
        const reply = await requestJsonReply(message, historyForApi);
        persistAssistantReply(reply, true);
      };

      setIsLoading(true);
      setStreamPhase("thinking");
      setError(null);
      beginAssistantPlaceholder();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, history: historyForApi, stream: true }),
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? "Failed to get a response.");
        }

        if (!response.body) {
          throw new Error("Streaming is not supported in this browser.");
        }

        for await (const event of parseSseStream(response.body)) {
          if (event.type === "status" && event.phase === "thinking") {
            setStreamPhase("thinking");
            continue;
          }

          if (event.type === "error") {
            throw new Error(event.message);
          }

          if (event.type === "delta" && event.text) {
            streamState.receivedDelta = true;
            setStreamPhase("streaming");
            streamState.content += event.text;
            pushDraftToUi();
          }

          if (event.type === "done") {
            break;
          }
        }

        finishStream();

        if (!streamState.receivedDelta) {
          await applyJsonFallback();
        }
      } catch (err) {
        draftThrottler.cancel();
        setStreamDraft(null);

        try {
          await applyJsonFallback();
        } catch (fallbackError) {
          commitStore(
            (current) => {
              const targetId = current.activeConversationId ?? conversationId;
              if (!targetId) {
                return current;
              }

              return removeAssistantMessage(current, targetId, assistantId);
            },
            { persist: true },
          );

          const messageText =
            fallbackError instanceof Error
              ? fallbackError.message
              : err instanceof Error
                ? err.message
                : "Network error. Check your connection and try again.";
          setError(messageText);
        }
      } finally {
        setIsLoading(false);
        setStreamPhase("idle");
        setStreamDraft(null);
      }
    },
    [commitStore, requestJsonReply],
  );

  const sendMessage = useCallback(
    async (rawMessage: string) => {
      const validationError = validateMessage(rawMessage);
      if (validationError) {
        setError(validationError);
        return;
      }

      let activeId = store.activeConversationId;
      let workingStore = store;

      if (!activeId || !getActiveConversation(store)) {
        const conversation = createConversation();
        activeId = conversation.id;
        workingStore = {
          activeConversationId: conversation.id,
          conversations: [conversation, ...store.conversations],
        };
        persistStore(workingStore);
      }

      const message = rawMessage.trim();
      const userMessage = createMessage("user", message);
      const conversationId = activeId;

      let historyForApi: Pick<ChatMessage, "role" | "content">[] = [];

      const storeWithUser = withUpdatedConversation(workingStore, conversationId, (conversation) => {
        historyForApi = conversation.messages.map(({ role, content }) => ({ role, content }));
        const nextMessages = [...conversation.messages, userMessage];
        const title =
          conversation.title === "New chat"
            ? createConversationTitle(message)
            : conversation.title;

        return {
          ...conversation,
          title,
          messages: nextMessages,
        };
      });

      persistStore(storeWithUser);
      await requestAssistantReply(conversationId, message, historyForApi);
    },
    [persistStore, requestAssistantReply, store],
  );

  const editMessage = useCallback(
    async (messageId: string, rawMessage: string) => {
      if (isLoading) {
        return;
      }

      const validationError = validateMessage(rawMessage);
      if (validationError) {
        setError(validationError);
        return;
      }

      const conversationId = store.activeConversationId;
      const conversation = getActiveConversation(store);

      if (!conversationId || !conversation) {
        return;
      }

      const messageIndex = conversation.messages.findIndex((entry) => entry.id === messageId);
      if (messageIndex < 0 || conversation.messages[messageIndex]?.role !== "user") {
        return;
      }

      const message = rawMessage.trim();
      const historyForApi = conversation.messages
        .slice(0, messageIndex)
        .map(({ role, content }) => ({ role, content }));

      const firstUserIndex = conversation.messages.findIndex((entry) => entry.role === "user");
      const shouldRetitle = messageIndex === firstUserIndex;

      const storeWithEdit = withUpdatedConversation(store, conversationId, (current) => {
        const updatedUser = { ...current.messages[messageIndex], content: message };
        const nextMessages = [...current.messages.slice(0, messageIndex), updatedUser];

        return {
          ...current,
          title: shouldRetitle ? createConversationTitle(message) : current.title,
          messages: nextMessages,
        };
      });

      persistStore(storeWithEdit);
      await requestAssistantReply(conversationId, message, historyForApi);
    },
    [isLoading, persistStore, requestAssistantReply, store],
  );

  return {
    messages: displayMessages,
    conversations: store.conversations,
    activeConversationId: store.activeConversationId,
    isLoading,
    streamPhase,
    error,
    hydrated,
    sendMessage,
    editMessage,
    startNewChat,
    selectConversation,
    deleteConversation,
    clearChat,
    dismissError,
  };
}
