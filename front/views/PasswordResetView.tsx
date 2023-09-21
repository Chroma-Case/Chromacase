import { useState } from 'react';
import API from '../API';
import { useNavigation } from '../Navigation';
import { useRoute } from '@react-navigation/native';
import PasswordResetForm from '../components/forms/passwordResetForm';

const PasswordResetView = () => {
	const navigation = useNavigation();
	const route = useRoute();

	const handlePasswordReset = async (password: string) => {
		try {
			await API.fetch({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				route: `/auth/password-reset?token=${(route.params as any).token}`,
				method: 'PUT',
				body: {
					password,
				},
			});
			navigation.navigate('Home');
			return 'password succesfully reset';
		} catch {
			return 'password reset failed';
		}
	};

	return (
		<div>
			<PasswordResetForm onSubmit={(password) => handlePasswordReset(password)} />
		</div>
	);
};

export default PasswordResetView;
