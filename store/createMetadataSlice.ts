import { StateCreator } from "zustand";

export interface MetadataSlice {
  videoName: string;
  videoDescription: string;
  setVideoName: (name: string) => void;
  setVideoDescription: (desc: string) => void;
  cleanBoth: () => void;
}

export const createMetadataSlice: StateCreator<MetadataSlice> = (set) => ({
  videoName: "",
  videoDescription: "",

  setVideoName: (name) => {
    set({ videoName: name });
  },
  setVideoDescription: (desc) => {
    set({ videoDescription: desc });
  },
  cleanBoth: () => {
    set({ videoName: "", videoDescription: "" });
  },
});
