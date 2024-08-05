import Message from "@/types/Message";
import { create } from "zustand";

interface ConversationStore {
  id: string | null;
  status: "Idle" | "Responding";
  messages: Message[];
  setId: (id: string | null) => void;
  setStatus: (status: "Idle" | "Responding") => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

const useConversationStore = create<ConversationStore>((set) => ({
  id: null,
  status: "Idle",
  messages: [],
  setId: (id) => set({ id: id }),
  setStatus: (status) => set({ status: status }),
  setMessages: (messages) => set({ messages: messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useConversationStore;
