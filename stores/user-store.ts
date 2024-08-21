import { create } from "zustand";

interface UserStore {
  userId: string | null;
  avatarDataURL: string | null;
  setUserId: (userId: string | null) => void;
  setAvatarDataURL: (dataURL: string | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  userId: null,
  avatarDataURL: null,
  setUserId: (userId: string | null) => set({ userId }),
  setAvatarDataURL: (dataURL: string | null) => set({ avatarDataURL: dataURL }),
}));

export default useUserStore;
