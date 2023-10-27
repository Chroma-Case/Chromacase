import React from 'react';
import { Flex } from 'native-base';
import { translate } from '../../i18n/i18n';
import ElementList from '../../components/GtkUI/ElementList';
import { useDispatch } from 'react-redux';
import { RootState, useSelector } from '../../state/Store';
import { updateSettings } from '../../state/SettingsSlice';
import useUserSettings from '../../hooks/userSettings';
import { LoadingView } from '../../components/Loading';
import { Driver, Like1, Shop } from 'iconsax-react-native';
import useColorScheme from '../../hooks/colorScheme';

const PrivacySettings = () => {
	const dispatch = useDispatch();
	const settings = useSelector((state: RootState) => state.settings.local);
	const { settings: userSettings, updateSettings: updateUserSettings } = useUserSettings();
	const colorScheme = useColorScheme();
	const color = colorScheme === 'light' ? '#000' : '#fff';

	if (!userSettings.data) {
		return <LoadingView />;
	}
	return (
		<ElementList
			style={{width: '100%'}}
			elements={[
				{
					type: 'toggle',
					icon: <Driver size="24" color={color} style={{ minWidth: 24 }} />,
					title: translate('dataCollection'),
					description:
						"Acceptez-vous la récupération de vos données pour l'amélioration de Chromacase ?",
					data: {
						value: settings.dataCollection,
						onToggle: () =>
							dispatch(
								updateSettings({ dataCollection: !settings.dataCollection })
							),
					},
				},
				{
					type: 'toggle',
					icon: <Shop size="24" color={color} style={{ minWidth: 24 }} />,
					title: translate('customAds'),
					description: 'Afficher les suggestions dans la section des recommandations',
					data: {
						value: settings.customAds,
						onToggle: () =>
							dispatch(updateSettings({ customAds: !settings.customAds })),
					},
				},
				{
					type: 'toggle',
					icon: <Like1 size="24" color={color} style={{ minWidth: 24 }} />,
					title: translate('recommendations'),
					description: 'Souhaitez-vous recevoir nos conseils et recommandations ?',
					data: {
						value: userSettings.data.recommendations,
						onToggle: () =>
							updateUserSettings({
								recommendations: !userSettings.data.recommendations,
							}),
					},
				},
			]}
		/>
	);
};

export default PrivacySettings;
