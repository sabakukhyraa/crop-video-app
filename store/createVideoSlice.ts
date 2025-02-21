import { StateCreator } from 'zustand';

export interface CroppedVideo {
  id: string;
  uri: string;
  startTime: number;
  endTime: number;
  name: string;
  description: string;
}

export interface VideoSlice {
  croppedVideos: CroppedVideo[];
  selectedVideoUri: string | null;

  // actions
  setSelectedVideoUri: (uri: string | null) => void;
  addCroppedVideo: (video: CroppedVideo) => void;
  removeCroppedVideo: (id: string) => void;
}

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  croppedVideos: [],
  selectedVideoUri: null,

  setSelectedVideoUri: (uri) => {
    set({ selectedVideoUri: uri });
  },

  addCroppedVideo: (video) => {
    set((state) => ({
      croppedVideos: [...state.croppedVideos, video],
    }));
  },

  removeCroppedVideo: (id) => {
    set((state) => ({
      croppedVideos: state.croppedVideos.filter((v) => v.id !== id),
    }));
  },
});