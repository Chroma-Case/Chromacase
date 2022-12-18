import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {  Box, Center, Column, IconButton, Progress, Row, View } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

class PlayView extends Component {

	override componentDidMount(): void {
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
	}
	override componentWillUnmount(): void {
		ScreenOrientation.unlockAsync();
	}
	override render() {
		const score = 20;
		return (
			<SafeAreaView style={{ flexGrow: 1, flexDirection: 'column' }}>
				<View style={{ flexGrow: 1 }}>

				</View>
				<Box shadow={4} style={{ height: '12%', width:'100%', borderWidth: 0.5, margin: 5 }}>
					<Row justifyContent='space-between' style={{ flexGrow: 1, alignItems: 'center' }} >
						<Column space={2} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ fontWeight: 'bold' }}>Score: {score}%</Text>
							<Progress value={score} style={{ width: '90%' }}/>
						</Column>
						<Center style={{ flex: 1, alignItems: 'center' }}>
							<Text style={{ fontWeight: '700' }}>Rolling in the Deep</Text>
						</Center>
						<Row style={{ flex: 1, height: '100%', justifyContent: 'space-evenly', alignItems: 'center'  }}>
							<IconButton size='sm' colorScheme='secondary' variant='solid'  _icon={{
							    as: Ionicons,
							    name: "play-back"
							}}/>
							<IconButton size='sm'  variant='solid'  _icon={{
							    as: Ionicons,
							    name: "play"
							}}/>
							<Text>0:30</Text>
							<IconButton size='sm' colorScheme='coolGray' variant='solid' _icon={{
							    as: Ionicons,
							    name: "stop"
							}} onPress={() => this.props.navigation.navigate('Score')}/>
						</Row>
					</Row>
				</Box>
			</SafeAreaView>
		);
	}
}

export default function () {
	const navigation = useNavigation();
	return <PlayView navigation={navigation}/>;
};