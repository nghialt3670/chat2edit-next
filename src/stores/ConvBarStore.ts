import { create } from "zustand";

interface ConvBarStore {
  expanded: boolean;
  toggle: () => void;
}

const useConvBarStore = create<ConvBarStore>((set) => ({
  expanded: false,
  toggle: () => set((state) => ({ expanded: !state.expanded })),
}));

export default useConvBarStore;
