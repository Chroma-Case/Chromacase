import React from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Button, ProgressBar, Text } from "react-native-paper";
import { useQuery } from "react-query";
import API from "../../API";
import LoadingComponent from "../../components/Loading";
import SongCard from "../../components/SongCard";

const HomeView = () => {
	const userQuery = useQuery(['user'], () => API.getUserInfo());
	if (!userQuery.data) {
		return <View style={{ flexGrow: 1, justifyContent: 'center' }}>
			<LoadingComponent/>
		</View>
	}
	return <ScrollView style={{ flex: 1, padding: 20, }}>
		<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
			<Text>Bievenue { userQuery.data.name }!</Text>
			<View>
				<Text style={{  textAlign: 'center'}}>Niveau {userQuery.data.xp / 1000}</Text>
				<ProgressBar progress={(userQuery.data.xp) / (((userQuery.data.xp / 1000) + 1) * 1000)} />
				<Text style={{  textAlign: 'center'}}>{userQuery.data.xp} / {(Math.floor(userQuery.data.xp / 1000) + 1) * 1000} Bonnes notes</Text>
			</View>
		</View>
		<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
			<View style={{ borderColor: 'red',  borderWidth: 1, borderStyle: 'solid', minWidth: '50%', flex: 2 }}>
				<Text>Next step</Text>
				<FlatList
					style={{ flexGrow: 0, flexShrink: 1 }}
					scrollEnabled
					horizontal
					data={[...Array(5).keys()]}
					renderItem={() => <SongCard albumCover={""} songTitle={"Song title"} artistName={"artist name"} />}
					keyExtractor={(item) => item.toString()}
				/>
			</View>
			<View style={{ borderColor: 'blue',  borderWidth: 1, borderStyle: 'solid', minWidth: '30%', flexGrow: 1 }}>
				<Text>This is the left section This is the left sectionThis is the left sectionThis is the left sectionThis is the left section</Text>
				<View style={{ flexDirection: 'row', justifyContent: 'center'}}>
					<Button compact mode="contained">Search</Button>
				</View>
				<View>
					<View style={{ flexDirection: 'row', justifyContent: 'center'}}>
						<SongCard albumCover={""} songTitle={"Song title"} artistName={"artist name"} />
						<SongCard albumCover={""} songTitle={"Song title"} artistName={"artist name"} />
					</View>
					<View style={{ flexDirection: 'row', justifyContent: 'center'}}>
						<SongCard albumCover={""} songTitle={"Song title"} artistName={"artist name"} />
						<SongCard albumCover={""} songTitle={"Song title"} artistName={"artist name"} />
					</View>
				</View>
			</View>
		</View>
	</ScrollView>
}

export default HomeView;
