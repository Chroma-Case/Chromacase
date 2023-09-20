import { useEffect, useState } from 'react';
import API from '../API';
import { Text } from 'native-base';
import { useNavigation } from '../Navigation';
import { useRoute } from '@react-navigation/native';
import ForgotPasswordForm from '../components/forms/forgotPasswordForm';

const ForgotPasswordView = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const [failed, setFailed] = useState(false);

	async function handleSubmit(email: string) {
		try {
			await API.fetch({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				route: `/auth/forgot-password?email=${email}`,
				method: 'PUT',
			});
			navigation.navigate('Home');
			return "email sent"
		} catch {
			setFailed(true);
			return "Error with email, please contact support"
		}
	}
	return (<div>
		<ForgotPasswordForm onSubmit={handleSubmit}/>
	</div>)
};

export default ForgotPasswordView;
