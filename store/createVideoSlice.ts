import { StateCreator } from "zustand";

export interface CroppedVideo {
  id: string;
  uri: string;
  thumbnail: string | null;
  name: string;
  description: string;
}

interface SelectedVideo {
  uri: string;
  duration: number | null | undefined;
  cropStartTime?: number;
}

export interface VideoSlice {
  croppedVideos: CroppedVideo[];
  selectedVideo: SelectedVideo | null;

  setSelectedVideo: (uri: string, duration: number | null | undefined) => void;
  cleanSelectedVideo: () => void;
  setCropStartTime: (startTime: number) => void;
  addCroppedVideo: (video: CroppedVideo) => void;
  removeCroppedVideo: (id: string) => void;
}

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  croppedVideos: [],
  selectedVideo: null,

  setSelectedVideo: (uri: string, duration: number | null | undefined) => {
    set({
      selectedVideo: { uri, duration },
    });
  },

  cleanSelectedVideo: () => {
    set({ selectedVideo: null });
  },

  setCropStartTime: (startTime: number) => {
    set((state) => {
      if (!state.selectedVideo) {
        return state;
      }
      return {
        selectedVideo: {
          ...state.selectedVideo,
          cropStartTime: startTime,
        },
      };
    });
  },

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
