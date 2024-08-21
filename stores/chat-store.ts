import { create } from "zustand";

import Message from "@/types/Message";

interface ChatStore {
  id: string | null;
  status: "idle" | "responding" | "request_error" | "response_error";
  messages: Message[];
  isNew: boolean;
  setId: (id: string | null) => void;
  setStatus: (
    status: "idle" | "responding" | "request_error" | "response_error",
  ) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
  id: null,
  messages: [],
  status: "idle",
  isNew: true,

  addMessage: (message) =>
    set((state) => {
      return { messages: [...state.messages, message] };
    }),

  setMessages: (messages) =>
    set(() => ({
      messages,
    })),

  setStatus: (status) =>
    set(() => ({
      status,
    })),

  setId: (id: string | null) =>
    set(() => ({
      id,
    })),
}));

export default useChatStore;
