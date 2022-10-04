import React from "react";
import { View } from "react-native";
import { ProgressBar, Text } from "react-native-paper";
import { useQuery } from "react-query";
import API from "../../API";
import LoadingComponent from "../../components/loading";

const HomeView = () => {
	const userQuery = useQuery(['user'], () => API.getUserInfo());
	if (!userQuery.data) {
		return <View style={{ flexGrow: 1, justifyContent: 'center' }}>
			<LoadingComponent/>
		</View>
	}
	return <View style={{ padding: 20, flex: 1 }}>
		<Text>Bievenue { userQuery.data.name }!</Text>
		
		<View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap', overflow: 'hidden', alignItems: 'flex-start'}}>
			<View style={{ backgroundColor: 'red', width: '60%' }}>
				<Text>This is the left section</Text>
			</View>
			<View style={{ backgroundColor: 'blue' }}>
				<View style={{ }}>
					<Text style={{  textAlign: 'center'}}>Niveau {userQuery.data.xp / 1000}</Text>
					<ProgressBar progress={(userQuery.data.xp) / (((userQuery.data.xp / 1000) + 1) * 1000)} />
					<Text style={{  textAlign: 'center'}}>{userQuery.data.xp} / {(Math.floor(userQuery.data.xp / 1000) + 1) * 1000} Bonnes notes</Text>
				</View>
			</View>
		</View>
	</View>
}

export default HomeView;
