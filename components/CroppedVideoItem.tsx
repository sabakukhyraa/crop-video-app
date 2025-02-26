import tw from "@lib/tailwind";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { CroppedVideo } from "@store/createVideoSlice";
import ThemedText from "./ThemedText";
import Colors from "@constants/Colors";
import BaseButton from "./BaseButton";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function CroppedVideoItem({ video }: { video: CroppedVideo }) {
  return (
    <View
      style={tw.style("rounded-xl bg-midGray overflow-hidden", {
        width: (Dimensions.get("window").width - 60) / 2,
      })}
    >
      <View style={tw.style("w-full")}>
        <TouchableOpacity
          style={tw`relative w-full max-h-[160px] items-center justify-center`}
          onPress={() => router.push(`/details/${video.id}`)}
        >
          <Image
            source={{ uri: video.thumbnail || "" }}
            style={tw.style("w-full h-full")}
            placeholder={{ blurHash: "LfFGR%#rNEX7Xrxuxvba9GOXkDnl" }}
            contentPosition="center"
          />
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.1)", Colors.darkGray]}
            locations={[0, 1]}
            style={tw`absolute top-0 left-0 w-full h-full z-10`}
          />
          <Entypo
            style={tw`absolute z-20`}
            name="controller-play"
            size={54}
            color={Colors.lightGray}
          />
        </TouchableOpacity>
        <View style={tw`flex-1 p-3 items-center gap-3`}>
          <View>
            <ThemedText size={16} weight={600} color={Colors.lightGray}>
              {video.name}
            </ThemedText>
          </View>
          <ThemedText
            size={12}
            weight={300}
            color={Colors.lightGray}
            style={tw`text-start self-start`}
          >
            {video.description}
          </ThemedText>
          <TouchableOpacity
            style={tw.style(
              "button-icon bg-lightGray rounded-lg w-full px-2 h-7 items-center justify-center self-end"
            )}
            onPress={() => router.push(`/edit/${video.id}`)}
          >
            <Feather name="edit" size={14} color={Colors.darkGray} />
            <ThemedText color={Colors.darkGray} weight={500} lineHeight={17}>
              Edit
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
