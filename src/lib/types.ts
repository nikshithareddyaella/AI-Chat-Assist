export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatStore {
  activeConversationId: string | null;
  conversations: Conversation[];
}

export interface ChatRequestBody {
  message: string;
  history?: Pick<ChatMessage, "role" | "content">[];
  stream?: boolean;
}

export type StreamPhase = "idle" | "thinking" | "streaming";

export interface ChatResponseBody {
  reply: string;
}

export interface ChatErrorBody {
  error: string;
}
