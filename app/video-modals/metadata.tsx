import { View, Text } from "react-native";
import React from "react";
import BaseButton from "@components/BaseButton";
import ThemedText from "@components/ThemedText";
import { router } from "expo-router";

const Metadata = () => {
  return (
    <View>
      <BaseButton onPress={() => router.dismissAll()}>
        <ThemedText>Bass</ThemedText>
      </BaseButton>
    </View>
  );
};

export default Metadata;
