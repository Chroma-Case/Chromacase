import React from 'react';
import { useDispatch } from 'react-redux';
import { Column } from 'native-base';
import { useLanguage } from '../../state/LanguageSlice';
import { AvailableLanguages, DefaultLanguage, translate } from '../../i18n/i18n';
import { useSelector } from '../../state/Store';
import { updateSettings } from '../../state/SettingsSlice';
import ElementList from '../../components/GtkUI/ElementList';
import LocalSettings from '../../models/LocalSettings';
import { Brush2, LanguageSquare, Rank } from 'iconsax-react-native';

const PreferencesSettings = () => {
	const dispatch = useDispatch();
	const language = useSelector((state) => state.language.value);
	const settings = useSelector((state) => state.settings.local);

	return (
		<Column space={4} style={{ width: '100%' }}>
			<ElementList
				elements={[
					{
						icon: Brush2,
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
						icon: LanguageSquare,
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
						icon: Rank,
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
		</Column>
	);
};

export default PreferencesSettings;
