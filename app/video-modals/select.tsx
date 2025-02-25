import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@lib/tailwind";
import ThemedText from "@components/ThemedText";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Colors from "@constants/Colors";
import { useBoundStore } from "@store/useBoundStore";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import ModalHeader from "@components/ModalHeader";

const Select = () => {
  const [isLoading, setIsLoading] = useState(false);

  const selectedVideo = useBoundStore((state) => state.selectedVideo);
  const setSelectedVideo = useBoundStore(
    (state: {
      setSelectedVideo: (
        uri: string,
        duration: number | null | undefined
      ) => void;
    }) => state.setSelectedVideo
  );
  const cleanSelectedVideo = useBoundStore(
    (state: { cleanSelectedVideo: () => void }) => state.cleanSelectedVideo
  );

  // FUNCTIONS
  const pickVideoAsync = async () => {
    setIsLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
      });

      if (!result.canceled) {
        const { uri, duration } = result.assets[0];
        if (duration && duration < 5000) {
          Alert.alert("Error", "The video must be longer than 5 seconds.");
        } else {
          setSelectedVideo(uri, duration);
        }
      }
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Something went wrong while picking the video.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    try {
      await FileSystem.deleteAsync(selectedVideo!.uri, { idempotent: true });
    } catch (err) {
      console.error(err);
    } finally {
      cleanSelectedVideo();
      router.back();
    }
  };

  useEffect(() => {
    if (selectedVideo?.uri) {
      router.push("/video-modals/crop");
    }
  }, [selectedVideo]);

  return (
    <SafeAreaView
      style={tw.style(
        "flex-1",
        Platform.OS == "ios" ? "bg-darkGray" : "bg-midGray"
      )}
    >
      <ModalHeader content="Select a Video" onClose={handleBack} />
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />
      <View style={tw.style("container justify-center bg-darkGray")}>
        <TouchableOpacity
          onPress={pickVideoAsync}
          style={tw.style(
            "w-40 h-40 items-center justify-center rounded-full shadow-lg bg-lightGray"
          )}
        >
          {isLoading ? (
            <ActivityIndicator
              size={Platform.OS == "ios" ? "large" : 64}
              color={Colors.darkGray}
            />
          ) : (
            <Feather name="upload" size={64} color="black" />
          )}
        </TouchableOpacity>
        <ThemedText
          size={14}
          weight={500}
          lineHeight={20}
          style={tw.style("text-center max-w-60")}
        >
          Please select a video file that you would like to crop. You can choose
          a video from your device, but {"\n"}it must be longer than{" "}
          <ThemedText size={18} lineHeight={20} weight={700}>
            5
          </ThemedText>{" "}
          seconds.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
};

export default Select;
