import { useEffect, useRef, useState } from 'react';
import { Slider, Text, View, IconButton, Icon, Switch } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';


const MetronomeToggle = (props: { enabled: boolean, onToggle: (stateAfterToggle: boolean) => void }) => {
	const [isEnabled, setEnabled] = useState(false);

	useEffect(() => {
		setEnabled(props.enabled)
	}, [props.enabled])
	return <Switch value={isEnabled} onToggle={() => {
		props.onToggle(!isEnabled);
		setEnabled(!isEnabled);
	}} />
}

export const MetronomeControls = ({ paused = false, bpm }: { paused?: boolean; bpm: number }) => {
	const audio = useRef<Audio.Sound | null>(null);
	const enabled = useRef<boolean>(false);
	const volume = useRef<number>(50);

	useEffect(() => {
		if (!enabled) {
			return;
		} else if (!audio.current) {
			Audio.Sound.createAsync(require('../assets/metronome.mp3')).then((a) => {
				audio.current = a.sound;
			});
		}
		return () => {
			audio.current?.unloadAsync();
		};
	}, [enabled]);
	useEffect(() => {
		if (paused) return;
		const int = setInterval(() => {
			if (!enabled.current) return;
			if (!audio.current) return;
			audio.current?.playAsync();
		}, 60000 / bpm);
		return () => clearInterval(int);
	}, [bpm, paused]);
	useEffect(() => {
		audio.current?.setVolumeAsync(volume.current / 100);
	}, [volume.current]);
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
					onPress={() => enabled.current = !enabled.current}
				/>
				<Slider
					maxWidth={'500px'}
					flex={1}
					defaultValue={volume.current}
					onChange={(x) => volume.current = x}
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
