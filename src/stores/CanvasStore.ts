import { create } from "zustand";

interface CanvasStore {
  fileId: string | null;
  setFileId: (fileId: string | null) => void;
}

const useCanvasStore = create<CanvasStore>((set) => ({
  fileId: null,
  setFileId: (fileId) => set({ fileId }),
}));

export default useCanvasStore;
