import { create } from "zustand";

interface SidebarStore {
  opened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  opened: false,
  open: () => set({ opened: true }),
  close: () => set({ opened: false }),
  toggle: () => set((state) => ({ opened: !state.opened })),
}));

export default useSidebarStore;
