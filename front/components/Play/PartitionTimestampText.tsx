import { Text, useTheme } from 'native-base';
import { timestampAtom, partitionStateAtom } from './PartitionMagic';
import { useAtom } from 'jotai';

export const TimestampDisplay = () => {
	const [time] = useAtom(timestampAtom);
	const [partitionState] = useAtom(partitionStateAtom);
	const { colors } = useTheme();
	const textColor = colors.text;
	const paused = partitionState === 'paused';
	if (time < 0) {
		if (paused) {
			return <Text color={textColor[900]}>0:00</Text>;
		}
		return (
			<Text color={textColor[900]}>
				{Math.floor((time % 60000) / 1000)
					.toFixed(0)
					.toString()}
			</Text>
		);
	}
	return (
		<Text color={textColor[900]}>
			{`${Math.floor(time / 60000)}:${Math.floor((time % 60000) / 1000)
				.toFixed(0)
				.toString()
				.padStart(2, '0')}`}
		</Text>
	);
};
