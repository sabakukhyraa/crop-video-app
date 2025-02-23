import BaseButton from '@components/BaseButton';
import ThemedText from '@components/ThemedText';
import tw from '@lib/tailwind';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from 'constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useBoundStore } from '@store/useBoundStore';
import { useCropVideoMutation } from 'mutations/useCropVideoMutation';
import CroppedVideoItem from '@components/CroppedVideoItem';

export default function App() {
  const { mutate, isPending, isError, error, data: mutationData } = useCropVideoMutation();

  const selectedVideoUri = useBoundStore(state => state.selectedVideoUri);
  const croppedVideos = useBoundStore(state => state.croppedVideos);
  const setSelectedVideoUri = useBoundStore(
    (state: { setSelectedVideoUri: (uri: string) => void }) => state.setSelectedVideoUri
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
    });

    if (!result.canceled) {
      setSelectedVideoUri(result.assets[0].uri)
    } else {
      alert('You did not select any image.');
    }
  };

  const handleCrop = () => {
    selectedVideoUri && mutate({uri: selectedVideoUri, start: 0, end: 5, id: Date.now().toString()})
  }

  console.log(mutationData)

  return (
    <SafeAreaView style={tw.style("flex-1 bg-darkGray")}>
      <StatusBar style='light' />
      <View style={tw.style("container")}>
        <BaseButton onPress={pickImageAsync} style={tw.style("button-icon")}>
          <Entypo name="folder-video" size={16} color="black" />
          <ThemedText color={Colors.darkGray} weight={500} size={16}>
            Upload a video
          </ThemedText>
        </BaseButton>
        <BaseButton onPress={handleCrop} disabled={!selectedVideoUri} style={tw.style("button-icon")}>
          <MaterialCommunityIcons name="image-edit" size={16} color="black" />
          <ThemedText color={Colors.darkGray} weight={500} size={16}>
            Crop the selected video
          </ThemedText>
        </BaseButton>
        <FlatList 
          data={croppedVideos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CroppedVideoItem video={{uri: item.uri, id: item.id}} />}
          contentContainerStyle={tw.style("w-full gap-4")}
          style={tw.style("w-full")}
        />
      </View>
    </SafeAreaView>
)
}