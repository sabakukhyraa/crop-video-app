import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@lib/tailwind";
import { StatusBar } from "expo-status-bar";
import BaseButton from "@components/BaseButton";
import { router, useLocalSearchParams } from "expo-router";
import ThemedText from "@components/ThemedText";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@constants/Colors";
import { useBoundStore } from "@store/useBoundStore";
import { CroppedVideo } from "@store/createVideoSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";

const VideoDetail = () => {
  const { videoId } = useLocalSearchParams();
  const id = Array.isArray(videoId) ? videoId[0] : videoId;

  // -----------------------------------------------------
  // STATE
  // -----------------------------------------------------
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [video, setVideo] = useState<CroppedVideo | undefined>();

  const getCroppedVideo = useBoundStore(
    (state: { getCroppedVideo: (id: string) => CroppedVideo | undefined }) =>
      state.getCroppedVideo
  );
  const removeCroppedVideo = useBoundStore(
    (state: { removeCroppedVideo: (id: string) => void }) =>
      state.removeCroppedVideo
  );

  // -----------------------------------------------------
  // VIDEO PLAYER SETUP
  // -----------------------------------------------------
  const player = useVideoPlayer("", (p) => {
    p.loop = true;
    p.play();
  });

  const { muted } = useEvent(player, "mutedChange", {
    muted: player.muted,
  });

  useEffect(() => {
    try {
      setIsLoading(true);
      const theVideo = getCroppedVideo(id);
      setVideo(theVideo);
      player.replace(theVideo!.uri);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = () => {
    Alert.alert("Information", "Confirm delete?", [
      {
        text: "Delete",
        onPress: () => {
          removeCroppedVideo(id);
          router.dismissAll();
        },
        style: "destructive"
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ]);
  };

  return (
    <SafeAreaView style={tw.style("flex-1 bg-darkGray")} edges={["top"]}>
      <View
        style={tw.style(
          "w-full py-5 items-center justify-center relative bg-darkGray"
        )}
      >
        <TouchableOpacity
          style={tw.style("absolute left-5 bg-lightGray rounded-full p-1")}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.midGray} />
        </TouchableOpacity>
        <ThemedText size={20} weight={700}>
          {video?.name || "Video"}
        </ThemedText>
      </View>
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />
      <StatusBar style="light" />
      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={Colors.lightGray} />
        </View>
      ) : (
        <View style={tw.style("container p-0 bg-midGray gap-5")}>
          {/* VideoView */}
          <View style={tw.style("w-full bg-[#000] shadow-md")}>
            <VideoView
              player={player}
              style={tw.style("w-full h-[450px]")}
              contentFit="contain"
            />
            <TouchableOpacity
              style={tw.style("absolute top-5 right-5")}
              onPress={() => {
                player.muted = !player.muted;
              }}
            >
              {muted ? (
                <Ionicons
                  name="volume-mute"
                  size={32}
                  color={Colors.lightGray}
                />
              ) : (
                <Ionicons
                  name="volume-high"
                  size={32}
                  color={Colors.lightGray}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={tw`flex-1 w-full px-5 pb-5 gap-5`}>
            <ThemedText>{video?.description}</ThemedText>
            <View style={tw`flex-1`} />
            <BaseButton
              disabled={!video?.id}
              onPress={() => router.replace(`/edit/${video?.id}`)}
              style={tw.style("button-icon", Platform.OS == "ios" && "mb-2")}
            >
              <Feather name="edit" size={14} color={Colors.darkGray} />
              <ThemedText
                color={Colors.darkGray}
                weight={600}
                size={16}
                lineHeight={18}
              >
                Edit
              </ThemedText>
            </BaseButton>
            <BaseButton
              onPress={handleDelete}
              style={tw.style("button-icon", Platform.OS == "ios" && "mb-2")}
              gradientFrom="#990000"
              gradientTo="#660000"
            >
              <MaterialCommunityIcons
                name="delete"
                size={24}
                color={Colors.lightGray}
              />
              <ThemedText
                color={Colors.lightGray}
                weight={600}
                size={16}
                lineHeight={18}
              >
                Delete
              </ThemedText>
            </BaseButton>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VideoDetail;
