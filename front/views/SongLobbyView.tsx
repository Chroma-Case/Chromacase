import { useRoute } from "@react-navigation/native";
import { View } from "react-native"
import { Text } from "react-native-paper";
import API from "../API";
import { useQuery } from 'react-query';
import LoadingComponent from "../components/loading";

interface SongLobbyProps {
	// The unique identifier to find a song
	songId: number;
}

const SongLobbyView = () => {
	const route = useRoute();
	const props: SongLobbyProps = route.params as any;
	const { isLoading, isError, data } = useQuery(['song', props.songId], API.getSong(props.songId))
	return <View>
		{ isLoading && <LoadingComponent/> }
		<Text>
			{props.songId}
		</Text>
	</View>
}

export default SongLobbyView;