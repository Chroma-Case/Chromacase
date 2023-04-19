import React from "react";
import { Center, Heading } from "native-base";
import { translate } from "../../i18n/i18n";
import ElementList from "../../components/GtkUI/ElementList";
import { useDispatch } from "react-redux";
import { RootState, useSelector } from "../../state/Store";
import { SettingsState, updateSettings } from "../../state/SettingsSlice";

const PrivacyView = () => {
	const dispatch = useDispatch();
	const settings: SettingsState = useSelector(
		(state: RootState) => state.settings.settings as SettingsState
	);

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
							value: settings.recommandations,
							onToggle: () =>
								dispatch(
									updateSettings({ recommandations: !settings.recommandations })
								),
						},
					},
				]}
			/>
		</Center>
	);
};

export default PrivacyView;
