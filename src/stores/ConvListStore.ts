import ConvMetaData from "@/types/ConvMetaData";
import { create } from "zustand";

interface ConvListStore {
  groupedConvs: Record<string, ConvMetaData[]>;
  setGroupConvs: (groupedConvs: Record<string, ConvMetaData[]>) => void;
  removeConv: (convId: string) => void;
}

const useConvListStore = create<ConvListStore>(set => ({
  groupedConvs: {},
  setGroupConvs: (groupedConvs) => set({ groupedConvs }),
  removeConv: (convId) => set(state => {
    const updatedGroupedConvs = Object.fromEntries(
      Object.entries(state.groupedConvs).map(([key, convs]) => [
        key,
        convs.filter(conv => conv.id !== convId)
      ]).filter(([_, convs]) => convs.length > 0)
    );

    return { groupedConvs: updatedGroupedConvs };
  })
}));

export default useConvListStore;
