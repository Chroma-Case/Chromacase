import { Text, useTheme } from 'native-base';
import { MutableRefObject, useEffect, useState } from 'react';

export let updateTime: (() => void) | undefined = undefined;

type PlayTimestampShowProps = {
	paused: boolean;
	time: MutableRefObject<number>;
};

export const PlayTimestampShow = ({ paused, time }: PlayTimestampShowProps) => {
	const { colors } = useTheme();
	const textColor = colors.text;
	const [timeD, setTimeD] = useState<number>(time.current);

	updateTime = () => {
		setTimeD(time.current);
	};

	useEffect(updateTime, [time]);
	return (
		<Text color={textColor[900]}>
			{timeD < 0
				? paused
					? '0:00'
					: Math.floor((timeD % 60000) / 1000)
							.toFixed(0)
							.toString()
				: `${Math.floor(timeD / 60000)}:${Math.floor((timeD % 60000) / 1000)
						.toFixed(0)
						.toString()
						.padStart(2, '0')}`}
		</Text>
	);
};
