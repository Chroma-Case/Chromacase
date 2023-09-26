import { HStack, Icon, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

type DurationComponentProps = {
	length: number | undefined;
};

const DurationComponent = ({ length }: DurationComponentProps) => {
	const minutes = Math.floor((length ?? 0) / 60);
	const seconds = Math.round((length ?? 0) - minutes * 60);

	return (
		<HStack space={3}>
			<Icon
				as={MaterialIcons}
				name="timer"
				size={'20px'}
				color="coolGray.800"
				_dark={{
					color: 'warmGray.50',
				}}
			/>
			<Text
				style={{
					flexShrink: 0,
				}}
				fontSize={'16px'}
			>
				{length ? `${minutes}'${seconds}` : "--'--"}
			</Text>
		</HStack>
	);
};

export default DurationComponent;
