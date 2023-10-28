import React from 'react';
import { useDispatch } from 'react-redux';
import { Column, Flex } from 'native-base';
import { useLanguage } from '../../state/LanguageSlice';
import { AvailableLanguages, DefaultLanguage, translate } from '../../i18n/i18n';
import { useSelector } from '../../state/Store';
import { updateSettings } from '../../state/SettingsSlice';
import ElementList from '../../components/GtkUI/ElementList';
import LocalSettings from '../../models/LocalSettings';
import { Brush2, Colorfilter, LanguageSquare, Rank, Sound } from 'iconsax-react-native';
import useColorScheme from '../../hooks/colorScheme';

const PreferencesSettings = () => {
	const dispatch = useDispatch();
	const language = useSelector((state) => state.language.value);
	const settings = useSelector((state) => state.settings.local);
	const colorScheme = useColorScheme();
	const color = colorScheme === 'light' ? '#000' : '#fff';
	return (
		<Column space={4} style={{ width: '100%' }}>
			<ElementList
				elements={[
					{
						icon: <Brush2 size="24" color={color} style={{ minWidth: 24 }} />,
						type: 'dropdown',
						title: translate('SettingsPreferencesTabThemeSectionTitle'),
						description: translate('SettingsPreferencesTabThemeSectionDescription'),
						data: {
							value: settings.colorScheme,
							defaultValue: 'system',
							onSelect: (newColorScheme) => {
								dispatch(
									updateSettings({
										colorScheme: newColorScheme as LocalSettings['colorScheme'],
									})
								);
							},
							options: [
								{ label: translate('dark'), value: 'dark' },
								{ label: translate('light'), value: 'light' },
								{ label: translate('system'), value: 'system' },
							],
						},
					},
					{
						icon: <LanguageSquare size="24" color={color} style={{ minWidth: 24 }} />,
						type: 'dropdown',
						title: translate('SettingsPreferencesTabLanguageSectionTitle'),
						description: translate('SettingsPreferencesTabLanguageSectionDescription'),
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
						icon: <Rank size="24" color={color} style={{ minWidth: 24 }} />,
						type: 'dropdown',
						title: translate('SettingsPreferencesTabDifficultySectionTitle'),
						description: translate(
							'SettingsPreferencesTabDifficultySectionDescription'
						),
						data: {
							value: settings.difficulty,
							defaultValue: 'medium',
							onSelect: (itemValue) => {
								dispatch(
									updateSettings({
										difficulty: itemValue as LocalSettings['difficulty'],
									})
								);
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
				elements={[
					{
						icon: <Colorfilter size="24" color={color} style={{ minWidth: 24 }} />,
						type: 'toggle',
						title: translate('SettingsPreferencesTabColorblindModeSectionTitle'),
						description: translate(
							'SettingsPreferencesTabColorblindModeSectionDescription'
						),
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
				elements={[
					{
						icon: <Sound size="24" color={color} style={{ minWidth: 24 }} />,
						type: 'range',
						title: translate('SettingsPreferencesTabMicVolumeSectionTitle'),
						description: translate('SettingsPreferencesTabMicVolumeSectionDescription'),
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
		</Column>
	);
};

export default PreferencesSettings;
