import { useMutation } from '@tanstack/react-query';
import { useBoundStore } from '../store/useBoundStore';
import { CropParams, cropWithFFMPEG } from 'helpers/cropWithFFMPEG';
import { CroppedVideo } from '@store/createVideoSlice';

export function useCropVideoMutation() {
  const addCroppedVideo = useBoundStore(
    (state: { addCroppedVideo: (video: CroppedVideo) => void }) => state.addCroppedVideo
  );

  return useMutation<string, Error, CropParams>({
    mutationFn: async (params: CropParams): Promise<string> => {
      const outputUri = await cropWithFFMPEG(params);
      return outputUri;
    },
    onSuccess: (outputUri: string, variables: CropParams) => {
      addCroppedVideo({
        id: variables.id,
        uri: outputUri,
        startTime: variables.start,
        endTime: variables.end,
        name: '',
        description: '',
      });
    },
    onError: (error: Error) => {
      console.error('Video cropping process error:', error);
    },
  });
}