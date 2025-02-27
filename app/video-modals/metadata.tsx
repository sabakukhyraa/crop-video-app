import BaseButton from "@components/BaseButton";
import ModalHeader from "@components/ModalHeader";
import ThemedText from "@components/ThemedText";
import Colors from "@constants/Colors";
import tw from "@lib/tailwind";
import { router } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { useBoundStore } from "@store/useBoundStore";
import MetadataForm, { MetadataFormHandles } from "@components/MetadataForm";
import { useCropVideoMutation } from "mutations/useCropVideoMutation";

const Metadata = () => {
  const {
    mutate,
    isPending,
    isError,
    error,
    data: mutationData,
  } = useCropVideoMutation();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const selectedVideo = useBoundStore((state) => state.selectedVideo);

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
        name: name,
        description: description,
      });
    }
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
        {true ? (
          <View style={tw.style("flex-1 justify-center")}>
            <ActivityIndicator size="large" color={Colors.lightGray} />
          </View>
        ) : (
          <MetadataForm
            name={name}
            description={description}
            setName={setName}
            setDescription={setDescription}
            ref={metadataFormRef}
          />
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

export default Metadata;
