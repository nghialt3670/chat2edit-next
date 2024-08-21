import { RefObject } from "react";

import { create } from "zustand";

interface MessageListStore {
  ref: RefObject<HTMLUListElement> | null;
  setRef: (ref: RefObject<HTMLUListElement>) => void;
  scrollToBottom: () => void;
  scrollToTop: () => void;
}

const useMessageListStore = create<MessageListStore>((set, get) => ({
  ref: null,
  setRef: (ref: RefObject<HTMLUListElement>) => set({ ref }),
  scrollToBottom: () => {
    const { ref } = get();
    if (ref && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  },
  scrollToTop: () => {
    const { ref } = get();
    if (ref && ref.current) {
      ref.current.scrollTop = 0;
    }
  },
}));

export default useMessageListStore;
