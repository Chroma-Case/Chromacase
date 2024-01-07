import { Button, Center, VStack } from 'native-base';
import Translate from '../components/Translate';
import { useNavigation } from '../Navigation';

const ErrorView = () => {
	const navigation = useNavigation();
	return (
		<Center style={{ flexGrow: 1 }}>
			<VStack space={3} alignItems="center">
				<Translate translationKey="anErrorOccured" />
				<Button onPress={() => navigation.navigate('Home')}>
					<Translate translationKey="goBackHome" />
				</Button>
			</VStack>
		</Center>
	);
};

export default ErrorView;
