import React from 'react';
import { useDispatch } from 'react-redux';
import { Center, Flex, Heading } from 'native-base';
import { useLanguage } from '../../state/LanguageSlice';
import { AvailableLanguages, DefaultLanguage, translate, Translate } from '../../i18n/i18n';
import { useSelector } from '../../state/Store';
import { updateSettings } from '../../state/SettingsSlice';
import ElementList from '../../components/GtkUI/ElementList';
import LocalSettings from '../../models/LocalSettings';
import {
	Brush,
	Brush2,
	Colorfilter,
	LanguageSquare,
	Rank,
	Ranking,
	Sound,
	Star1,
} from 'iconsax-react-native';

const PreferencesView = () => {
	const dispatch = useDispatch();
	const language = useSelector((state) => state.language.value);
	const settings = useSelector((state) => state.settings.local);
	return (
		<Flex
			style={{
				flex: 1,
				alignItems: 'center',
				paddingTop: 32,
			}}
		>
			<ElementList
				style={{
					marginTop: 20,
					width: '90%',
					maxWidth: 850,
				}}
				elements={[
					{
						icon: <Brush2 size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'dropdown',
						title: translate('SettingsPreferencesTheme'),
						description: 'Définissez le theme (Dark ou Light) de votre application',
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
						icon: <LanguageSquare size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'dropdown',
						title: translate('SettingsPreferencesLanguage'),
						description: 'Définissez la langue de votre application',
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
						icon: <Rank size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'dropdown',
						title: translate('SettingsPreferencesDifficulty'),
						description: 'La précision du tempo est de plus en plus élevée',
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
				style={{
					marginTop: 20,
					width: '90%',
					maxWidth: 850,
				}}
				elements={[
					{
						icon: <Colorfilter size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'toggle',
						title: translate('SettingsPreferencesColorblindMode'),
						description: 'Augmente le contraste',
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
						icon: <Sound size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'range',
						title: translate('SettingsPreferencesMicVolume'),
						description: 'Régler le volume de votre micro selon vos preference',
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
		</Flex>
	);
};

export default PreferencesView;
