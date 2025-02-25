import { View, Platform, TouchableOpacity } from "react-native";
import React from "react";
import tw from "@lib/tailwind";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@constants/Colors";
import ThemedText from "./ThemedText";
import { router } from "expo-router";
import { useBoundStore } from "@store/useBoundStore";

interface ModalHeaderProps {
  content: string;
  cleanVideo: boolean;
}

const ModalHeader = ({ content, cleanVideo }: ModalHeaderProps) => {
  const cleanSelectedVideo = useBoundStore(
    (state: { cleanSelectedVideo: () => void }) => state.cleanSelectedVideo
  );

  const handleBack = () => {
    cleanVideo && cleanSelectedVideo();
    router.back();
  };

  return (
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
        {content}
      </ThemedText>
    </View>
  );
};

export default ModalHeader;
