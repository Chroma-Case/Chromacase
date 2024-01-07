import API from '../API';
import { useNavigation } from '../Navigation';
import ForgotPasswordForm from '../components/forms/forgotPasswordForm';

const ForgotPasswordView = () => {
	const navigation = useNavigation();

	async function handleSubmit(email: string) {
		try {
			await API.fetch({
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				route: `/auth/forgot-password?email=${email}`,
				method: 'PUT',
			});
			navigation.navigate('Home');
			return 'email sent';
		} catch {
			return 'Error with email, please contact support';
		}
	}
	return (
		<div>
			<ForgotPasswordForm onSubmit={handleSubmit} />
		</div>
	);
};

export default ForgotPasswordView;
