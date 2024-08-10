import SendMessageRequest from "@/types/SendMessageRequest";
import { count } from "console";
import { create } from "zustand";

interface RequestStore {
  count: number;
  request: SendMessageRequest | null;
  trigger: () => void;
  reset: () => void;
  setRequest: (request: SendMessageRequest) => void;
}

const useRequestStore = create<RequestStore>((set) => ({
  count: 0,
  request: null,
  trigger: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
  setRequest: (request) => set({ request }),
}));

export default useRequestStore;
