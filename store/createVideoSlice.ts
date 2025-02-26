import { StateCreator } from "zustand";

export interface CroppedVideo {
  id: string;
  uri: string;
  thumbnail: string | null;
  name: string;
  description: string;
}

export interface VideoSlice {
  croppedVideos: CroppedVideo[];

  addCroppedVideo: (video: CroppedVideo) => void;
  removeCroppedVideo: (id: string) => void;
}

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  croppedVideos: [],

  addCroppedVideo: (video) => {
    set((state) => ({
      croppedVideos: [...state.croppedVideos, video],
    }));
  },

  removeCroppedVideo: (id) => {
    set((state) => ({
      croppedVideos: state.croppedVideos.filter((video) => video.id !== id),
    }));
  },
});
