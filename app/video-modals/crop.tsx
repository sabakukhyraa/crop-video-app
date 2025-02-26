import {
  View,
  TouchableOpacity,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@lib/tailwind";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@constants/Colors";
import { useBoundStore } from "@store/useBoundStore";
import { useVideoPlayer, VideoThumbnail, VideoView } from "expo-video";
import { useEvent, useEventListener } from "expo";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import ModalHeader from "@components/ModalHeader";
import { router, useNavigation } from "expo-router";
import ThemedText from "@components/ThemedText";
import dynamicTimeFormatter from "@helpers/dynamicTimeFormatter";
import BaseButton from "@components/BaseButton";

const { width: windowWidth } = Dimensions.get("window");

const numberOfThumbnails = 7;

const Crop = () => {

  const navigation = useNavigation();

  // STATE MANAGEMENT
  const [thumbnails, setThumbnails] = useState<VideoThumbnail[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [selectedStartTime, setSelectedStartTime] = useState<number>(0);

  const selectedVideo = useBoundStore((state) => state.selectedVideo);
  const setCropStartTime = useBoundStore(
    (state: { setCropStartTime: (startTime: number) => void }) =>
      state.setCropStartTime
  );
  const cleanSelectedVideo = useBoundStore(
    (state: { cleanSelectedVideo: () => void }) =>
      state.cleanSelectedVideo
  );

  const progress = useSharedValue(0);
  const maxTime = useSharedValue(100);


  // EVENTS 
  const player = useVideoPlayer(selectedVideo!.uri, (player) => {
    player.muted = true;
    player.timeUpdateEventInterval = 0.5;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEventListener(player, "statusChange", (payload) => {
    if (payload.status == "readyToPlay") {
      maxTime.value = player.duration - 5;
      player.pause();
    }
  });

  useEventListener(player, "timeUpdate", async (payload) => {
    setCurrentTime(payload.currentTime);
    if (selectedStartTime + 5 < payload.currentTime) {
      player.pause();
      player.currentTime = selectedStartTime;
    }
  });
  const { muted } = useEvent(player, "mutedChange", {
    muted: player.muted,
  });

  // LIFECYCLE HOOKS
  useEffect(() => {
    if (player.duration <= 0 || thumbnails.length > 0) return;
    (() => {
      try {
        Array.from(
          { length: numberOfThumbnails },
          (_, i) => (player.duration / numberOfThumbnails) * (i + 0.5)
        ).forEach(async (requestTime) => {
          const newThumbnail = await player.generateThumbnailsAsync(
            requestTime
          );
          setThumbnails((prev) => [...prev, newThumbnail[0]]);
        });
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [player.duration]);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      cleanSelectedVideo()
    });

    return unsubscribe;
  }, [navigation]);

  const handleContinue = () => {
    setCropStartTime(selectedStartTime);
  };

  return (
    <SafeAreaView
      style={tw.style(
        "flex-1",
        Platform.OS == "ios" ? "bg-darkGray" : "bg-midGray"
      )}
    >
      <ModalHeader
        content="Crop the Video"
        onClose={() => router.back()}
      />
      <View style={tw.style("w-full h-px bg-lightGray opacity-10")} />
      <View
        style={tw.style(
          "flex-1 bg-darkGray items-center justify-start gap-5 pb-5"
        )}
      >
        <View style={tw.style("w-full bg-[#000] shadow-md")}>
          <VideoView
            player={player}
            nativeControls={false}
            style={tw.style("w-full h-[450px]")}
            contentFit="contain"
          />
        </View>
        <View style={tw.style("w-full flex-row items-center justify-center")}>
          <TouchableOpacity
            style={tw.style("absolute right-5")}
            onPress={() => (player.muted = !player.muted)}
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
            <FlatList
              data={thumbnails}
              keyExtractor={(item) => item.actualTime.toString()}
              renderItem={({ item }) => (
                <Image
                  source={item}
                  style={tw.style("h-12", {
                    width: windowWidth / numberOfThumbnails,
                  })}
                />
              )}
              contentContainerStyle={tw.style(
                "flex-row items-center justify-start",
                {
                  width: windowWidth,
                }
              )}
              style={tw.style("w-full max-h-12 bg-midGray")}
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
                  style={tw.style(`h-13 border-[3px] rounded-md border-lightGray`, {
                    backgroundColor: "transparent",
                    width: (5 / Math.max(player.duration, 5)) * windowWidth,
                  })}
                />
              )}
              renderContainer={() => <View></View>}
              bubble={(value) => dynamicTimeFormatter(Math.floor(value))}
              bubbleTextStyle={tw.style("font-raleway")}
            />
            <ThemedText style={tw.style("self-start mt-1 px-5")}>
              {dynamicTimeFormatter(Math.floor(currentTime))}
            </ThemedText>
          </View>
        </View>
        <BaseButton
          style={tw.style("button-icon", { width: windowWidth - 40 })}
          onPress={handleContinue}
        >
          <ThemedText
            color={Colors.darkGray}
            lineHeight={18}
            weight={500}
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
