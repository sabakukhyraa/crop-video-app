import BaseButton from "@components/BaseButton";
import ThemedText from "@components/ThemedText";
import tw from "@lib/tailwind";
import { FlatList, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import Colors from "constants/Colors";
import { StatusBar } from "expo-status-bar";
import { useBoundStore } from "@store/useBoundStore";
import CroppedVideoItem from "@components/CroppedVideoItem";
import { router } from "expo-router";

export default function App() {
  const croppedVideos = useBoundStore((state) => state.croppedVideos);

  return (
    <SafeAreaView style={tw.style("flex-1 bg-darkGray")} edges={["top"]}>
      <View
        style={tw.style(
          "w-full py-5 items-center justify-center relative bg-darkGray"
        )}
      >
        <ThemedText size={20} weight={700}>
          Cropped Videos
        </ThemedText>
      </View>
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />
      <StatusBar style="light" />
      <View style={tw.style("container bg-midGray gap-4")}>
        {croppedVideos.length > 0 ? (
          <FlatList
            data={croppedVideos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CroppedVideoItem
                video={{
                  uri: item.uri,
                  thumbnail: item.thumbnail,
                  id: item.id,
                  name: item.name,
                  description: item.description,
                }}
              />
            )}
            numColumns={2}
            columnWrapperStyle={tw`gap-4`}
            contentContainerStyle={tw.style("w-full gap-4")}
            style={tw`w-full`}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          />
        ) : (
          <View style={tw`flex-1 justify-center`}>
            <ThemedText size={16} weight={700}>
              No videos yet.
            </ThemedText>
          </View>
        )}
        <BaseButton
          onPress={() => router.push("/video-modals/select")}
          style={tw.style("button-icon", Platform.OS == "ios" && "mb-2")}
        >
          <Entypo name="folder-video" size={16} color="black" />
          <ThemedText
            color={Colors.darkGray}
            weight={500}
            size={16}
            lineHeight={18}
          >
            Crop a video
          </ThemedText>
        </BaseButton>
      </View>
    </SafeAreaView>
  );
}
