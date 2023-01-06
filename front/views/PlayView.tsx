import React, { Component } from 'react';
import { SafeAreaView, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import {  Box, Center, Column, IconButton, Progress, Row, Toast, View } from 'native-base';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';
import API from '../API';
import LoadingComponent from '../components/Loading';


class PlayView extends Component {
	constructor(props: any) {
		super(props);

		this.onMIDISuccess = this.onMIDISuccess.bind(this);
	}

	private onMIDISuccess(access) {
		const inputs = access.inputs;
		
		if (inputs.size > 1) {
			Toast.show({ description: `MIDI ready!`, placement: 'top' });
		} else {
			return;
		}
		let inputIndex = 0;
		inputs.forEach((input) => {
			if (inputIndex != 0) {
				return;
			}
			input.onmidimessage = (message) => {
				const keyIsPressed = message.data[2] == 100;
				const keyCode = message.data[1];
				const eventTime = Date.now();
				const intensity = null;
				Toast.show({ description: [keyIsPressed, keyCode, eventTime].toString() });
			}
			inputIndex++;
		});
	}
	  
	private onMIDIFailure(msg) {
		Toast.show({ description: `Failed to get MIDI access` });
	}
	

	override componentDidMount(): void {
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});
		navigator.requestMIDIAccess().then(this.onMIDISuccess, this.onMIDIFailure);
	}

	override componentWillUnmount(): void {
		ScreenOrientation.unlockAsync().catch(() => {});
	}
	override render() {
		const score = 20;

		if (!this.props.songQuery.data) {
			return <Center style={{ flexGrow: 1 }}>
				<LoadingComponent/>
			</Center>
		}
		return (
			<SafeAreaView style={{ flexGrow: 1, flexDirection: 'column' }}>
				<View style={{ flexGrow: 1 }}>
					<Text>{this.state.tick}</Text>
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

export default function (props: any) {
	const navigation = useNavigation();
	const song = useQuery(['song'], () => API.getSong(props.songId));
	return <PlayView navigation={navigation} songQuery={song}/>;
};