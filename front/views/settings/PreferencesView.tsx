import React from 'react';
import { useDispatch } from 'react-redux';
import { Center, Heading } from 'native-base';
import { useLanguage } from '../../state/LanguageSlice';
import { AvailableLanguages, DefaultLanguage, translate, Translate } from '../../i18n/i18n';
import { useSelector } from '../../state/Store';
import { updateSettings } from '../../state/SettingsSlice';
import ElementList from '../../components/GtkUI/ElementList';

const PreferencesView = () => {
	const dispatch = useDispatch();
	const language = useSelector((state) => state.language.value);
	const settings = useSelector((state) => state.settings.local);
	return (
		<Center style={{ flex: 1 }}>
			<Heading style={{ textAlign: 'center' }}>
				<Translate translationKey="prefBtn" />
			</Heading>
			<ElementList
				style={{
					marginTop: 20,
					width: '90%',
					maxWidth: 850,
				}}
				elements={[
					{
						type: 'dropdown',
						title: translate('SettingsPreferencesTheme'),
						data: {
							value: settings.colorScheme,
							defaultValue: 'system',
							onSelect: (newColorScheme) => {
								dispatch(updateSettings({ colorScheme: newColorScheme as any }));
							},
							options: [
								{ label: translate('dark'), value: 'dark' },
								{ label: translate('light'), value: 'light' },
								{ label: translate('system'), value: 'system' },
							],
						},
					},
					{
						type: 'dropdown',
						title: translate('SettingsPreferencesLanguage'),
						data: {
							value: language,
							defaultValue: DefaultLanguage,
							onSelect: (itemValue) => {
								dispatch(useLanguage(itemValue as AvailableLanguages));
							},
							options: [
								{ label: 'Français', value: 'fr' },
								{ label: 'English', value: 'en' },
								{ label: 'Espanol', value: 'sp' },
							],
						},
					},
					{
						type: 'dropdown',
						title: translate('SettingsPreferencesDifficulty'),
						data: {
							value: settings.difficulty,
							defaultValue: 'medium',
							onSelect: (itemValue) => {
								dispatch(updateSettings({ difficulty: itemValue as any }));
							},
							options: [
								{ label: translate('easy'), value: 'beg' },
								{ label: translate('medium'), value: 'inter' },
								{ label: translate('hard'), value: 'pro' },
							],
						},
					},
				]}
			/>
			<ElementList
				style={{
					marginTop: 20,
					width: '90%',
					maxWidth: 850,
				}}
				elements={[
					{
						type: 'toggle',
						title: translate('SettingsPreferencesColorblindMode'),
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
					width: '90%',
					maxWidth: 850,
				}}
				elements={[
					{
						type: 'range',
						title: translate('SettingsPreferencesMicVolume'),
						data: {
							value: settings.micVolume,
							min: 0,
							max: 1000,
							step: 10,
							onChange: (value) => {
								dispatch(updateSettings({ micVolume: value }));
							},
						},
					},
					/*{
						type: "dropdown",
						title: translate("SettingsPreferencesDevice"),
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
					},*/
				]}
			/>
		</Center>
	);
};

export default PreferencesView;
