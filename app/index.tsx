import BaseButton from "@components/BaseButton";
import ThemedText from "@components/ThemedText";
import tw from "@lib/tailwind";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import Colors from "constants/Colors";
import { StatusBar } from "expo-status-bar";
import { useBoundStore } from "@store/useBoundStore";
import CroppedVideoItem from "@components/CroppedVideoItem";
import { router } from "expo-router";

export default function App() {
  // const {
  //   mutate,
  //   isPending,
  //   isError,
  //   error,
  //   data: mutationData,
  // } = useCropVideoMutation();

  const croppedVideos = useBoundStore((state) => state.croppedVideos);

  return (
    <SafeAreaView style={tw.style("flex-1 bg-darkGray")}>
      <StatusBar style="light" />
      <View style={tw.style("container")}>
        <BaseButton
          onPress={() => router.push("/video-modals/select")}
          style={tw.style("button-icon")}
        >
          <Entypo name="folder-video" size={16} color="black" />
          <ThemedText color={Colors.darkGray} weight={500} size={16}>
            Crop a video
          </ThemedText>
        </BaseButton>
        {croppedVideos.length > 0 && (
          <FlatList
            data={croppedVideos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CroppedVideoItem
                video={{
                  uri: item.uri,
                  thumbnail: item.thumbnail,
                  id: item.id,
                }}
              />
            )}
            contentContainerStyle={tw.style("w-full gap-4")}
            style={tw.style("w-full")}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
