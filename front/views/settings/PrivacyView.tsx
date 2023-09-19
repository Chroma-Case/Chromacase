import React from 'react';
import { Center, Flex, Heading } from 'native-base';
import { translate } from '../../i18n/i18n';
import ElementList from '../../components/GtkUI/ElementList';
import { useDispatch } from 'react-redux';
import { RootState, useSelector } from '../../state/Store';
import { updateSettings } from '../../state/SettingsSlice';
import useUserSettings from '../../hooks/userSettings';
import { LoadingView } from '../../components/Loading';
import { Driver, Driver2, Like1, Shop } from 'iconsax-react-native';

const PrivacyView = () => {
	const dispatch = useDispatch();
	const settings = useSelector((state: RootState) => state.settings.local);
	const { settings: userSettings, updateSettings: updateUserSettings } = useUserSettings();

	if (!userSettings.data) {
		return <LoadingView />;
	}
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
						type: 'toggle',
						icon: <Driver size="24" color="#FFF" style={{minWidth: 24}}/>,
						title: translate('dataCollection'),
						description: 'Acceptez-vous la récupération de vos données pour l\'amélioration de Chromacase ?',
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
						icon: <Shop size="24" color="#FFF" style={{minWidth: 24}}/>,
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
						icon: <Like1 size="24" color="#FFF" style={{minWidth: 24}}/>,
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
		</Flex>
	);
};

export default PrivacyView;
