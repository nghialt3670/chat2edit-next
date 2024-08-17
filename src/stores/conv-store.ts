import Message from "@/types/Message";
import { create } from "zustand";

interface ConvStore {
  id: string | null;
  status: "isIdle" | "isResponding" | "isError";
  messages: Message[];
  isNew: boolean;
  setId: (id: string | null) => void;
  setStatus: (status: "isIdle" | "isResponding" | "isError") => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  getLastMessage: () => Message | undefined;
  setIsNew: (isNew: boolean) => void;
}

const useConvStore = create<ConvStore>((set, get) => ({
  id: null,
  messages: [],
  status: "isIdle",
  isNew: true,

  addMessage: (message: Message) =>
    set((state) => {
      return { messages: [...state.messages, message] };
    }),

  setMessages: (messages: Message[]) =>
    set(() => ({
      messages,
    })),

  setStatus: (status: "isIdle" | "isResponding" | "isError") =>
    set(() => ({
      status,
    })),

  setId: (id: string | null) =>
    set(() => ({
      id,
    })),

  getLastMessage: () => {
    const state = get();
    return state.messages[state.messages.length - 1];
  },

  setIsNew: (isNew) => set({ isNew })
}));

export default useConvStore;
