import { getThumbnailAsync } from "expo-video-thumbnails";

export const generateThumbnail = async (
  videoUri: string,
  time: number
): Promise<string | null> => {
  try {
    const { uri: thumbnailUri } = await getThumbnailAsync(videoUri, { time });
    return thumbnailUri;
  } catch (e) {
    console.warn(e);
    return null;
  }
};
