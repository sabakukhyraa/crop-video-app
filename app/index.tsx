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
      <View style={tw.style("container gap-4")}>
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
                  name: item.name,
                  description: item.description,
                }}
              />
            )}
            numColumns={2}
            columnWrapperStyle={tw`gap-4`}
            contentContainerStyle={tw.style("w-full gap-4")}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          />
        )}
        <View style={tw`flex-1`} />
        <BaseButton
          onPress={() => router.push("/video-modals/select")}
          style={tw.style("button-icon")}
        >
          <Entypo name="folder-video" size={16} color="black" />
          <ThemedText color={Colors.darkGray} weight={500} size={16}>
            Crop a video
          </ThemedText>
        </BaseButton>
      </View>
    </SafeAreaView>
  );
}
