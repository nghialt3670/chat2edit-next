import { create } from "zustand";

interface ConvContainerStore {
  expanded: boolean;
  toggle: () => void;
}

const useConvContainerStore = create<ConvContainerStore>((set) => ({
  expanded: false,
  toggle: () => set((state) => ({ expanded: !state.expanded })),
}));

export default useConvContainerStore;
