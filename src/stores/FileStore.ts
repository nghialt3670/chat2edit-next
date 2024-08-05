import { create } from "zustand";

interface FileStore {
  idToFile: Record<string, File>;
  idToDataURL: Record<string, string>;
  contains: (fileId: string) => boolean;
  addFile: (fileId: string, file: File) => void;
  addDataURL: (fileId: string, dataURL: string) => void;
  addFiles: (fileIds: string[], files: File[]) => void;
  addDataURLs: (fileIds: string[], dataURLs: string[]) => void;
  getFile: (fileId: string) => File | undefined;
  getDataURL: (fileId: string) => string | undefined;
  getFiles: (fileIds: string[]) => (File | undefined)[];
  getDataURLs: (fileIds: string[]) => (string | undefined)[];
  removeFile: (fileId: string) => void;
  removeFiles: (fileIds: string[]) => void;
}

const useFileStore = create<FileStore>((set, get) => ({
  idToFile: {},
  idToDataURL: {},

  contains: (fileId) => {
    const state = get();
    return fileId in state.idToFile;
  },

  addFile: (fileId, file) =>
    set((state) => ({ idToFile: { ...state.idToFile, [fileId]: file } })),

  addDataURL: (fileId, dataURL) =>
    set((state) => ({
      idToDataURL: { ...state.idToDataURL, [fileId]: dataURL },
    })),

  addFiles: (fileIds, files) => {
    const newFiles = fileIds.reduce(
      (acc, fileId, index) => {
        acc[fileId] = files[index];
        return acc;
      },
      {} as Record<string, File>,
    );
    set((state) => ({ idToFile: { ...state.idToFile, ...newFiles } }));
  },

  addDataURLs: (fileIds, dataURLs) => {
    const newDataURLs = fileIds.reduce(
      (acc, fileId, index) => {
        acc[fileId] = dataURLs[index];
        return acc;
      },
      {} as Record<string, string>,
    );
    set((state) => ({ idToDataURL: { ...state.idToDataURL, ...newDataURLs } }));
  },

  getFile: (fileId) => get().idToFile[fileId],

  getDataURL: (fileId) => get().idToDataURL[fileId],

  getFiles: (fileIds) => fileIds.map((fileId) => get().idToFile[fileId]),

  getDataURLs: (fileIds) => fileIds.map((fileId) => get().idToDataURL[fileId]),

  removeFile: (fileId) => {
    set((state) => {
      const { [fileId]: _, ...remainingFiles } = state.idToFile;
      return { idToFile: remainingFiles };
    });
  },

  removeFiles: (fileIds) => {
    set((state) => {
      const newFileState = { ...state.idToFile };
      fileIds.forEach((fileId) => {
        delete newFileState[fileId];
      });
      return { idToFile: newFileState };
    });
  },
}));

export default useFileStore;
