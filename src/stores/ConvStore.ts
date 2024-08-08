import Message from "@/types/Message";
import { create } from "zustand";

interface ConvStore {
  id: string | null;
  status: "Idle" | "Responding" | "Error";
  title: string;
  messages: Message[];
  setId: (id: string | null) => void;
  setStatus: (status: "Idle" | "Responding" | "Error") => void;
  setTitle: (title: string) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

const useConvStore = create<ConvStore>((set) => ({
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

export default useConvStore;
