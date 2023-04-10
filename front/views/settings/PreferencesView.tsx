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
			<View style={{ margin: 20, maxHeight: 100, maxWidth: 500, width: "80%" }}>
				<Select
					selectedValue={settings.colorScheme}
					placeholder={"Theme"}
					style={{ alignSelf: "center" }}
					onValueChange={(newColorScheme) => {
						dispatch(updateSettings({ colorScheme: newColorScheme as any }));
					}}
				>
					<Select.Item label={translate("dark")} value="dark" />
					<Select.Item label={translate("light")} value="light" />
					<Select.Item label={translate("system")} value="system" />
				</Select>
			</View>

			<View style={{ margin: 20, maxHeight: 100, maxWidth: 500, width: "80%" }}>
				<Select
					selectedValue={language}
					placeholder={translate("langBtn")}
					style={{ alignSelf: "center" }}
					onValueChange={(itemValue) => {
						dispatch(useLanguage(itemValue as AvailableLanguages));
					}}
				>
					<Select.Item label="Français" value="fr" />
					<Select.Item label="English" value="en" />
					<Select.Item label="Italiano" value="it" />
					<Select.Item label="Espanol" value="sp" />
				</Select>
			</View>

			<View style={{ margin: 20, maxHeight: 100, maxWidth: 500, width: "80%" }}>
				<Select
					selectedValue={settings.preferedLevel}
					placeholder={translate("diffBtn")}
					style={{ height: 50, width: 150, alignSelf: "center" }}
					onValueChange={(itemValue) => {
						dispatch(updateSettings({ preferedLevel: itemValue as any }));
					}}
				>
					<Select.Item label={translate("easy")} value="easy" />
					<Select.Item label={translate("medium")} value="medium" />
					<Select.Item label={translate("hard")} value="hard" />
				</Select>
			</View>

			<View style={{ margin: 20 }}>
				<Text style={{ textAlign: "center" }}>Color blind mode</Text>
				<Switch
					style={{ alignSelf: "center" }}
					value={settings.colorBlind}
					colorScheme="primary"
					onValueChange={(enabled) => {
						dispatch(updateSettings({ colorBlind: enabled }));
					}}
				/>
			</View>

			<View style={{ margin: 20, maxHeight: 100, maxWidth: 500, width: "80%" }}>
				<Text style={{ textAlign: "center" }}>Mic volume</Text>
				<Slider
					defaultValue={settings.micLevel}
					minValue={0}
					maxValue={1000}
					accessibilityLabel="hello world"
					step={10}
					onChangeEnd={(value) => {
						dispatch(updateSettings({ micLevel: value }));
					}}
				>
					<Slider.Track>
						<Slider.FilledTrack />
					</Slider.Track>
					<Slider.Thumb />
				</Slider>
			</View>

			<View style={{ margin: 20, maxHeight: 100, maxWidth: 500, width: "80%" }}>
				<Select
					selectedValue={settings.preferedInputName}
					placeholder={"Device"}
					style={{ height: 50, width: 150, alignSelf: "center" }}
					onValueChange={(itemValue: string) => {
						dispatch(updateSettings({ preferedInputName: itemValue }));
					}}
				>
					<Select.Item label="Mic_0" value="0" />
					<Select.Item label="Mic_1" value="1" />
					<Select.Item label="Mic_2" value="2" />
				</Select>
			</View>

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
