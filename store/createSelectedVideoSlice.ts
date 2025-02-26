import { StateCreator } from "zustand";

export interface SelectedVideo {
  uri: string;
  duration: number | null | undefined;
  cropStartTime?: number;
}

export interface SelectedVideoSlice {
  selectedVideo: SelectedVideo | null;
  setSelectedVideo: (uri: string, duration: number | null | undefined) => void;
  cleanSelectedVideo: () => void;
  setCropStartTime: (startTime: number) => void;
}

export const createSelectedVideoSlice: StateCreator<SelectedVideoSlice> = (set) => ({
  selectedVideo: null,
  setSelectedVideo: (uri, duration) =>
    set({ selectedVideo: { uri, duration } }),
  cleanSelectedVideo: () => set({ selectedVideo: null }),
  setCropStartTime: (startTime) =>
    set((state) => {
      if (!state.selectedVideo) return {};
      return { selectedVideo: { ...state.selectedVideo, cropStartTime: startTime } };
    }),
});