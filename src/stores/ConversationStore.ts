import Message from "@/types/Message";
import { create } from "zustand";

interface ConversationStore {
  id: string | null;
  messages: Message[];
  setId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

const useConversationStore = create<ConversationStore>((set) => ({
  id: null,
  messages: [],
  setId: (id) => set({ id: id }),
  setMessages: (messages) => set({ messages: messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useConversationStore;
