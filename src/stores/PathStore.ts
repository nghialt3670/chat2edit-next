import { create } from "zustand";

interface PathStore {
  currPath: string;
  setCurrPath: (currPath: string) => void;
}

const usePathStore = create<PathStore>((set) => ({
  currPath: "/",
  setCurrPath: (currPath) => set({ currPath }),
}));

export default usePathStore;
