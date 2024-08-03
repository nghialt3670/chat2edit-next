import { create } from "zustand";

interface UserStore {
  avatarDataURL: string;
  setAvatarDataURL: (dataURL: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
  avatarDataURL: "",
  setAvatarDataURL: (dataURL) => set({ avatarDataURL: dataURL }),
}));

export default useUserStore;
