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
  getCroppedVideo: (id: string) => CroppedVideo | undefined;
  removeCroppedVideo: (id: string) => void;
}

export const createVideoSlice: StateCreator<VideoSlice> = (set, get) => ({
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

  getCroppedVideo: (id) => {
    return get().croppedVideos.find((video) => video.id === id);
  },

  removeCroppedVideo: (id) => {
    set((state) => ({
      croppedVideos: state.croppedVideos.filter((video) => video.id !== id),
    }));
  },
});
