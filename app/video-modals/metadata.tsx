import BaseButton from "@components/BaseButton";
import ModalHeader from "@components/ModalHeader";
import ThemedText from "@components/ThemedText";
import Colors from "@constants/Colors";
import tw from "@lib/tailwind";
import { router, useNavigation } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef } from "react";
import { useBoundStore } from "@store/useBoundStore";
import MetadataForm, { MetadataFormHandles } from "@components/MetadataForm";
import { useCropVideoMutation } from "mutations/useCropVideoMutation";

const Crop = () => {
  const navigation = useNavigation();

  const {
    mutate,
    isPending,
    isError,
    error,
    data: mutationData,
  } = useCropVideoMutation();

  const selectedVideo = useBoundStore((state) => state.selectedVideo);
  const cleanSelectedVideo = useBoundStore(
    (state: { cleanSelectedVideo: () => void }) => state.cleanSelectedVideo
  );

  const metadataFormRef = useRef<MetadataFormHandles | null>(null);

  const handleCropAndCreate = () => {
    const errors = metadataFormRef.current?.submit();
    console.log("Form Errors:", errors);

    if (errors) {
      if (errors.name || errors.description) {
        return;
      }
    }

    if (selectedVideo?.cropStartTime) {
      mutate({
        uri: selectedVideo.uri,
        start: selectedVideo.cropStartTime,
        id: Date.now().toString(),
      });
    }

    console.log(mutationData);
  };

  return (
    <SafeAreaView
      style={tw.style(
        "flex-1",
        Platform.OS === "ios" ? "bg-darkGray" : "bg-midGray"
      )}
    >
      {/* Header */}
      <ModalHeader content="Add Metadata" onClose={() => router.back()} />

      {/* Seperator */}
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />

      <View style={tw.style("container bg-darkGray")}>
        {isPending ? (
          <ActivityIndicator size="large" color={Colors.lightGray} />
        ) : (
          <MetadataForm ref={metadataFormRef} />
        )}

        <BaseButton
          onPress={handleCropAndCreate}
          style={tw.style("button-icon")}
        >
          <ThemedText
            color={Colors.darkGray}
            lineHeight={18}
            weight={600}
            size={16}
          >
            Crop and Create the Video
          </ThemedText>
        </BaseButton>
      </View>
    </SafeAreaView>
  );
};

export default Crop;
