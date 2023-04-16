import React, { useState, useEffect } from "react";
import { Center, Text, Switch, Heading, VStack, Box } from "native-base";
import { translate } from "../../i18n/i18n";
import { useIsFocused } from "@react-navigation/native";
import API from "../../API";
import UserSettings from "../../models/UserSettings";
import TextButton from "../../components/TextButton";


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
		<VStack>
			<Heading my={5} style={{ textAlign: "center" }}>{ translate('notifBtn')}</Heading>

			<Center style={{ flex: 1, alignContent: 'space-between'}}>
				<VStack width={'100%'} style={{maxWidth: 800}}>
					<Box my={1} bgColor={"gray.200"} py={5} px={2} style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }} >
						<Text fontWeight={'bold'} style={{ textAlign: "center" }}>{ translate('pushNotif') }</Text>
						<Switch  value={pushNotif} colorScheme="primary" onValueChange={updatePushNotif}/>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={5} px={2} style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text fontWeight={'bold'} style={{ textAlign: "center" }}>{ translate('emailNotif') }</Text>
						<Switch value={emailNotif} colorScheme="primary" onValueChange={updateEmailNotif}/>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={5} px={2} style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text fontWeight={'bold'} style={{ textAlign: "center" }}>{ translate('trainNotif') }</Text>
						<Switch value={trainNotif} colorScheme="primary" onValueChange={updateTrainNotif}/>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={5} px={2} style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text fontWeight={'bold'} style={{ textAlign: "center" }}>{ translate('newSongNotif') }</Text>
						<Switch value={newSongNotif} colorScheme="primary" onValueChange={updateNewSongNotif}/>
					</Box>
					<TextButton alignSelf={"center"} translate={{ translationKey: 'backBtn' }} onPress={() => navigation.navigate('Settings')}/>
				</VStack>
			</Center>
		</VStack>
	)
}

export default NotificationsView;