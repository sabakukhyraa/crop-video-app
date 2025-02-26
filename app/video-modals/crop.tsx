import { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import tw from "@lib/tailwind";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Colors from "@constants/Colors";
import { useBoundStore } from "@store/useBoundStore";
import { useVideoPlayer, VideoThumbnail, VideoView } from "expo-video";
import { useEvent, useEventListener } from "expo";
import * as FileSystem from "expo-file-system";
import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import ModalHeader from "@components/ModalHeader";
import ThemedText from "@components/ThemedText";
import BaseButton from "@components/BaseButton";
import dynamicTimeFormatter from "@helpers/dynamicTimeFormatter";
import { router } from "expo-router";
import StoryBoard from "@components/StoryBoard";

const { width: windowWidth } = Dimensions.get("window");
const numberOfThumbnails = 7; // number of frames in storyboard

const Crop = () => {
  const navigation = useNavigation();

  // -----------------------------------------------------
  // STATE
  // -----------------------------------------------------
  const [thumbnails, setThumbnails] = useState<VideoThumbnail[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedStartTime, setSelectedStartTime] = useState<number>(0);

  const selectedVideo = useBoundStore((state) => state.selectedVideo);
  const setCropStartTime = useBoundStore(
    (state: { setCropStartTime: (startTime: number) => void }) =>
      state.setCropStartTime
  );
  const cleanSelectedVideo = useBoundStore(
    (state: { cleanSelectedVideo: () => void }) => state.cleanSelectedVideo
  );

  // Reanimated slider progress
  const progress = useSharedValue(0);
  const maxTime = useSharedValue(100);

  // -----------------------------------------------------
  // VIDEO PLAYER SETUP
  // -----------------------------------------------------
  const player = useVideoPlayer(selectedVideo!.uri, (p) => {
    p.muted = true;
    p.timeUpdateEventInterval = 0.5;
    p.play();
    Platform.OS == "ios" && p.pause();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const { muted } = useEvent(player, "mutedChange", {
    muted: player.muted,
  });

  // -----------------------------------------------------
  // EVENT LISTENERS
  // -----------------------------------------------------
  useEventListener(player, "statusChange", (payload) => {
    if (payload.status === "readyToPlay") {
      maxTime.value = player.duration - 5;
    }
  });

  useEventListener(player, "timeUpdate", (payload) => {
    setCurrentTime(payload.currentTime);
    if (selectedStartTime + 5 < payload.currentTime) {
      player.pause();
      player.currentTime = selectedStartTime;
      // pause and rewind the 5-second vidoe.
    }
  });

  // -----------------------------------------------------
  // STORYBOARD GENERATION
  // -----------------------------------------------------
  // prevent strict mode
  const hasGeneratedThumbnails = useRef(false);

  useEffect(() => {
    if (player.duration <= 0) return;
    if (hasGeneratedThumbnails.current) return;

    hasGeneratedThumbnails.current = true;

    (async () => {
      try {
        const times = Array.from(
          { length: numberOfThumbnails },
          (_, i) => (player.duration / numberOfThumbnails) * (i + 0.5)
        );

        const results = await Promise.all(
          times.map((requestTime) =>
            player.generateThumbnailsAsync(requestTime)
          )
        );

        const allThumbnails = results.map((item) => item[0]);
        setThumbnails(allThumbnails);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [player.duration]);

  // -----------------------------------------------------
  // CLEANUP
  // -----------------------------------------------------
  // Cleanup the selected video from cache
  useEffect(() => {
    return () => {
      (async () => {
        try {
          await FileSystem.deleteAsync(selectedVideo!.uri, {
            idempotent: true,
          });
        } catch (error) {
          console.error(error);
        }
      })();
    };
  }, []);

  // Clean the store on modal exit
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      cleanSelectedVideo();
    });
    return unsubscribe;
  }, [navigation, cleanSelectedVideo]);

  // -----------------------------------------------------
  // ROUTING
  // -----------------------------------------------------
  useEffect(() => {
    if (selectedVideo?.cropStartTime) {
      router.push("/video-modals/metadata");
    }
  }, [selectedVideo]);

  // -----------------------------------------------------
  // RENDER
  // -----------------------------------------------------
  return (
    <SafeAreaView
      style={tw.style(
        "flex-1",
        Platform.OS === "ios" ? "bg-darkGray" : "bg-midGray"
      )}
    >
      {/* Header */}
      <ModalHeader content="Crop the Video" onClose={() => router.back()} />

      {/* Seperator */}
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />

      <View
        style={tw.style(
          "flex-1 bg-darkGray items-center justify-start gap-5 pb-5"
        )}
      >
        {/* VideoView */}
        <View style={tw.style("w-full bg-[#000] shadow-md")}>
          <VideoView
            player={player}
            nativeControls={false}
            style={tw.style("w-full h-[450px]")}
            contentFit="contain"
          />
        </View>

        {/* Play/Pause & Mute/Unmute Buttons */}
        <View style={tw.style("w-full flex-row items-center justify-center")}>
          <TouchableOpacity
            style={tw.style("absolute right-5")}
            onPress={() => {
              player.muted = !player.muted;
            }}
          >
            {muted ? (
              <Ionicons name="volume-mute" size={32} color={Colors.lightGray} />
            ) : (
              <Ionicons name="volume-high" size={32} color={Colors.lightGray} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          >
            {isPlaying ? (
              <Entypo
                name="controller-paus"
                size={36}
                color={Colors.lightGray}
              />
            ) : (
              <Entypo
                name="controller-play"
                size={36}
                color={Colors.lightGray}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={tw.style("container pt-0")}>
          <View style={tw.style("relative items-center")}>
            <StoryBoard
              thumbnails={thumbnails}
              numberOfThumbnails={numberOfThumbnails}
              style={tw`w-full`}
            />

            <View
              style={tw.style(`absolute h-12 w-[2px] bg-lightGray`, {
                left: (currentTime / player.duration) * windowWidth,
              })}
            />

            <Slider
              progress={progress}
              minimumValue={useSharedValue(0)}
              maximumValue={maxTime}
              onSlidingComplete={(value) => {
                player.currentTime = value;
                setSelectedStartTime(value);
              }}
              disableTrackFollow
              style={tw.style(
                `w-[${
                  16 +
                  windowWidth -
                  (5 / Math.max(player.duration, 5)) * windowWidth
                }px] h-13 left-0 -top-[2px] absolute`
              )}
              thumbWidth={16}
              markWidth={0}
              renderThumb={() => (
                <View
                  style={tw.style(
                    `h-13 border-[3px] rounded-md border-lightGray`,
                    {
                      backgroundColor: "transparent",
                      width: (5 / Math.max(player.duration, 5)) * windowWidth,
                    }
                  )}
                />
              )}
              renderContainer={() => <View />}
              bubble={(value) => dynamicTimeFormatter(Math.floor(value))}
              bubbleTextStyle={tw.style("font-raleway")}
            />
          </View>
          <ThemedText style={tw.style("self-start -mt-3 px-5")}>
            {dynamicTimeFormatter(Math.floor(currentTime))}
          </ThemedText>
        </View>

        <BaseButton
          style={tw.style("button-icon", { width: windowWidth - 40 })}
          onPress={() => setCropStartTime(selectedStartTime)}
        >
          <MaterialCommunityIcons
            name="movie-open-edit"
            size={20}
            style={tw`mb-1`}
            color={Colors.darkGray}
          />
          <ThemedText
            color={Colors.darkGray}
            lineHeight={18}
            weight={600}
            size={16}
          >
            Select this 5-second video
          </ThemedText>
        </BaseButton>
      </View>
    </SafeAreaView>
  );
};

export default Crop;
