import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { CroppedVideo } from '@store/createVideoSlice';
import { useBoundStore } from '@store/useBoundStore';
import { CropParams, cropWithFFMPEG } from '@helpers/cropWithFFMPEG';

export function useCropVideoMutation(): UseMutationResult<
  string,
  Error,
  CropParams
> {
  const addCroppedVideo = useBoundStore(
    (state: { addCroppedVideo: (video: CroppedVideo) => void }) => state.addCroppedVideo
  );

  const setSelectedVideoUri = useBoundStore(
    (state: { setSelectedVideoUri: (uri: string | null) => void }) => state.setSelectedVideoUri
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
      setSelectedVideoUri(null)
    },
    onError: (error: Error) => {
      console.error('Video cropping process error:', error);
    },
  });
}