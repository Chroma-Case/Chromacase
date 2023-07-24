import API from '../../API';
import { useDispatch } from 'react-redux';
import { unsetAccessToken } from '../../state/UserSlice';
import React from 'react';
import { Column, Text, Button, Box, Flex, Center, Heading, Avatar, Popover } from 'native-base';
import TextButton from '../../components/TextButton';
import { LoadingView } from '../../components/Loading';
import ElementList from '../../components/GtkUI/ElementList';
import { translate } from '../../i18n/i18n';
import { useQuery } from '../../Queries';

const getInitials = (name: string) => {
	return name
		.split(' ')
		.map((n) => n[0])
		.join('');
};

// Too painful to infer the settings-only, typed navigator. Gave up
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProfileSettings = ({ navigation }: { navigation: any }) => {
	const userQuery = useQuery(API.getUserInfo);
	const dispatch = useDispatch();

	if (!userQuery.data || userQuery.isLoading) {
		return <LoadingView />;
	}
	const user = userQuery.data;
	return (
		<Flex
			style={{
				flex: 1,
				alignItems: 'center',
				paddingTop: 40,
			}}
		>
			<Column
				style={{
					width: '100%',
					alignItems: 'center',
				}}
			>
				<Center>
					<Avatar size="2xl" source={{ uri: user.data.avatar }}>
						{getInitials(user.name)}
					</Avatar>
				</Center>
				<ElementList
					style={{
						marginTop: 20,
						width: '90%',
						maxWidth: 850,
					}}
					elements={[
						{
							type: 'text',
							title: translate('email'),
							data: {
								text: user.email || translate('NoAssociatedEmail'),
								onPress: () => {
									navigation.navigate('ChangeEmail');
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
							type: 'text',
							title: translate('username'),
							data: {
								text: user.name,
							},
						},
						{
							type: 'text',
							title: 'ID',
							helperText: 'This is your unique ID, be proud of it!',
							data: {
								text: user.id.toString(),
							},
						},
						{
							type: 'text',
							title: 'Google Account',
							data: {
								text: user.googleID ? 'Linked' : 'Not linked',
							},
							// type: 'custom',
							// data: user.googleID
							// 	? <Button><Text>Unlink</Text></Button>
							// 	: <Button><Text>Link</Text></Button>,
						},
						{
							type: 'text',
							title: translate('nbGamesPlayed'),
							data: {
								text: user.data.gamesPlayed.toString(),
							},
						},
						{
							type: 'text',
							title: 'XP',
							description: translate('XPDescription'),
							data: {
								text: user.data.xp.toString(),
							},
						},
						{
							type: 'text',
							title: translate('userCreatedAt'),
							helperText:
								'La date de création est actuellement arbitraire car le serveur ne retourne pas cette information',
							data: {
								text: user.data.createdAt.toLocaleDateString(),
							},
						},
						{
							type: 'text',
							title: translate('premiumAccount'),
							data: {
								text: translate(user.premium ? 'yes' : 'no'),
							},
						},
					]}
				/>
				<Heading fontSize="20" mt="7">
					Fonctionnalités premium
				</Heading>
				<ElementList
					style={{
						marginTop: 10,
						width: '90%',
						maxWidth: 850,
					}}
					elements={[
						{
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
							type: 'dropdown',
							title: 'Thème de piano',
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
			</Column>

			<Box mt={10}>
				{!user.isGuest && (
					<TextButton
						onPress={() => dispatch(unsetAccessToken())}
						translate={{
							translationKey: 'signOutBtn',
						}}
					/>
				)}
				{user.isGuest && (
					<Popover
						trigger={(triggerProps) => (
							<Button {...triggerProps}>{translate('signOutBtn')}</Button>
						)}
					>
						<Popover.Content>
							<Popover.Arrow />
							<Popover.Body>
								<Heading size="md" mb={2}>
									{translate('Attention')}
								</Heading>
								<Text>
									{translate('YouAreCurrentlyConnectedWithAGuestAccountWarning')}
								</Text>
								<Button.Group variant="ghost" space={2}>
									<Button
										onPress={() => dispatch(unsetAccessToken())}
										colorScheme="red"
									>
										{translate('signOutBtn')}
									</Button>
									<Button
										onPress={() => {
											navigation.navigate('GuestToUser');
										}}
										colorScheme="green"
									>
										{translate('signUpBtn')}
									</Button>
								</Button.Group>
							</Popover.Body>
						</Popover.Content>
					</Popover>
				)}
			</Box>
		</Flex>
	);
};

export default ProfileSettings;
