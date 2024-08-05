import { create } from "zustand";

interface LayoutStore {
  navbarExpanded: boolean;
  convBarExpanded: boolean;
  toggleNavbar: () => void;
  toggleConvBar: () => void;
}

const useLayoutStore = create<LayoutStore>((set) => ({
  navbarExpanded: false,
  convBarExpanded: false,
  toggleNavbar: () =>
    set((state) => ({
      navbarExpanded: !state.navbarExpanded,
    })),
  toggleConvBar: () =>
    set((state) => ({
      convBarExpanded: !state.convBarExpanded,
    })),
}));

export default useLayoutStore;
