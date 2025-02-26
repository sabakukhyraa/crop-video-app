import tw from "@lib/tailwind";
import { View } from "react-native";
import { Image } from "expo-image";

export default function CroppedVideoItem({
  video,
}: {
  video: { uri: string; thumbnail: string | null; id: string };
}) {
  return (
    <View style={tw.style("w-full p-4 bg-midGray")}>
      <View style={tw.style("w-40 h-40 rounded-3xl overflow-hidden")}>
        <Image
          source={{ uri: video.thumbnail || "" }}
          style={tw.style("w-full h-full")}
          placeholder={{ blurHash: "LfFGR%#rNEX7Xrxuxvba9GOXkDnl" }}
        />
      </View>
    </View>
  );
}
