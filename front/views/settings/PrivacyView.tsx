import React from "react";
import { View } from "react-native";
import { Center, Button, Text, Switch, Heading } from "native-base";
import { translate } from "../../i18n/i18n";
import ElementList from "../../components/GtkUI/ElementList";

const PrivacyView = ({ navigation }) => {
	const [dataCollection, setDataCollection] = React.useState(false);
	const [customAds, setCustomAds] = React.useState(false);
	const [recommendations, setRecommendations] = React.useState(false);
	return (
		<Center style={{ flex: 1 }}>
			<Heading style={{ textAlign: "center" }}>{translate("privBtn")}</Heading>

			<ElementList
				style={{
					marginTop: 20,
					width: "90%",
					maxWidth: 850,
				}}
				elements={[
					{
						type: "toggle",
						title: translate("dataCollection"),
						data: {
							value: dataCollection,
							onToggle: () => setDataCollection(!dataCollection),
						},
					},
					{
						type: "toggle",
						title: translate("customAds"),
						data: {
							value: customAds,
							onToggle: () => setCustomAds(!customAds),
						},
					},
					{
						type: "toggle",
						title: translate("recommendations"),
						data: {
							value: recommendations,
							onToggle: () => setRecommendations(!recommendations),
						},
					},
				]}
			/>
		</Center>
	);
};

export default PrivacyView;
