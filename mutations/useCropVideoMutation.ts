import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { CroppedVideo } from "@store/createVideoSlice";
import { useBoundStore } from "@store/useBoundStore";
import { CropParams, cropWithFFMPEG } from "@helpers/cropWithFFMPEG";
import { generateThumbnail } from "@helpers/generateThumbnail";

interface MutationOutput {
  outputUri: string;
  thumbnailUri: string | null;
}

export function useCropVideoMutation(): UseMutationResult<
  MutationOutput,
  Error,
  CropParams
> {
  const addCroppedVideo = useBoundStore(
    (state: { addCroppedVideo: (video: CroppedVideo) => void }) =>
      state.addCroppedVideo
  );

  const cleanSelectedVideo = useBoundStore(
    (state: { cleanSelectedVideo: () => void }) => state.cleanSelectedVideo
  );

  return useMutation<MutationOutput, Error, CropParams>({
    mutationFn: async (params: CropParams): Promise<MutationOutput> => {
      const outputUri = await cropWithFFMPEG(params);
      const thumbnailUri = await generateThumbnail(outputUri, 0);
      return {
        outputUri,
        thumbnailUri,
      };
    },
    onSuccess: (data: MutationOutput, variables: CropParams) => {
      addCroppedVideo({
        id: variables.id,
        uri: data.outputUri,
        thumbnail: data.thumbnailUri,
        name: "",
        description: "",
      });
      cleanSelectedVideo();
    },
    onError: (error: Error) => {
      console.error("Video cropping process error:", error);
    },
  });
}
