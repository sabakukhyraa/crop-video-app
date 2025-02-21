import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import * as FileSystem from 'expo-file-system';

const documentsDir = FileSystem.documentDirectory || ''; 

export const cropWithFFMPEG = (
  uri: string,
  start: number,
  end: number,
  id: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const outputPath = `${documentsDir}cropped-${id}.mp4`;

      const command = `-i "${uri}" -ss ${start} -to ${end} -c copy "${outputPath}"`;

      const session = await FFmpegKit.execute(command);

      const returnCode = await session.getReturnCode();

      if (ReturnCode.isSuccess(returnCode)) {
        resolve(outputPath);
      } else if (ReturnCode.isCancel(returnCode)) {
        reject(new Error('Video cropping process has canceled.'));
      } else {
        const failStackTrace = await session.getFailStackTrace();
        reject(new Error(`Video cropping error: ${failStackTrace}`));
      }
    } catch (error) {
      reject(error);
    }
  });
};