import Chat from "@/types/Chat";
import { create } from "zustand";

interface ChatHistoryStore {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  removeChat: (chatId: string) => void;
  updateTitle: (chatId: string, title: string) => void;
}

const useChatHistoryStore = create<ChatHistoryStore>((set) => ({
  chats: [],

  setChats: (chats: Chat[]) => set({ chats }),

  addChat: (chat: Chat) =>
    set((state) => ({
      chats: [chat, ...state.chats],
    })),

  removeChat: (chatId: string) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== chatId),
    })),

  updateTitle: (chatId: string, title: string) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, title, updatedAt: new Date() } : chat,
      ),
    })),
}));

export default useChatHistoryStore;
