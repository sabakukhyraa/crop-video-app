import tw from "@lib/tailwind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { getThumbnailAsync } from "expo-video-thumbnails";
import { Image } from "expo-image";

export default function CroppedVideoItem({ video }: { video: { uri: string; id: string } }) {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        setIsLoading(true)
        const { uri } = await getThumbnailAsync(
          video.uri,
          {
            time: 0,
          }
        );
        setImage(uri);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsLoading(false);
      }
    };

    generateThumbnail()

  }, [])
  

  return (
    <View style={tw.style("w-full p-4 bg-midGray")}>
      <View style={tw.style("w-40 h-40 rounded-3xl overflow-hidden")}>
      <Image source={{ uri: image }} style={tw.style("w-full h-full")} placeholder={{blurHash: "LfFGR%#rNEX7Xrxuxvba9GOXkDnl"}} />
      </View>
    </View>
  );
}