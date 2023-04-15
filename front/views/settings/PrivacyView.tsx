import React, { useState, useEffect } from "react";
import { View } from 'react-native';
import { Center, Button, Text, Switch, Heading } from "native-base";
import { translate } from "../../i18n/i18n";
import { useIsFocused } from "@react-navigation/native";
import API from "../../API";

const PrivacyView = ({navigation}: any) => {
	const isFocused = useIsFocused();
	let [showAct, setShowAct] = useState(false);
	let [appearLdrBrd, setAppearLdrBrd] = useState(false);
	let [recommdtns, setRecommdtns] = useState(false);

	useEffect(() => {
		if (isFocused) {
			API.getUserSettings().then((data) => {
				setShowAct(data.showActivity);
				setAppearLdrBrd(data.leaderBoard);
			})
		}
	}, [isFocused]);

	// const changeShowPresence = async () => {
    //     data.show_presence = !showPresence;
    //     setShowPresence(data.show_presence);
    //     await api.patchRequest('https://oauth.reddit.com/api/v1/prefs', data);
    // }

	return (
		<Center style={{ flex: 1}}>
			<Heading style={{ textAlign: "center" }}>{ translate('privBtn')}</Heading>

			<Button variant='outline' onPress={() => navigation.navigate('Settings')} style={{ margin: 10 }}>{ translate('backBtn') }</Button>

			<View style={{margin: 20}} >
				<Text style={{ textAlign: "center" }}>{ translate('showAct') }</Text>
				<Switch value={showAct} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
			</View>

			<View style={{margin: 20}}>
				<Text style={{ textAlign: "center" }}>{ translate('appearLdrBrd') }</Text>
				<Switch value={appearLdrBrd} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
			</View>

			<View style={{margin: 20}}>
				<Text style={{ textAlign: "center" }}>{ translate('recommdtns') }</Text>
				<Switch value={recommdtns} style={{ alignSelf: 'center', margin: 10 }} colorScheme="primary"/>
			</View>
		</Center>
	)
}

export default PrivacyView;