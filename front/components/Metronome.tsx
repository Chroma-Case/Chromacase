import { useEffect, useRef, useState } from 'react';
import { Slider, Text, View, IconButton, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const MetronomeControls = ({ paused = false, bpm }: { paused?: boolean; bpm: number }) => {
	const ref = useRef<HTMLAudioElement | null>(null);
	const [enabled, setEnabled] = useState<boolean>(false);
	const [volume, setVolume] = useState<number>(50);

	useEffect(() => {
		if (paused) return;
		const int = setInterval(() => {
			if (!enabled) return;
			if (!ref.current) ref.current = new Audio('/assets/metronome.mp3');
			ref.current.volume = volume / 100;
			ref.current.play();
		}, 60000 / bpm);
		return () => clearInterval(int);
	}, [bpm, paused, enabled, volume]);
	return (
		<View flex={1}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<Text>Métronome</Text>
				<Icon as={<MaterialCommunityIcons name="metronome" size={24} color="white" />} />
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<IconButton
					icon={
						<Ionicons
							name={enabled ? 'volume-high-outline' : 'volume-mute-outline'}
							size={24}
							color="white"
						/>
					}
					onPress={() => setEnabled(!enabled)}
				/>
				<Slider
					maxWidth={'500px'}
					flex={1}
					defaultValue={volume}
					onChange={(x) => setVolume(x)}
				>
					<Slider.Track>
						<Slider.FilledTrack />
					</Slider.Track>
					<Slider.Thumb />
				</Slider>
			</View>
		</View>
	);
};
