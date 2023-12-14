import { useEffect, useState } from 'react';
import API from '../API';
import { useNavigation } from '../Navigation';
import { useRoute } from '@react-navigation/native';
import { Translate } from '../i18n/i18n';

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
		<Translate translationKey={'emailCheckFailed'} />
	) : (
		<Translate translationKey={'loading'} />
	);
};

export default VerifiedView;
