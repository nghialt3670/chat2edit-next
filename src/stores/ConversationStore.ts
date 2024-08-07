import Message from "@/types/Message";
import { create } from "zustand";

interface ConversationStore {
  id: string | null;
  status: "Idle" | "Requesting" | "Responding" | "Error";
  title: string;
  messages: Message[];
  setId: (id: string | null) => void;
  setStatus: (status: "Idle" | "Requesting" | "Responding" | "Error") => void;
  setTitle: (title: string) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

const useConversationStore = create<ConversationStore>((set) => ({
  id: null,
  status: "Idle",
  title: "New Conversation",
  messages: [],
  setId: (id) => set({ id: id }),
  setStatus: (status) => set({ status: status }),
  setTitle: (title) => set({ title }),
  setMessages: (messages) => set({ messages: messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useConversationStore;
