"use client";

import { useState } from "react";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ErrorBanner } from "@/components/ErrorBanner";
import { MessageList } from "@/components/MessageList";
import { useChat } from "@/hooks/useChat";

export function ChatApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    messages,
    conversations,
    activeConversationId,
    isLoading,
    streamPhase,
    error,
    hydrated,
    sendMessage,
    startNewChat,
    selectConversation,
    deleteConversation,
    clearChat,
    dismissError,
    editMessage,
  } = useChat();

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;
  const headerTitle = activeConversation?.title ?? "New chat";

  return (
    <div className="app-backdrop flex h-dvh overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={startNewChat}
        onSelect={selectConversation}
        onDelete={deleteConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          title={headerTitle}
          isLoading={isLoading}
          streamPhase={streamPhase}
          canClearChat={messages.length > 0}
          onMenuClick={() => setSidebarOpen(true)}
          onClearChat={clearChat}
        />

        {error ? (
          <div className="mx-auto w-full max-w-4xl px-4 pt-4 sm:px-6">
            <ErrorBanner message={error} onDismiss={dismissError} />
          </div>
        ) : null}

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            streamPhase={streamPhase}
            hydrated={hydrated}
            onSuggestion={sendMessage}
            onEditMessage={editMessage}
          />
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
