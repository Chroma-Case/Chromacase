import React, { Component } from 'react';
import { Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {  Card, Center, Column, IconButton, Progress, Row, View } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
// on mount force landscape
// On unmount reset

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
			<View style={{ flexGrow: 1, flexDirection: 'column' }}>
				<View style={{ flexGrow: 1 }}>

				</View>
				<Card shadow={4} style={{ height: '10%', borderWidth: 0.5, margin: 5 }}>
					<Row justifyContent='space-evenly' space={3} style={{ flexGrow: 1 }}>
						<Column space={2} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ fontWeight: 'bold' }}>Score: {score}%</Text>
							<Progress value={score} style={{ width: '90%' }}/>
						</Column>
						<Center style={{ flex: 1 }}>
							<Text style={{ fontWeight: '700' }}>Rolling in the Deep</Text>
						</Center>
						<Row style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center'  }}>
							<IconButton size='sm' colorScheme='secondary' variant='solid'  _icon={{
							    as: Ionicons,
							    name: "play-back"
							}}/>
							<IconButton size='sm'  variant='solid'  _icon={{
							    as: Ionicons,
							    name: "play"
							}}/>
							<Text>0:30</Text>
							<IconButton size='sm' colorScheme='coolGray' variant='solid'  _icon={{
							    as: Ionicons,
							    name: "stop"
							}}/>
						</Row>
					</Row>
				</Card>
			</View>
		);
	}
}

export default PlayView;