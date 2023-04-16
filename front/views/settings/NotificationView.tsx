import React, { useState, useEffect } from "react";
import { View } from 'react-native';
import { Center, Button, Text, Switch, Heading } from "native-base";
import { translate } from "../../i18n/i18n";
import { useIsFocused } from "@react-navigation/native";
import API from "../../API";
import { updateSettings } from "../../state/SettingsSlice";
import UserSettings from "../../models/UserSettings";


const NotificationsView = ({navigation}: any) => {
	const isFocused = useIsFocused();
	const [data, setData] = useState<UserSettings>(Object);
	let [pushNotif, setPushNotif] = useState(false);
	let [emailNotif, setEmailNotif] = useState(false);
	let [trainNotif, setTrainNotif] = useState(false);
	let [newSongNotif, setNewSongNotif] = useState(false);

	useEffect(() => {
		if (isFocused) {
			API.getUserSettings().then((data) => {
				setData(data);
				setEmailNotif(data.emailNotification);
				setPushNotif(data.pushNotification);
				setTrainNotif(data.trainingNotification);
				setNewSongNotif(data.newSongNotification);
			})
		}
	}, [isFocused]);

	const updatePushNotif = async () => {
		data.pushNotification = !pushNotif;
		setPushNotif(data.pushNotification);
		await API.updateUserSettings(data);
	};

	const updateEmailNotif = async () => {
		data.emailNotification = !emailNotif;
		setEmailNotif(data.emailNotification);
		await API.updateUserSettings(data);
	};

	const updateTrainNotif = async () => {
		data.trainingNotification = !trainNotif;
		setTrainNotif(data.trainingNotification);
		await API.updateUserSettings(data);
	};

	const updateNewSongNotif = async () => {
		data.newSongNotification = !newSongNotif;
		setNewSongNotif(data.newSongNotification);
		await API.updateUserSettings(data);
	};

	return (
		<Center style={{ flex: 1, justifyContent: 'center' }}>

			<Heading style={{ textAlign: "center" }}>{ translate('notifBtn')}</Heading>
			<Button variant='outline' style={{ margin: 10}} onPress={() => navigation.navigate('Settings')} >{ translate('backBtn') }</Button>

			<View style={{margin: 20}} >
				<Text style={{ textAlign: "center" }}>{ translate('pushNotif') }</Text>
				<Switch value={pushNotif} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary" onValueChange={updatePushNotif}/>
			</View>

			<View style={{margin: 20}}>
				<Text style={{ textAlign: "center" }}>{ translate('emailNotif') }</Text>
				<Switch value={emailNotif} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary" onValueChange={updateEmailNotif}/>
			</View>

			<View style={{margin: 20}}>
				<Text style={{ textAlign: "center" }}>{ translate('trainNotif') }</Text>
				<Switch value={trainNotif} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary" onValueChange={updateTrainNotif}/>
			</View>

			<View style={{margin: 20}}>
				<Text style={{ textAlign: "center" }}>{ translate('newSongNotif') }</Text>
				<Switch value={newSongNotif} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary" onValueChange={updateNewSongNotif}/>
			</View>
		</Center>
	)
}

export default NotificationsView;