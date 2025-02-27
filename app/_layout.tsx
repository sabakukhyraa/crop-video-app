import React, { useEffect } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useDeviceContext } from "twrnc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import tw from "@lib/tailwind";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const RootLayout = () => {
  useDeviceContext(tw);
  const [fontsLoaded, error] = useFonts({
    "Raleway-Bold": require("../assets/fonts/Raleway-Bold.ttf"),
    "Raleway-SemiBold": require("../assets/fonts/Raleway-SemiBold.ttf"),
    "Raleway-Medium": require("../assets/fonts/Raleway-Medium.ttf"),
    "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf"),
    "Raleway-Light": require("../assets/fonts/Raleway-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen
                  name="details/[videoId]"
                  options={{
                    headerShown: false,
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="edit/[videoId]"
                  options={{
                    headerShown: false,
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="video-modals/select"
                  options={{
                    presentation: "modal",
                    headerShown: false,
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="video-modals/metadata"
                  options={{
                    presentation: "modal",
                    headerShown: false,
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="video-modals/crop"
                  options={{
                    presentation: "modal",
                    headerShown: false,
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen name="index" options={{ headerShown: false }} />
              </Stack>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
