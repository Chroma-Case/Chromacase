import { Box, Icon, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

type DurationComponentProps = {
	length: number;
};

const DurationComponent = ({ length }: DurationComponentProps) => {
	const minutes = Math.floor(length / 60);
	const seconds = Math.round(length - minutes * 60);

	return (
		<Box flexDirection={'row'} >
			<Icon as={MaterialIcons} name="timer" color="coolGray.800" _dark={{
		color: "warmGray.50"
		}} />
			<Text
				style={{
					flexShrink: 0,
				}}
				fontSize={'sm'}
			>
				{`${minutes}'${seconds}` ?? '--\'--'}
			</Text>
		</Box>
	);
};

export default DurationComponent;