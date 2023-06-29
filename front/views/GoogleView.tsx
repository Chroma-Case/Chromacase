import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import API, { AccessToken } from '../API';
import { setAccessToken } from '../state/UserSlice';
import { Text } from 'native-base';
import { useRoute } from '@react-navigation/native';

const GoogleView = () => {
	const dispatch = useDispatch();
	const route = useRoute();

	useEffect(() => {
		const params = route.path?.replace('/logged/google', '');
		async function run() {
			const accessToken = await API.fetch({
				route: `/auth/logged/google${params}`,
				method: 'GET',
			}).then((responseBody) => responseBody.access_token as AccessToken);
			dispatch(setAccessToken(accessToken));
		}
		run();
	}, []);

	return <Text>Loading please wait</Text>;
};

export default GoogleView;
