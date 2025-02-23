import tw from "@lib/tailwind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { generateThumbnail } from "@helpers/generateThumbnail";

export default function CroppedVideoItem({
  video,
}: {
  video: { uri: string; id: string };
}) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const thumbnailImage = await generateThumbnail(video.uri, 0);
      setImage(thumbnailImage);
    })();
  }, [video]);

  return (
    <View style={tw.style("w-full p-4 bg-midGray")}>
      <View style={tw.style("w-40 h-40 rounded-3xl overflow-hidden")}>
        <Image
          source={{ uri: image || "" }}
          style={tw.style("w-full h-full")}
          placeholder={{ blurHash: "LfFGR%#rNEX7Xrxuxvba9GOXkDnl" }}
        />
      </View>
    </View>
  );
}
