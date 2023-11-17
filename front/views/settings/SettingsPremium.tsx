import API from '../../API';
import React from 'react';
import { LoadingView } from '../../components/Loading';
import ElementList from '../../components/GtkUI/ElementList';
import { translate } from '../../i18n/i18n';
import { useQuery } from '../../Queries';
import { Designtools, Magicpen, Star1 } from 'iconsax-react-native';

// Too painful to infer the settings-only, typed navigator. Gave up
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PremiumSettings = () => {
	const userQuery = useQuery(API.getUserInfo);

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
	const user = userQuery.data;
	return (
		<ElementList
			style={{ width: '100%' }}
			elements={[
				{
					icon: Star1,
					type: 'text',
					title: translate('settingsPremiumTabPremiumAccountSectionTitle'),
					description: translate('settingsPremiumTabPremiumAccountSectionDescription'),
					data: {
						text: translate(user.premium ? 'yes' : 'no'),
					},
				},
				{
					icon: Magicpen,
					type: 'toggle',
					title: translate('settingsPremiumTabPianoMagiqueSectionTitle'),
					description: translate('settingsPremiumTabPianoMagiqueSectionDescription'),
					helperText: translate('settingsPremiumTabPianoMagiqueSectionHelper'),
					disabled: true,
					data: {
						value: false,
						onToggle: () => {},
					},
				},
				{
					icon: Designtools,
					type: 'dropdown',
					title: translate('settingsPremiumTabThemePianoSectionTitle'),
					description: translate('settingsPremiumTabThemePianoSectionDescription'),
					disabled: true,
					data: {
						value: 'default',
						onSelect: () => {},
						options: [
							{
								label: 'Default',
								value: 'default',
							},
							{
								label: 'Catpuccino',
								value: 'catpuccino',
							},
						],
					},
				},
			]}
		/>
	);
};

export default PremiumSettings;
