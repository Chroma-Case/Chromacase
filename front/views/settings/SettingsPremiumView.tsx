import API from '../../API';
import React from 'react';
import { Flex } from 'native-base';
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
		<Flex
			style={{
				flex: 1,
				alignItems: 'center',
				paddingTop: 32,
			}}
		>
			<ElementList
				style={{
					marginTop: 10,
					width: '90%',
					maxWidth: 850,
				}}
				elements={[
					{
						icon: <Star1 size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'text',
						title: translate('premiumAccount'),
						description:
							'Personalisation premium et outils vous permetant de passer au niveau supperieur',
						data: {
							text: translate(user.premium ? 'yes' : 'no'),
						},
					},
					{
						icon: <Magicpen size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'toggle',
						title: 'Piano Magique',
						description:
							'Fait apparaître de la lumière sur le piano pendant les parties',
						helperText:
							'Vous devez posséder le module physique lumineux Chromacase pour pouvoir utiliser cette fonctionnalité',
						disabled: true,
						data: {
							value: false,
							onToggle: () => {},
						},
					},
					{
						icon: <Designtools size="24" color="#FFF" style={{ minWidth: 24 }} />,
						type: 'dropdown',
						title: 'Thème de piano',
						description: 'Définissez le theme de votre piano',
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
		</Flex>
	);
};

export default PremiumSettings;