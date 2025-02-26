import tw from '@lib/tailwind'
import { Image } from 'expo-image'
import { VideoThumbnail } from 'expo-video'
import { Dimensions, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'

const {width: windowWidth} = Dimensions.get("window")

interface StoryBoardProps {
  thumbnails: VideoThumbnail[]
  numberOfThumbnails: number
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}

const StoryBoard = ({thumbnails, numberOfThumbnails, containerStyle, style}: StoryBoardProps) => {
  return (
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
        },
        StyleSheet.flatten(containerStyle)
      )}
      style={tw.style("max-h-12 bg-midGray", StyleSheet.flatten(style))}
    />
  )
}

export default StoryBoard