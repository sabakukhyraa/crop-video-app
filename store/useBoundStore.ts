import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

import { createVideoSlice, VideoSlice } from './createVideoSlice';
import { createMetadataSlice, MetadataSlice } from './createMetadataSlice';

export type AppState = VideoSlice & MetadataSlice;

export const useBoundStore = create<AppState>()(
  devtools(
    persist(
      (...args) => ({
        ...createVideoSlice(...args),
        ...createMetadataSlice(...args),
      }),
      {
        name: 'video-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);