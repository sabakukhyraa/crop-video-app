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
        setSelectedVideo(uri, duration);
      } else {
        Alert.alert("You did not select any image.");
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    cleanSelectedVideo();
    router.back();
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
      <View
        style={tw.style(
          "w-full py-5 items-center justify-center relative",
          Platform.OS == "ios" && "bg-midGray"
        )}
      >
        <TouchableOpacity
          style={tw.style("absolute right-5 bg-lightGray rounded-full p-1")}
          onPress={handleBack}
        >
          <AntDesign name="close" size={24} color={Colors.midGray} />
        </TouchableOpacity>
        <ThemedText size={20} weight={700}>
          Select a Video
        </ThemedText>
      </View>
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />
      <View
        style={tw.style(
          "flex-1 bg-darkGray items-center justify-center gap-4 px-5"
        )}
      >
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
          style={tw.style("text-center max-w-60")}
        >
          Please select a video file that you would like to crop. You can choose
          a video from your device.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
};

export default Select;
