import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { CroppedVideo } from "@store/createVideoSlice";
import { useBoundStore } from "@store/useBoundStore";
import { cropWithFFMPEG } from "@helpers/cropWithFFMPEG";
import { generateThumbnail } from "@helpers/generateThumbnail";
import { router } from "expo-router";

interface MutationOutput {
  outputUri: string;
  thumbnailUri: string | null;
}

export interface CropParams {
  uri: string;
  start: number;
  id: string;
  name: string;
  description: string;
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
        name: variables.name,
        description: variables.description,
      });
      router.dismissAll();
      cleanSelectedVideo();
    },
    onError: (error: Error) => {
      console.error("Video cropping process error:", error);
    },
  });
}
