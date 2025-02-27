import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
import * as FileSystem from "expo-file-system";
import { CropParams } from "mutations/useCropVideoMutation";

const formatTime = (seconds: number) => {
  const date = new Date(seconds * 1000);
  return date.toISOString().substring(11, 23);
};

const documentsDir = FileSystem.documentDirectory || "";

export const cropWithFFMPEG = (params: CropParams): Promise<string> => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const outputPath = `${documentsDir}cropped-${params.id}.mp4`;
      const command = `-ss ${formatTime(params.start)} -i "${
        params.uri
      }" -t ${formatTime(5)} -c copy "${outputPath}"`;

      const session = await FFmpegKit.execute(command);
      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        resolve(outputPath);
      } else if (ReturnCode.isCancel(returnCode)) {
        reject(new Error("Video cropping process has been canceled."));
      } else {
        const failStackTrace = await session.getFailStackTrace();
        reject(new Error(`Video cropping error: ${failStackTrace}`));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        reject(error);
      } else {
        reject(new Error("An unknown error occurred."));
      }
    }
  });
};
