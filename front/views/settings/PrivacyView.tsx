import React, { useState, useEffect } from "react";
import { Center, Text, Switch, Heading, VStack, Box } from "native-base";
import { translate } from "../../i18n/i18n";
import { useIsFocused } from "@react-navigation/native";
import API from "../../API";
import UserSettings from "../../models/UserSettings";
import TextButton from "../../components/TextButton";


const PrivacyView = ({navigation}: any) => {
	const isFocused = useIsFocused();
	const [data, setData] = useState<UserSettings>(Object);
	let [showAct, setShowAct] = useState(false);
	let [appearLdrBrd, setAppearLdrBrd] = useState(false);
	let [recommdtns, setRecommdtns] = useState(false);

	useEffect(() => {
		if (isFocused) {
			API.getUserSettings().then((data) => {
				setShowAct(data.showActivity);
				setAppearLdrBrd(data.leaderBoard);
				setRecommdtns(data.recommendations);
			})
		}
	}, [isFocused]);

	const updateShowAct = async () => {
		data.showActivity = !showAct;
		setShowAct(data.showActivity);
		await API.updateUserSettings(data);
	};

	const updateAppearLdrBrd = async () => {
		data.leaderBoard = !appearLdrBrd;
		setAppearLdrBrd(data.leaderBoard);
		await API.updateUserSettings(data);
	};

	const updateRecommdtns = async () => {
		data.recommendations = !recommdtns;
		setRecommdtns(data.recommendations);
		await API.updateUserSettings(data);
	};

	return (
		<VStack>
			<Heading my={5} style={{ textAlign: "center" }}>{ translate('privBtn')}</Heading>

			<Center style={{ flex: 1, alignContent: 'space-between'}}>
				<VStack width={'100%'} style={{maxWidth: 800}}>
					<Box my={1} bgColor={"gray.200"} py={5} px={2} style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text fontWeight={'bold'} style={{ textAlign: "center" }}>{ translate('showAct') }</Text>
						<Switch value={showAct} colorScheme="primary" onValueChange={updateShowAct}/>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={5} px={2} style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text fontWeight={'bold'} style={{ textAlign: "center" }}>{ translate('appearLdrBrd') }</Text>
						<Switch value={appearLdrBrd}  colorScheme="primary" onValueChange={updateAppearLdrBrd}/>
					</Box>

					<Box my={1} bgColor={"gray.200"} py={5} px={2} style={{ flex: 3, flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text fontWeight={'bold'} style={{ textAlign: "center" }}>{ translate('recommdtns') }</Text>
						<Switch value={recommdtns}  colorScheme="primary" onValueChange={updateRecommdtns}/>
					</Box>
					<TextButton alignSelf={"center"} translate={{ translationKey: 'backBtn' }} onPress={() => navigation.navigate('Settings')}/>
				</VStack>
			</Center>
		</VStack>
	)
}

export default PrivacyView;