import {
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@lib/tailwind";
import { StatusBar } from "expo-status-bar";
import BaseButton from "@components/BaseButton";
import { router, useLocalSearchParams } from "expo-router";
import ThemedText from "@components/ThemedText";
import Colors from "@constants/Colors";
import { useBoundStore } from "@store/useBoundStore";
import { CroppedVideo } from "@store/createVideoSlice";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MetadataForm, { MetadataFormHandles } from "@components/MetadataForm";
import { Image } from "expo-image";

const EditVideo = () => {
  const { videoId } = useLocalSearchParams();
  const id = Array.isArray(videoId) ? videoId[0] : videoId;

  // -----------------------------------------------------
  // STATE
  // -----------------------------------------------------
  const metadataFormRef = useRef<MetadataFormHandles | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [video, setVideo] = useState<CroppedVideo | undefined>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const getCroppedVideo = useBoundStore(
    (state: { getCroppedVideo: (id: string) => CroppedVideo | undefined }) =>
      state.getCroppedVideo
  );
  const editCroppedVideo = useBoundStore(
    (state: {
      editCroppedVideo: (id: string, name: string, description: string) => void;
    }) => state.editCroppedVideo
  );

  // -----------------------------------------------------
  // GET video
  // -----------------------------------------------------
  useEffect(() => {
    try {
      setIsLoading(true);
      const theVideo = getCroppedVideo(id);
      if (theVideo) {
        setVideo(theVideo);
        setName(theVideo.name);
        setDescription(theVideo.description);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFormSubmit = () => {
    const errors = metadataFormRef.current?.submit();
    console.log("Form Errors:", errors);

    if (errors) {
      if (errors.name || errors.description) {
        return;
      }
    }

    if (video && video.id) {
      editCroppedVideo(video.id, name, description);
      router.replace(`/details/${video.id}`);
    }
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
          Edit Video Metadata
        </ThemedText>
      </View>
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />
      <StatusBar style="light" />
      {isLoading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={Colors.lightGray} />
        </View>
      ) : (
        <View style={tw.style("flex-1 w-full")}>
          <Image
            source={video?.thumbnail}
            style={tw.style("w-full h-60")}
            contentPosition={"center"}
          />
          <View style={tw`container`}>
            <MetadataForm
              ref={metadataFormRef}
              name={name}
              description={description}
              setName={setName}
              setDescription={setDescription}
            />
            <View style={tw`flex-1`} />
            <BaseButton
              onPress={handleFormSubmit}
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
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default EditVideo;
