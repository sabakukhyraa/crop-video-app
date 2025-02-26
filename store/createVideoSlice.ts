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
  editCroppedVideo: (id: string, name: string, description: string) => void;
  removeCroppedVideo: (id: string) => void;
}

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  croppedVideos: [],

  addCroppedVideo: (video) => {
    set((state) => ({
      croppedVideos: [...state.croppedVideos, video],
    }));
  },

  editCroppedVideo: (id, name, description) => {
    set((state) => ({
      croppedVideos: state.croppedVideos.map((video) =>
        video.id === id ? { ...video, name, description } : video
      ),
    }));
  },

  removeCroppedVideo: (id) => {
    set((state) => ({
      croppedVideos: state.croppedVideos.filter((video) => video.id !== id),
    }));
  },
});
