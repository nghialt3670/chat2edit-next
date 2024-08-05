import { create } from "zustand";

interface ChatFormStore {
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  addFile: (fileId: string) => void;
  removeFile: (fileId: string) => void;
}

const useChatFormStore = create<ChatFormStore>((set) => ({
  fileIds: [],
  setFileIds: (fileIds) => set({ fileIds }),
  addFile: (fileId) =>
    set((state) => ({ fileIds: [...state.fileIds, fileId] })),
  removeFile: (fileId) =>
    set((state) => ({ fileIds: state.fileIds.filter((id) => id != fileId) })),
}));

export default useChatFormStore;
