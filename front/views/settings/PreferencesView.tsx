import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import {
	Center,
	Button,
	Text,
	Switch,
	Slider,
	Select,
	Heading,
} from "native-base";
import { useLanguage } from "../../state/LanguageSlice";
import i18n, {
	AvailableLanguages,
	DefaultLanguage,
	translate,
	Translate,
} from "../../i18n/i18n";
import { RootState, useSelector } from "../../state/Store";
import { SettingsState, updateSettings } from "../../state/SettingsSlice";
import ElementList from "../../components/GtkUI/ElementList";

const PreferencesView = ({ navigation }) => {
	const dispatch = useDispatch();
	const language: AvailableLanguages = useSelector(
		(state: RootState) => state.language.value
	);
	const settings = useSelector(
		(state: RootState) => state.settings.settings as SettingsState
	);
	return (
		<Center style={{ flex: 1 }}>
			<Heading style={{ textAlign: "center" }}>
				<Translate translationKey="prefBtn" />
			</Heading>
			<ElementList
				style={{
					marginTop: 20,
					width: "90%",
					maxWidth: 850,
				}}
				elements={[
					{
						type: "dropdown",
						title: "Theme",
						data: {
							value: settings.colorScheme,
							defaultValue: "system",
							onSelect: (newColorScheme) => {
								dispatch(
									updateSettings({ colorScheme: newColorScheme as any })
								);
							},
							options: [
								{ label: translate("dark"), value: "dark" },
								{ label: translate("light"), value: "light" },
								{ label: translate("system"), value: "system" },
							],
						},
					},
					{
						type: "dropdown",
						title: "Language",
						data: {
							value: language,
							defaultValue: DefaultLanguage,
							onSelect: (itemValue) => {
								dispatch(useLanguage(itemValue as AvailableLanguages));
							},
							options: [
								{ label: "Français", value: "fr" },
								{ label: "English", value: "en" },
								{ label: "Italiano", value: "it" },
								{ label: "Espanol", value: "sp" },
							],
						},
					},
					{
						type: "dropdown",
						title: "Difficulty",
						data: {
							value: settings.preferedLevel,
							defaultValue: "medium",
							onSelect: (itemValue) => {
								dispatch(updateSettings({ preferedLevel: itemValue as any }));
							},
							options: [
								{ label: translate("easy"), value: "easy" },
								{ label: translate("medium"), value: "medium" },
								{ label: translate("hard"), value: "hard" },
							],
						},
					},
				]}
			/>
			<ElementList
				style={{
					marginTop: 20,
					width: "90%",
					maxWidth: 850,
				}}
				elements={[
					{
						type: "toggle",
						title: "Color blind mode",
						data: {
							value: settings.colorBlind,
							onToggle: () => {
								dispatch(updateSettings({ colorBlind: !settings.colorBlind }));
							},
						},
					},
				]}
			/>
			<ElementList
				style={{
					marginTop: 20,
					width: "90%",
					maxWidth: 850,
				}}
				elements={[
					{
						type: "range",
						title: "Mic volume",
						data: {
							value: settings.micLevel,
							min: 0,
							max: 1000,
							step: 10,
							onChange: (value) => {
								dispatch(updateSettings({ micLevel: value }));
							},
						},
					},
					{
						type: "dropdown",
						title: "Device",
						data: {
							value: settings.preferedInputName || "0",
							defaultValue: "0",
							onSelect: (itemValue: string) => {
								dispatch(updateSettings({ preferedInputName: itemValue }));
							},
							options: [
								{ label: "Mic_0", value: "0" },
								{ label: "Mic_1", value: "1" },
								{ label: "Mic_2", value: "2" },
							],
						},
					},
				]}
			/>
		</Center>
	);
};

export default PreferencesView;
