import { create } from "zustand";

interface MessageFormStore {
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  addFileId: (fileId: string) => void;
  removeFileId: (fileId: string) => void;
}

const useMessageFormStore = create<MessageFormStore>((set) => ({
  fileIds: [],

  setFileIds: (fileIds: string[]) => set({ fileIds }),

  addFileId: (fileId: string) =>
    set((state) => ({
      fileIds: state.fileIds.includes(fileId)
        ? state.fileIds
        : [...state.fileIds, fileId],
    })),

  removeFileId: (fileId: string) =>
    set((state) => ({
      fileIds: state.fileIds.filter((id) => id !== fileId),
    })),
}));

export default useMessageFormStore;
