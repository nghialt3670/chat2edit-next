import { create } from "zustand";

interface LayoutStore {
  sidebarExpanded: boolean;
  convBarExpanded: boolean;
  toggleSidebar: () => void;
  toggleConvBar: () => void;
}

const useLayoutStore = create<LayoutStore>((set) => ({
  sidebarExpanded: true,
  convBarExpanded: true,
  toggleSidebar: () =>
    set((state) => ({
      sidebarExpanded: !state.sidebarExpanded,
    })),
  toggleConvBar: () =>
    set((state) => ({
      convBarExpanded: !state.convBarExpanded,
    })),
}));

export default useLayoutStore;
