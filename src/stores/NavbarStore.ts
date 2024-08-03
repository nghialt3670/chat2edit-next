import { create } from "zustand";

interface NavbarStore {
  expanded: boolean;
  toggle: () => void;
}

const useNavbarStore = create<NavbarStore>((set) => ({
  expanded: false,
  toggle: () => set((state) => ({ expanded: !state.expanded })),
}));

export default useNavbarStore;
