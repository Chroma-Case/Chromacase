import React from "react";
import { Center, Heading } from "native-base";
import { translate } from "../../i18n/i18n";
import ElementList from "../../components/GtkUI/ElementList";
import { useDispatch } from "react-redux";
import { RootState, useSelector } from "../../state/Store";
import { updateSettings } from "../../state/SettingsSlice";
import useUserSettings from "../../hooks/userSettings";
import { LoadingView } from "../../components/Loading";

const PrivacyView = () => {
	const dispatch = useDispatch();
	const settings = useSelector((state: RootState) => state.settings.local);
	const { settings: userSettings, updateSettings: updateUserSettings } = useUserSettings();

	if (!userSettings.data) {
		return <LoadingView/>;
	}
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
							value: settings.dataCollection,
							onToggle: () =>
								dispatch(
									updateSettings({ dataCollection: !settings.dataCollection })
								),
						},
					},
					{
						type: "toggle",
						title: translate("customAds"),
						data: {
							value: settings.customAds,
							onToggle: () =>
								dispatch(updateSettings({ customAds: !settings.customAds })),
						},
					},
					{
						type: "toggle",
						title: translate("recommendations"),
						data: {
							value: userSettings.data.recommendations,
							onToggle: () =>
								updateUserSettings({ recommendations: !userSettings.data.recommendations })
						},
					},
				]}
			/>
		</Center>
	);
};

export default PrivacyView;
