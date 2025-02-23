import {
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@lib/tailwind";
import ThemedText from "@components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@constants/Colors";
import { useBoundStore } from "@store/useBoundStore";
import { VideoView } from "expo-video";

const Crop = () => {
  return (
    <SafeAreaView
      style={tw.style(
        "flex-1",
        Platform.OS == "ios" ? "bg-darkGray" : "bg-midGray"
      )}
    >
      <View
        style={tw.style(
          "w-full py-5 items-center justify-center relative",
          Platform.OS == "ios" && "bg-midGray"
        )}
      >
        <TouchableOpacity
          style={tw.style("absolute right-5 bg-lightGray rounded-full p-1")}
          onPress={() => router.back()}
        >
          <AntDesign name="close" size={24} color={Colors.midGray} />
        </TouchableOpacity>
        <ThemedText size={20} weight={700}>
          Crop the Video
        </ThemedText>
      </View>
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />
      <View
        style={tw.style(
          "flex-1 bg-darkGray items-center justify-start gap-4 p-5"
        )}
      >
        {/* <VideoView /> */}
      </View>
    </SafeAreaView>
  );
};

export default Crop;
