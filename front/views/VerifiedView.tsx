import { useEffect, useState } from 'react';
import API from '../API';
import { Text } from 'native-base';
import { useNavigation } from '../Navigation';
import { useRoute } from '@react-navigation/native';

const VerifiedView = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		async function run() {
			try {
				await API.fetch({
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					route: `/auth/verify?token=${(route.params as any).token}`,
					method: 'PUT',
				});
				navigation.navigate('Home', {});
			} catch {
				setFailed(true);
			}
		}
		run();
	}, []);

	return failed ? (
		<Text>Email verification failed. The token has expired or is invalid.</Text>
	) : (
		<Text>Loading please wait</Text>
	);
};

export default VerifiedView;
